// Gym App — API trung gian giữa web (GitHub Pages) và Google Sheet.
// Dán vào Extensions > Apps Script của Sheet, đổi SECRET, chạy setup() 1 lần, rồi Deploy > Web app.

const SECRET = 'doi-ma-nay-truoc-khi-deploy'; // mã đăng nhập trên app

const SHEETS = {
  Settings:        ['id', 'json'],
  Schedule:        ['id', 'day', 'time', 'name', 'exercises'],
  Sessions:        ['id', 'date', 'name', 'start', 'end'],
  WorkoutLog:      ['id', 'date', 'exercise', 'set', 'reps', 'kg', 'rpe'],
  WeightLog:       ['id', 'date', 'kg'],
  BodyMeasurement: ['id', 'date', 'waist', 'chest', 'arm', 'photo'],
  Recovery:        ['id', 'date', 'sleep', 'soreness'],
  ExerciseLibrary: ['id', 'name', 'muscle', 'equipment', 'image'],
  FoodLibrary:     ['id', 'name', 'kcal', 'protein', 'carb', 'fat', 'portion'],
  NutritionLog:    ['id', 'date', 'food', 'grams', 'kcal', 'protein', 'carb', 'fat'],
};

function setup() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach(name => {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.getRange('A:Z').setNumberFormat('@'); // giữ nguyên chuỗi, không để Sheet tự đổi ngày/giờ
    sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
}

function doGet() {
  return json({ ok: true, msg: 'Gym API đang chạy' });
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (_) { return json({ ok: false, error: 'bad json' }); }
  if (req.key !== SECRET) return json({ ok: false, error: 'Sai mã đăng nhập' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (req.action === 'upload') return json({ ok: true, url: upload(req) });
    (req.ops || []).forEach(apply);
    return json({ ok: true, data: readAll() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// op = { op: 'put' | 'del', sheet, row }  — put = thêm mới hoặc ghi đè theo id
function apply(o) {
  const cols = SHEETS[o.sheet];
  if (!cols) throw new Error('Sheet không hợp lệ: ' + o.sheet);
  const sh = SpreadsheetApp.getActive().getSheetByName(o.sheet);
  const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getDisplayValues().map(r => r[0]);
  const idx = ids.indexOf(String(o.row.id)); // 0 = header, không bao giờ trùng id
  if (o.op === 'del') { if (idx > 0) sh.deleteRow(idx + 1); return; }
  const values = [cols.map(c => o.row[c] == null ? '' : String(o.row[c]))];
  if (idx > 0) sh.getRange(idx + 1, 1, 1, cols.length).setValues(values);
  else sh.getRange(sh.getLastRow() + 1, 1, 1, cols.length).setNumberFormat('@').setValues(values);
}

function readAll() {
  const ss = SpreadsheetApp.getActive(), out = {};
  Object.keys(SHEETS).forEach(name => {
    const vals = ss.getSheetByName(name).getDataRange().getDisplayValues();
    const head = vals.shift();
    out[name] = vals.filter(r => r[0]).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
  });
  return out;
}

// Ảnh tiến trình: lưu vào Drive, trả link xem được trong <img>
function upload(req) {
  const it = DriveApp.getFoldersByName('GymApp Photos');
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder('GymApp Photos');
  const blob = Utilities.newBlob(Utilities.base64Decode(req.data), 'image/jpeg', req.name || 'photo.jpg');
  const f = folder.createFile(blob);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/thumbnail?id=' + f.getId() + '&sz=w1200';
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
