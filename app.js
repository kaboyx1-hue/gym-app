'use strict';
// ===== Hằng số =====
const API = 'https://script.google.com/macros/s/AKfycbzKIgUwLDVL47aOICj-ciDLXGXbF4OkTdzFhFM-3hYK3XkUuUlSnGHUcroUXMiaC9z4/exec'; // chặn bằng mật khẩu
const OWNER = 'Mr. Henry';
const EXDB = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/'; // 876 bài tập + ảnh, public domain
const MUSCLE = { chest: 'Ngực', shoulders: 'Vai', triceps: 'Tay sau', biceps: 'Tay trước', forearms: 'Cẳng tay', lats: 'Xô', 'middle back': 'Lưng giữa', 'lower back': 'Lưng dưới', traps: 'Cầu vai', abdominals: 'Bụng', quadriceps: 'Đùi trước', hamstrings: 'Đùi sau', glutes: 'Mông', calves: 'Bắp chân', adductors: 'Đùi trong', abductors: 'Đùi ngoài', neck: 'Cổ' };
const EQUIP = { barbell: 'Tạ đòn', dumbbell: 'Tạ đơn', cable: 'Cáp', machine: 'Máy', 'body only': 'Không dụng cụ', kettlebells: 'Tạ ấm', bands: 'Dây kháng lực', 'e-z curl bar': 'Đòn EZ', 'exercise ball': 'Bóng tập', 'medicine ball': 'Bóng tạ', 'foam roll': 'Con lăn', other: 'Khác' };
const LEVEL = { beginner: 'Cơ bản', intermediate: 'Trung bình', expert: 'Nâng cao' };
const DAYS = ['', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
// Bài phổ biến mà thư viện gốc không có (chưa có ảnh minh hoạ)
const EXTRA = [
  { id: 'x_Cable_Lateral_Raise', name: 'Cable Lateral Raise (standing, one arm)', primaryMuscles: ['shoulders'], secondaryMuscles: ['traps'], equipment: 'cable', level: 'beginner', category: 'strength', images: [],
    vi: { n: 'Nâng vai ngang cáp (đứng, một tay)', s: ['Đặt ròng rọc ở vị trí thấp nhất, gắn tay cầm đơn. Đứng nghiêng người, tay tập ở xa máy, cầm tay cầm bắt chéo trước người.', 'Hơi gập khuỷu tay, siết cơ bụng, giữ thân thẳng. Đây là tư thế bắt đầu.', 'Thở ra, nâng tay sang ngang tới ngang vai, dẫn bằng khuỷu tay, không nhún vai.', 'Dừng 1 giây ở trên, hít vào và hạ chậm về tư thế bắt đầu, giữ căng cáp suốt động tác.', 'Làm đủ số lần rồi đổi tay.'] } },
];
const POPULAR = ['x_Cable_Lateral_Raise', 'Cable_Seated_Lateral_Raise', 'Barbell_Bench_Press_-_Medium_Grip', 'Barbell_Full_Squat', 'Barbell_Deadlift', 'Pullups', 'Standing_Military_Press', 'Bent_Over_Barbell_Row', 'Wide-Grip_Lat_Pulldown', 'Leg_Press', 'Romanian_Deadlift', 'Dumbbell_Bench_Press', 'Incline_Dumbbell_Press', 'Dumbbell_Shoulder_Press', 'Side_Lateral_Raise', 'Barbell_Curl', 'Hammer_Curls', 'Triceps_Pushdown', 'Dips_-_Chest_Version', 'Seated_Cable_Rows', 'One-Arm_Dumbbell_Row', 'Face_Pull', 'Barbell_Hip_Thrust', 'Dumbbell_Lunges', 'Lying_Leg_Curls', 'Leg_Extensions', 'Standing_Calf_Raises', 'Goblet_Squat', 'Cable_Crossover', 'Dumbbell_Flyes', 'Pushups', 'Plank', 'Hanging_Leg_Raise', 'Cable_Crunch'];
// Món Việt: [tên, kcal, protein, carb, fat, khẩu phần g] trên 100g — số ước tính, đủ theo dõi xu hướng
const FOODS = [
  ['Cơm trắng', 130, 2.7, 28, 0.3, 150], ['Cơm gạo lứt', 112, 2.6, 23.5, 0.9, 150], ['Xôi trắng', 175, 3.5, 36, 1.5, 150],
  ['Cơm tấm sườn', 190, 9, 24, 6.5, 400], ['Cơm chiên', 175, 5, 25, 6, 300], ['Bánh mì không', 250, 8, 50, 2.5, 100],
  ['Bánh mì thịt', 240, 10, 30, 9, 200], ['Phở bò (cả tô)', 85, 5, 11, 2.3, 500], ['Bún bò Huế (cả tô)', 90, 5.5, 10, 3, 550],
  ['Bún chả (cả suất)', 150, 8, 17, 5.5, 400], ['Bún riêu (cả tô)', 80, 4.5, 10, 2.5, 500], ['Hủ tiếu (cả tô)', 85, 4.5, 12, 2, 500],
  ['Mì gói (khô)', 460, 9, 60, 20, 75], ['Bánh cuốn', 140, 5, 22, 3.5, 250], ['Gỏi cuốn', 110, 6, 17, 2, 60],
  ['Chả giò chiên', 250, 9, 20, 15, 30], ['Thịt kho tàu', 250, 15, 8, 18, 150], ['Thịt lợn nạc', 139, 19, 0, 7, 100],
  ['Thịt bò nạc', 118, 21, 0, 3.8, 100], ['Ức gà luộc', 165, 31, 0, 3.6, 150], ['Đùi gà bỏ da', 175, 26, 0, 8, 150],
  ['Trứng gà luộc', 155, 13, 1.1, 11, 50], ['Lòng trắng trứng', 52, 11, 0.7, 0.2, 33], ['Cá basa', 105, 15, 0, 4.5, 150],
  ['Cá hồi', 208, 20, 0, 13, 150], ['Tôm luộc', 99, 24, 0.2, 0.3, 100], ['Đậu phụ', 95, 10.9, 0.7, 5.4, 100],
  ['Canh chua cá', 45, 4, 4, 1.5, 300], ['Rau muống xào', 60, 3, 4, 4, 150], ['Rau cải luộc', 20, 1.5, 3, 0.2, 150],
  ['Khoai lang luộc', 86, 1.6, 20, 0.1, 150], ['Chuối', 89, 1.1, 23, 0.3, 120], ['Táo', 52, 0.3, 14, 0.2, 180],
  ['Yến mạch', 389, 17, 66, 7, 40], ['Sữa tươi không đường', 62, 3.2, 4.8, 3.3, 220], ['Sữa chua không đường', 61, 3.5, 4.7, 3.3, 100],
  ['Whey protein', 390, 78, 8, 6, 30], ['Đậu phộng', 567, 26, 16, 49, 30], ['Bơ đậu phộng', 588, 25, 20, 50, 16],
  ['Hạt điều', 553, 18, 30, 44, 30], ['Cà phê sữa đá', 75, 1.5, 12, 2, 200], ['Trà sữa trân châu', 80, 1, 15, 2, 500],
  ['Nước mía', 65, 0, 16, 0, 300], ['Bia', 43, 0.5, 3.6, 0, 330],
].map(([name, kcal, protein, carb, fat, portion], i) => ({ id: 'vn' + i, name, kcal, protein, carb, fat, portion, builtin: true }));
const NUM = ['day', 'set', 'reps', 'kg', 'rpe', 'waist', 'chest', 'arm', 'sleep', 'soreness', 'kcal', 'protein', 'carb', 'fat', 'grams', 'portion'];
const IC = {
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  ok: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  chev: '<svg viewBox="0 0 24 24" style="color:var(--muted)"><path d="M9 5l7 7-7 7"/></svg>',
  left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  dumb: '<svg viewBox="0 0 24 24"><path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12"/></svg>',
};

// ===== Tiện ích =====
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const addDays = (s, n) => { const d = new Date(s + 'T00:00'); d.setDate(d.getDate() + n); return ymd(d); };
const dow = s => ((new Date(s + 'T00:00').getDay() + 6) % 7) + 1; // Thứ 2 = 1 ... CN = 7
const weekStart = s => addDays(s, 1 - dow(s));
const dm = s => s.slice(8) + '/' + s.slice(5, 7);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const nf = (n, d = 1) => (+n || 0).toLocaleString('vi-VN', { maximumFractionDigits: d });
const secs = t => { const [h, m, s] = (t || '0:0:0').split(':').map(Number); return h * 3600 + m * 60 + (s || 0); };
const dur = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h} giờ ${m} phút` : `${m} phút`; };
const clock = s => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 3600) ? Math.floor(s / 3600) + ':' : ''}${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; };
const e1rm = (kg, reps) => reps <= 1 ? kg : kg * (1 + reps / 30); // công thức Epley
const LB = 2.20462;
const unit = () => prof().unit === 'lbs' ? 'lbs' : 'kg';
const toU = kg => unit() === 'lbs' ? kg * LB : kg;
const fromU = v => unit() === 'lbs' ? v / LB : v;
const W = kg => kg ? nf(toU(kg)) + ' ' + unit() : 'BW';

// ===== Dữ liệu: localStorage là bản chính trên máy, đồng bộ lên Sheet qua hàng đợi =====
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('gym.' + k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('gym.' + k, JSON.stringify(v)); } catch { toast('Bộ nhớ máy đầy'); } },
};
let DATA = store.get('data', {}), QUEUE = store.get('queue', []), AUTH = store.get('auth', null);
const rows = sh => DATA[sh] || (DATA[sh] = []);
const save = () => { store.set('data', DATA); store.set('queue', QUEUE); };
function norm(data) {
  for (const sh in data) data[sh].forEach(r => NUM.forEach(k => { if (k in r) r[k] = r[k] === '' ? 0 : +r[k]; }));
  return data;
}
function applyLocal(o) {
  const list = rows(o.sheet), i = list.findIndex(r => r.id === o.row.id);
  if (o.op === 'del') { if (i >= 0) list.splice(i, 1); }
  else if (i >= 0) list[i] = { ...o.row }; else list.push({ ...o.row });
}
function commit(o) { applyLocal(o); if (AUTH?.api) QUEUE.push(o); save(); queueSync(); } // offline thuần: không cần hàng đợi
function put(sheet, row) { commit({ op: 'put', sheet, row }); }
function del(sheet, id) { commit({ op: 'del', sheet, row: { id } }); }

async function api(body) {
  const r = await fetch(AUTH.api, { method: 'POST', body: JSON.stringify({ ...body, key: AUTH.key }) }); // text/plain → không preflight CORS
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'Lỗi API');
  return j;
}
let syncing = false, syncT;
const setSync = c => $('#sync').className = c;
function queueSync() { clearTimeout(syncT); syncT = setTimeout(sync, 700); }
async function sync() {
  if (!AUTH?.api) return setSync('off');
  if (syncing) return queueSync();
  syncing = true; setSync('pending');
  const ops = QUEUE.slice(), before = JSON.stringify(DATA);
  try {
    const j = await api({ ops });
    QUEUE = QUEUE.slice(ops.length);
    DATA = norm(j.data); QUEUE.forEach(applyLocal);
    store.set('last', Date.now()); save();
    setSync(QUEUE.length ? 'pending' : '');
    if (JSON.stringify(DATA) !== before && !document.activeElement?.matches('input,select,textarea')) draw();
  } catch (e) {
    setSync('err'); console.warn(e);
  } finally { syncing = false; }
}

// ===== Hồ sơ & tính toán =====
const prof = () => { try { return JSON.parse(rows('Settings').find(r => r.id === 'profile')?.json || '{}'); } catch { return {}; } };
function setProf(k, v) { const p = { ...prof(), [k]: v }; put('Settings', { id: 'profile', json: JSON.stringify(p) }); applyTheme(); return p; }
const weights = () => rows('WeightLog').slice().sort((a, b) => a.date < b.date ? -1 : 1);
const lastWeight = () => weights().at(-1)?.kg || 0;
const ACT = { low: 1.375, mid: 1.55, high: 1.725 }; // hệ số vận động
const METAB = { slow: 0.93, normal: 1, fast: 1.07 }; // trao đổi chất tự khai: ±7% so với công thức
const FAT_SHARE = { ecto: 0.22, meso: 0.25, endo: 0.3 }; // tạng người: ecto nhiều carb hơn, endo ít carb hơn
const metabOf = p => p.metab || { ecto: 'fast', endo: 'slow' }[p.body] || 'normal';
// Đo mức tiêu hao THẬT: calo ăn trung bình − (xu hướng cân nặng × 7700) trong 21 ngày gần nhất
function measuredTdee() {
  const end = today(), start = addDays(end, -21);
  const ws = weights().filter(w => w.date >= start);
  const days = [...new Set(rows('NutritionLog').filter(r => r.date >= start && r.date < end).map(r => r.date))];
  const need = { days: days.length, weighs: ws.length };
  if (days.length < 10 || ws.length < 4) return need;
  const xs = ws.map(w => (new Date(w.date) - new Date(start)) / 864e5), ys = ws.map(w => w.kg);
  const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
  const slope = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / (xs.reduce((a, x) => a + (x - mx) ** 2, 0) || 1); // kg/ngày
  const intake = days.reduce((a, d) => a + eaten(d).kcal, 0) / days.length;
  const tdee = intake - slope * 7700;
  return tdee > 1200 && tdee < 5000 ? { ...need, tdee: Math.round(tdee), intake: Math.round(intake), slope } : need;
}
function targets() {
  const p = prof(), w = lastWeight() || 65, tk = +p.targetKg || 0;
  const bmr = 10 * w + 6.25 * (+p.height || 170) - 5 * (+p.age || 25) + (p.sex === 'f' ? -161 : 5); // Mifflin-St Jeor
  const formula = bmr * (ACT[p.activity] || ACT.mid) * METAB[metabOf(p)];
  const real = measuredTdee();
  const tdee = p.useReal && real.tdee ? real.tdee : formula;
  const diff = tk ? tk - w : 0;
  const goal = tk ? (diff > 0.5 ? 'bulk' : diff < -0.5 ? 'cut' : 'maintain') : (p.goal || 'maintain');
  const pace = +p.pace || (goal === 'bulk' ? 0.25 : 0.5); // kg/tuần
  const adj = goal === 'maintain' ? 0 : (goal === 'bulk' ? 1 : -1) * pace * 7700 / 7; // ~7700 kcal ≈ 1 kg mỡ
  const floor = Math.max(p.sex === 'f' ? 1200 : 1500, bmr); // không cắt xuống dưới mức an toàn
  const auto = Math.round(Math.max(tdee + adj, goal === 'cut' ? floor : 0) / 10) * 10;
  const kcal = +p.kcal || auto;
  const protein = Math.round(w * { bulk: 1.8, cut: 2.2, maintain: 1.6 }[goal]);
  const fat = Math.round(kcal * (FAT_SHARE[p.body] || 0.25) / 9);
  const weeks = goal === 'maintain' || !tk ? 0 : Math.ceil(Math.abs(diff) / pace);
  return { kcal, auto, protein, fat, carb: Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4)), tdee: Math.round(tdee), formula: Math.round(formula), real, goal, pace, diff, weeks, floored: goal === 'cut' && tdee + adj < floor };
}
// Gợi ý món Việt bù phần dinh dưỡng còn thiếu trong ngày
const NOT_SUGGEST = /Bia|Trà sữa|Nước mía|Cà phê|Mì gói|Chả giò/;
function suggest(date) {
  const t = targets(), e = eaten(date), rem = { k: t.kcal - e.kcal, p: t.protein - e.protein, c: t.carb - e.carb, f: t.fat - e.fat };
  if (rem.k < 120) return { rem, list: [] };
  const needP = rem.p > 0 && rem.p * 4 / rem.k > 0.3; // protein còn thiếu nhiều so với calo còn lại
  const ate = new Set(rows('NutritionLog').filter(r => r.date === date).map(r => r.food));
  // Phân vai theo tỷ lệ năng lượng: đạm / tinh bột / rau-canh-trái cây
  const list = foods().filter(f => !NOT_SUGGEST.test(f.name) && !ate.has(f.name) && f.kcal > 0).map(f => {
    const ps = f.protein * 4 / f.kcal, cs = f.carb * 4 / f.kcal;
    const why = ps > 0.45 ? 'giàu đạm' : f.kcal <= 70 ? 'rau, canh, trái cây' : cs >= 0.55 ? 'tinh bột' : '';
    let g = f.portion || 100;
    if (f.kcal * g / 100 > rem.k) g = Math.floor(rem.k / f.kcal * 100 / 10) * 10; // thu nhỏ cho vừa calo còn lại
    const k = g / 100;
    return why && g >= 30 ? { f, g, K: f.kcal * k, P: f.protein * k, why, ps, cs } : null;
  }).filter(Boolean);
  const top = (why, n, by) => list.filter(x => x.why === why).sort(by).slice(0, n);
  const picked = [
    ...top('giàu đạm', needP ? 2 : 1, (a, b) => b.ps - a.ps || b.P - a.P), // đạm nạc trước
    ...(rem.c > 30 ? top('tinh bột', 1, (a, b) => (a.f.fat - b.f.fat) || b.cs - a.cs) : []), // tinh bột ít béo
    ...top('rau, canh, trái cây', 1, (a, b) => b.P - a.P),
  ];
  return { rem, list: picked, needP };
}
function eaten(date) {
  return rows('NutritionLog').filter(r => r.date === date).reduce((a, r) => ({ kcal: a.kcal + r.kcal, protein: a.protein + r.protein, carb: a.carb + r.carb, fat: a.fat + r.fat }), { kcal: 0, protein: 0, carb: 0, fat: 0 });
}
const session = date => rows('Sessions').find(s => s.date === date);
const sessSecs = s => !s?.start ? 0 : (s.end ? secs(s.end) : (s.date === today() ? secs(nowTime()) : secs(s.start))) - secs(s.start);
const burned = date => Math.round(sessSecs(session(date)) / 3600 * 5 * (lastWeight() || 65)); // MET ~5 cho tập tạ
function streak() {
  const days = new Set(['WorkoutLog', 'WeightLog', 'NutritionLog', 'Sessions'].flatMap(sh => rows(sh).map(r => r.date)));
  let d = today(), n = 0;
  if (!days.has(d)) d = addDays(d, -1); // hôm nay chưa ghi thì chưa tính là đứt chuỗi
  while (days.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
function heavyWeeks() { // số tuần liên tiếp có ≥3 buổi, tính từ lần deload gần nhất
  const since = prof().deloadAt || '', per = {};
  rows('Sessions').filter(s => s.end && s.date > since).forEach(s => { const w = weekStart(s.date); per[w] = (per[w] || 0) + 1; });
  let w = weekStart(today()), n = 0;
  if (!(per[w] >= 3)) w = addDays(w, -7);
  while (per[w] >= 3) { n++; w = addDays(w, -7); }
  return n;
}
const sched = day => rows('Schedule').find(r => r.day === day) || { id: 'd' + day, day, time: '', name: '', exercises: '' };
const schedIds = s => (s.exercises || '').split('|').filter(Boolean);
const logsOf = id => rows('WorkoutLog').filter(r => r.exercise === id).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.set - b.set);
function bestOf(list) {
  let kg = null, e1 = null, reps = null;
  for (const r of list) {
    if (!kg || r.kg > kg.kg || (r.kg === kg.kg && r.reps > kg.reps)) kg = r;
    if (!e1 || e1rm(r.kg, r.reps) > e1rm(e1.kg, e1.reps)) e1 = r;
    if (!reps || r.reps > reps.reps) reps = r;
  }
  return { kg, e1, reps };
}

// ===== Thư viện bài tập =====
let EX = null; // Map id -> bài tập
async function loadEx() {
  try {
    const [list, vi] = await Promise.all([
      fetch(EXDB + 'dist/exercises.json').then(r => r.json()),
      fetch('exercises-vi.json').then(r => r.ok ? r.json() : {}).catch(() => ({})), // tên + hướng dẫn tiếng Việt
    ]);
    list.push(...EXTRA);
    EX = new Map(list.map(e => [e.id, { id: e.id, name: vi[e.id]?.n || e.vi?.n || e.name, en: e.name, muscles: e.primaryMuscles, second: e.secondaryMuscles, equipment: e.equipment, level: e.level, category: e.category, steps: vi[e.id]?.s || e.vi?.s || e.instructions, imgs: e.images.map(p => EXDB + 'exercises/' + p) }]));
    if (AUTH && !document.activeElement?.matches('input,select,textarea')) draw();
    if (pickCb) pickList();
  } catch { toast('Không tải được thư viện bài tập — kiểm tra mạng'); }
}
function ex(id) {
  const c = rows('ExerciseLibrary').find(r => r.id === id);
  if (c) return { id, name: c.name, muscles: [c.muscle], second: [], equipment: c.equipment, level: '', steps: [], imgs: c.image ? [c.image] : [], custom: true };
  return EX?.get(id) || { id, name: id.replace(/_/g, ' '), muscles: [], second: [], steps: [], imgs: [], loading: !EX };
}
const fold = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'); // bỏ dấu để tìm
const allEx = () => [...rows('ExerciseLibrary').map(r => ex(r.id)), ...(EX ? EX.values() : [])];
const thumb = e => e.imgs[0] ? `<img class="thumb" loading="lazy" src="${esc(e.imgs[0])}" alt="" onload="this.classList.add('ok')" onerror="this.classList.add('ok')">` : `<div class="thumb ok" style="display:grid;place-items:center">${IC.dumb}</div>`;
const mus = e => e.muscles.map(m => MUSCLE[m] || m).join(', ');

// ===== Điều hướng: mỗi tab có ngăn xếp riêng, tối đa 3 lớp =====
const TABS = ['home', 'workout', 'food', 'progress', 'me'];
const R = { tab: 'home', stacks: Object.fromEntries(TABS.map(t => [t, []])), root: Object.fromEntries(TABS.map(t => [t, {}])) };
const cur = () => R.stacks[R.tab].at(-1) || { v: R.tab, p: R.root[R.tab] };
function nav(kind, fn, scroll = 0) {
  closeSheet();
  const run = () => { fn(); draw(true); window.scrollTo(0, scroll); };
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return run();
  document.documentElement.classList.add(kind);
  document.startViewTransition(run).finished.finally(() => document.documentElement.classList.remove(kind));
}
function go(tab) {
  if (!AUTH) return;
  if (tab === R.tab) { if (R.stacks[tab].length) nav('pop', () => R.stacks[tab] = []); return; }
  nav('tab', () => R.tab = tab);
}
function push(v, p = {}) { R.stacks[R.tab].push({ v, p, y: scrollY }); history.pushState({}, ''); nav('push', () => { }); }
function openToday() { R.stacks.workout = [{ v: 'day', p: { day: dow(today()) }, y: 0 }]; history.pushState({}, ''); nav('tab', () => R.tab = 'workout'); }
function back() { if (R.stacks[R.tab].length) history.back(); }
addEventListener('popstate', () => {
  if ($('#sheet-wrap').classList.contains('open')) closeSheet();
  const st = R.stacks[R.tab];
  if (st.length) { const y = st.at(-1).y; nav('pop', () => st.pop(), y); }
});
const setRoot = p => { Object.assign(R.root[R.tab], p); draw(); };

let tick;
function draw(anim) { // anim=true khi chuyển màn; false khi cập nhật tại chỗ (bấm nút, lưu…)
  if (!AUTH) return drawLogin();
  const { v, p } = cur(), out = V[v](p);
  if ($('#title').getAttribute('aria-label') !== out.title) blurIn($('#title'), out.title); // chỉ chạy khi đổi tiêu đề
  document.body.classList.toggle('deep', R.stacks[R.tab].length > 0);
  $('#screen').classList.toggle('still', !anim);
  $('#screen').innerHTML = out.html;
  const fab = $('#fab');
  fab.classList.toggle('hide', !out.fab);
  if (out.fab) { fab.querySelector('span').textContent = out.fab[0]; fab.onclick = out.fab[1]; }
  document.querySelectorAll('#tabs button').forEach((b, i) => { b.classList.toggle('on', b.dataset.tab === R.tab); if (b.dataset.tab === R.tab) $('#tab-ind').style.transform = `translateX(${i * 100}%)`; });
  clearInterval(tick);
  if (out.tick) tick = setInterval(out.tick, 1000);
  if (anim) requestAnimationFrame(() => requestAnimationFrame(() => animateIn(true)));
  else animateIn(false); // đặt ngay giá trị cuối, không nhảy từ 0
}
function blurIn(el, text) {
  let i = 0;
  el.setAttribute('aria-label', text); el.classList.add('bi');
  el.innerHTML = text.normalize('NFC').split(' ').map(w => `<span class="w" aria-hidden="true">${Array.from(w).map(c => `<span class="c" style="--i:${i++}">${esc(c)}</span>`).join('')}</span>`).join(' ');
  clearTimeout(el._bt); el._bt = setTimeout(() => { el.textContent = text; el.classList.remove('bi'); }, 800 + i * 28); // xong hiệu ứng → chữ thường để xuống dòng/cắt đúng
}
function animateIn(anim) { // thanh/vòng tiến độ chạy từ 0, số đếm lên (chỉ khi chuyển màn)
  document.querySelectorAll('[data-w]').forEach(el => { if (!anim) el.style.transition = 'none'; el.style.width = el.dataset.w; });
  document.querySelectorAll('[data-off]').forEach(el => { if (!anim) el.style.transition = 'none'; el.style.strokeDashoffset = el.dataset.off; });
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, d = +el.dataset.dec || 0, t0 = performance.now();
    if (!anim) return el.textContent = nf(to, d);
    const step = t => { const k = Math.min(1, (t - t0) / 800), e = 1 - Math.pow(1 - k, 3); el.textContent = nf(to * e, d); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}

// ===== Thành phần UI =====
function toast(msg, cls = '') {
  const t = $('#toast'); t.textContent = msg; t.className = 'show ' + cls;
  clearTimeout(t._t); t._t = setTimeout(() => t.className = cls, cls ? 3200 : 2200);
}
function openSheet(html, tall) { const s = $('#sheet'); s.innerHTML = html; s.classList.toggle('tall', !!tall); s.scrollTop = 0; $('#sheet-wrap').classList.add('open'); }
function closeSheet() { $('#sheet-wrap').classList.remove('open'); pickCb = null; }
const bar = (v, max) => `<div class="bar ${v > max ? 'over' : ''}"><i data-w="${Math.min(100, max ? v / max * 100 : 0)}%"></i></div>`;
function ring(v, max, inner) {
  const C = 2 * Math.PI * 45, k = max ? Math.min(1, v / max) : 0;
  return `<div class="ring" style="position:relative"><svg viewBox="0 0 110 110"><circle class="bg" cx="55" cy="55" r="45"/><circle class="fg" cx="55" cy="55" r="45" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C * (1 - k)}"/></svg><div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center">${inner}</div></div>`;
}
function chart(pts, small) { // pts: [{x: 'yyyy-mm-dd', y}]
  if (pts.length < 2) return small ? '' : `<div class="empty">Cần ít nhất 2 lần ghi để vẽ biểu đồ</div>`;
  const Wd = 340, H = small ? 60 : 170, P = small ? 4 : 22;
  const ys = pts.map(p => p.y), lo = Math.min(...ys), hi = Math.max(...ys), span = hi - lo || 1;
  const t = pts.map(p => +new Date(p.x)), t0 = t[0], tsp = t.at(-1) - t0 || 1;
  const xy = pts.map((p, i) => [P + (t[i] - t0) / tsp * (Wd - 2 * P), P + (1 - (p.y - lo) / span) * (H - 2 * P)]);
  const d = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('');
  const [lx, ly] = xy.at(-1);
  return `<svg class="chart" viewBox="0 0 ${Wd} ${H}" style="height:auto"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--acc)" stop-opacity=".35"/><stop offset="1" stop-color="var(--acc)" stop-opacity="0"/></linearGradient></defs>
    ${small ? '' : `<line x1="${P}" x2="${Wd - P}" y1="${P}" y2="${P}"/><line x1="${P}" x2="${Wd - P}" y1="${H - P}" y2="${H - P}"/><text x="${P}" y="${P - 6}">${nf(hi)}</text><text x="${P}" y="${H - P + 14}">${nf(lo)}</text><text x="${Wd - P}" y="${H - P + 14}" text-anchor="end">${dm(pts.at(-1).x)}</text><text x="${P + 40}" y="${H - P + 14}">${dm(pts[0].x)}</text>`}
    <path class="a" d="${d}L${lx} ${H}L${xy[0][0]} ${H}Z"/><path class="l" d="${d}"/><circle cx="${lx}" cy="${ly}" r="${small ? 3 : 4.5}"/></svg>`;
}
const SEGI = {}; // vị trí cũ của từng nhóm nút → nền trượt từ chỗ cũ sang chỗ mới
const seg = (opts, val, fn) => {
  const i = opts.findIndex(([k]) => k === val), from = SEGI[fn] ?? i; SEGI[fn] = i;
  return `<div class="seg" style="--n:${opts.length};--i:${i};--from:${from}">${i >= 0 ? '<i class="knob"></i>' : ''}${opts.map(([k, l]) => `<button class="${k === val ? 'on' : ''}" onclick="${fn}('${k}')">${l}</button>`).join('')}</div>`;
};
const empty = (msg, icon = IC.dumb) => `<div class="empty">${icon}<div>${msg}</div></div>`;

// ===== Màn hình =====
const V = {};

V.home = () => {
  const p = prof(), t = targets(), td = today(), e = eaten(td), ws = weights(), lw = ws.at(-1);
  const ago = ws.filter(w => w.date <= addDays(td, -7)).at(-1), delta = lw && ago ? lw.kg - ago.kg : null;
  const s = sched(dow(td)), sess = session(td), st = streak(), hw = heavyWeeks(), rec = rows('Recovery').find(r => r.date === td);
  const status = sess?.end ? `<span class="pill good">✓ Đã tập · ${dur(sessSecs(sess))}</span>` : sess ? `<span class="pill acc">Đang tập…</span>` : schedIds(s).length ? `<span class="pill">Chưa tập${s.time ? ' · ' + s.time : ''}</span>` : `<span class="pill">Ngày nghỉ</span>`;
  return {
    title: `Xin chào ${p.name || OWNER}`,
    html: `<div class="stagger">
      <div class="muted" style="margin:-4px 4px 12px">${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      ${hw >= 5 ? `<div class="banner"><b>Đã tập nặng ${hw} tuần liền.</b> Cân nhắc 1 tuần deload: giữ bài, giảm ~40% số set/mức tạ để cơ thể hồi phục.</div>` : ''}
      ${rec?.soreness >= 8 ? `<div class="banner"><b>Đau nhức ${rec.soreness}/10.</b> Hôm nay nên tập nhẹ hoặc đổi nhóm cơ.</div>` : ''}
      <div class="grid2">
        <div class="card"><div class="label">Chuỗi ngày</div><div class="big"><span data-count="${st}">0</span><small>ngày</small></div><div class="muted" style="font-size:13px">${st ? 'Giữ lửa nhé' : 'Ghi gì đó hôm nay để bắt đầu'}</div></div>
        <div class="card"><div class="label">Cân nặng</div><div class="big">${lw ? `<span data-count="${toU(lw.kg)}" data-dec="1">0</span><small>${unit()}</small>` : '—'}</div>
          <div style="font-size:13px" class="${delta == null ? 'muted' : delta > 0 ? 'up' : 'down'}">${delta == null ? 'Chưa đủ dữ liệu 7 ngày' : (delta > 0 ? '▲ ' : '▼ ') + nf(Math.abs(toU(delta))) + ' ' + unit() + ' / 7 ngày'}</div>
          ${chart(ws.slice(-14).map(w => ({ x: w.date, y: w.kg })), true)}</div>
      </div>
      <div class="card"><div class="row">
        ${ring(e.kcal, t.kcal, `<div><div style="font:400 26px/1.2 var(--display)" data-count="${Math.round(e.kcal)}">0</div><div class="muted" style="font-size:12.5px">/ ${nf(t.kcal, 0)} kcal</div></div>`)}
        <div class="grow">
          <div class="macro"><span>Protein</span>${bar(e.protein, t.protein)}<span>${nf(e.protein, 0)}/${t.protein}g</span></div>
          <div class="macro"><span>Carb</span>${bar(e.carb, t.carb)}<span>${nf(e.carb, 0)}/${t.carb}g</span></div>
          <div class="macro"><span>Fat</span>${bar(e.fat, t.fat)}<span>${nf(e.fat, 0)}/${t.fat}g</span></div>
        </div></div>
        <div class="muted" style="font-size:13px;margin-top:8px">Còn lại ${nf(Math.max(0, t.kcal - e.kcal), 0)} kcal${burned(td) ? ` · đốt ~${burned(td)} kcal khi tập` : ''}</div>
        <div class="macro" style="margin-top:10px"><span>Nước</span>${bar(drank(td), waterGoal(td))}<span>${nf(drank(td) / 1000, 1)}/${nf(waterGoal(td) / 1000, 1)} L</span></div>
      </div>
      <div class="card tap" onclick="openToday()">
        <div class="between"><div class="label">Buổi tập hôm nay</div>${status}</div>
        <div style="font:400 24px/1.3 var(--display);margin-top:8px">${esc(s.name) || (schedIds(s).length ? DAYS[dow(td)] : 'Nghỉ ngơi')}</div>
        <div class="muted" style="font-size:14px">${schedIds(s).slice(0, 4).map(id => esc(ex(id).name)).join(' · ') || 'Không có bài tập nào được xếp'}</div>
      </div>
      ${rec ? `<div class="card"><div class="label">Phục hồi hôm nay</div><div class="row" style="margin-top:6px"><div class="grow"><b>${nf(rec.sleep)}</b> giờ ngủ</div><div class="grow">Đau nhức <b>${rec.soreness}</b>/10</div></div></div>` : ''}
    </div>`,
  };
};

V.workout = () => {
  const td = today(), ws = weekStart(td), rec = rows('Recovery').find(r => r.date === td), hw = heavyWeeks();
  const days = [1, 2, 3, 4, 5, 6, 7].map(d => {
    const date = addDays(ws, d - 1), s = sched(d), n = schedIds(s).length, sess = session(date);
    return `<div class="card tap day ${date === td ? 'today' : ''}" onclick="push('day',{day:${d}})">
      <div class="dnum">${d === 7 ? 'CN' : 'T' + (d + 1)}<small>${dm(date)}</small></div>
      <div class="grow" style="flex:1;min-width:0"><b class="ellip" style="display:block">${esc(s.name) || (n ? DAYS[d] : 'Nghỉ')}</b>
        <div class="muted" style="font-size:14px">${n ? `${n} bài${s.time ? ' · ' + s.time : ''}` : 'Chạm để xếp bài tập'}</div></div>
      ${sess?.end ? `<div class="check">${IC.ok}</div>` : IC.chev}</div>`;
  }).join('');
  return {
    title: 'Tập luyện',
    html: `<div class="stagger">
      ${hw >= 5 ? `<div class="banner"><b>${hw} tuần tập nặng liên tục.</b> Tuần này nên deload.<div style="margin-top:8px"><button class="btn sm ghost" onclick="setProf('deloadAt',today());draw();toast('Đã ghi nhận tuần deload')">Tôi đang deload tuần này</button></div></div>` : ''}
      <div class="card tap" onclick="recoverySheet()"><div class="between"><div><div class="label">Phục hồi hôm nay</div>
        <div style="margin-top:4px">${rec ? `<b>${nf(rec.sleep)}</b> giờ ngủ · đau nhức <b>${rec.soreness}</b>/10` : '<span class="muted">Ngủ bao lâu? Cơ có đau không?</span>'}</div></div>${IC.edit}</div></div>
      <div class="sec">Tuần này</div><div class="week stagger">${days}</div></div>`,
  };
};

function recoverySheet() {
  const r = rows('Recovery').find(x => x.date === today()) || { sleep: 7, soreness: 3 };
  openSheet(`<h2>Phục hồi hôm nay</h2><form onsubmit="return saveRecovery(this)">
    <label class="field"><span>Giờ ngủ đêm qua</span><input class="in" name="sleep" type="number" step="0.5" min="0" max="16" value="${r.sleep}" required></label>
    <label class="field"><span>Mức đau nhức cơ: <b id="sv">${r.soreness}</b>/10</span><input name="soreness" type="range" min="1" max="10" value="${r.soreness}" style="width:100%;accent-color:var(--acc)" oninput="$('#sv').textContent=this.value"></label>
    <button class="btn">Lưu</button></form>`);
}
function saveRecovery(f) {
  put('Recovery', { id: 'r' + today(), date: today(), sleep: +f.sleep.value, soreness: +f.soreness.value });
  closeSheet(); draw(); toast('Đã lưu'); return false;
}

V.day = ({ day }) => {
  const td = today(), date = addDays(weekStart(td), day - 1), s = sched(day), ids = schedIds(s);
  const isToday = date === td, sess = session(td), past = !isToday && session(date);
  let sessHtml = '';
  if (isToday) {
    sessHtml = !sess ? `<button class="btn" onclick="startSession(${day})">Bắt đầu buổi tập</button>`
      : !sess.end ? `<div class="between"><div><div class="label">Đang tập · từ ${sess.start.slice(0, 5)}</div><div class="timer" id="timer">${clock(sessSecs(sess))}</div></div><button class="btn sm" onclick="endSession()">Kết thúc</button></div>`
      : `<div class="between"><div><div class="label">Đã hoàn thành</div><div style="font:400 26px/1.3 var(--display)">${dur(sessSecs(sess))}</div><div class="muted" style="font-size:14px">${sess.start.slice(0, 5)} → ${sess.end.slice(0, 5)} · ~${burned(td)} kcal</div></div><div class="check" style="width:40px;height:40px">${IC.ok}</div></div>`;
  } else if (past) sessHtml = `<div class="muted">Buổi ${dm(date)}: ${past.start.slice(0, 5)} → ${(past.end || '').slice(0, 5)} · ${dur(sessSecs(past))}</div>`;
  const list = ids.map((id, i) => {
    const e = ex(id), tdSets = rows('WorkoutLog').filter(r => r.exercise === id && r.date === td).length;
    const last = logsOf(id).filter(r => r.date < td).at(-1);
    return `<div class="card tap ex" onclick="push('ex',{id:'${esc(id)}'})">${thumb(e)}
      <div style="min-width:0;flex:1"><b class="ellip">${esc(e.name)}</b><div class="muted ellip" style="font-size:14px">${mus(e) || '&nbsp;'}</div>
        <div style="font-size:13px;margin-top:2px">${tdSets ? `<span class="pill good">${tdSets} set hôm nay</span>` : last ? `<span class="muted">Lần trước: ${W(last.kg)} × ${last.reps}</span>` : '<span class="muted">Chưa có lịch sử</span>'}</div></div>
      <button class="x" aria-label="Bỏ bài" onclick="event.stopPropagation();removeEx(${day},${i})">${IC.x}</button></div>`;
  }).join('');
  return {
    title: s.name || DAYS[day],
    html: `<div class="card"><div class="between"><div><div class="label">${DAYS[day]} · ${dm(date)}</div><div style="font:400 22px/1.3 var(--display)">${esc(s.name) || 'Chưa đặt tên buổi'}${s.time ? ` <span class="muted" style="font-weight:500">· ${s.time}</span>` : ''}</div></div>
        <button class="icon-btn" aria-label="Sửa" onclick="daySheet(${day})">${IC.edit}</button></div>
        ${sessHtml ? `<div style="margin-top:12px">${sessHtml}</div>` : ''}</div>
      <div class="sec">Bài tập (${ids.length})</div>
      <div class="stagger">${list || empty('Chưa có bài nào. Bấm “Bài tập” để chọn từ thư viện 870+ bài có hình minh hoạ.')}</div>`,
    fab: ['Bài tập', () => openPicker(id => { const s2 = sched(day); if (schedIds(s2).includes(id)) return toast('Bài này đã có'); put('Schedule', { ...s2, exercises: [...schedIds(s2), id].join('|') }); draw(); toast('Đã thêm ' + ex(id).name); })],
    tick: isToday && sess && !sess.end ? () => { const t = $('#timer'); if (t) t.textContent = clock(sessSecs(session(td))); } : null,
  };
};
function daySheet(day) {
  const s = sched(day);
  openSheet(`<h2>${DAYS[day]}</h2><form onsubmit="return saveDay(this,${day})">
    <label class="field"><span>Tên buổi</span><input class="in" name="name" value="${esc(s.name)}" placeholder="VD: Ngực + Tay sau"></label>
    <label class="field"><span>Giờ tập dự kiến</span><input class="in" name="time" type="time" value="${esc(s.time)}"></label>
    <button class="btn">Lưu</button></form>`);
}
function saveDay(f, day) { put('Schedule', { ...sched(day), name: f.name.value.trim(), time: f.time.value }); closeSheet(); draw(); return false; }
function removeEx(day, i) { const s = sched(day), ids = schedIds(s); ids.splice(i, 1); put('Schedule', { ...s, exercises: ids.join('|') }); draw(); }
function startSession(day) {
  const td = today(); if (session(td)) return;
  put('Sessions', { id: 's' + td, date: td, name: sched(day).name || DAYS[day], start: nowTime(), end: '' });
  draw(); burst(); toast('Bắt đầu! Chúc buổi tập tốt');
}
function endSession() {
  const s = session(today()); if (!s) return;
  put('Sessions', { ...s, end: nowTime() }); draw(); toast('Xong buổi: ' + dur(sessSecs(session(today()))));
}

V.ex = ({ id }) => {
  const e = ex(id), td = today(), all = logsOf(id), prev = all.filter(r => r.date < td), now = all.filter(r => r.date === td);
  const lastDate = prev.at(-1)?.date, last = prev.filter(r => r.date === lastDate);
  const best = bestOf(all), lastBest = bestOf(last).e1, nowBest = bestOf(now).e1;
  // Coach: so với buổi trước (progressive overload)
  let coach = 'Buổi đầu với bài này — chọn mức tạ làm được 8-12 lần với RPE ~7, ghi lại để lần sau so sánh.';
  if (lastBest) {
    const lastRpe = Math.max(...last.map(r => r.rpe || 0));
    coach = `Buổi trước (${dm(lastDate)}): tốt nhất <b>${W(lastBest.kg)} × ${lastBest.reps}</b>. `;
    if (nowBest) {
      const dlt = e1rm(nowBest.kg, nowBest.reps) - e1rm(lastBest.kg, lastBest.reps);
      coach += Math.abs(dlt) < 0.5 ? 'Hôm nay đang ngang buổi trước.' : dlt > 0 ? `<span class="up">▲ Hôm nay mạnh hơn (~${nf(toU(dlt))} ${unit()} 1RM ước tính).</span>` : `<span class="down">▼ Hôm nay yếu hơn buổi trước — kiểm tra giấc ngủ, dinh dưỡng.</span>`;
    } else coach += lastRpe && lastRpe <= 7 ? `RPE buổi trước chỉ ${lastRpe} → thử <b>+${unit() === 'lbs' ? '5 lbs' : '2,5 kg'}</b> hoặc +1-2 rep.` : lastRpe >= 9.5 ? 'Buổi trước đã sát giới hạn → giữ mức tạ, tập cho chắc form.' : 'Cố gắng thêm 1 rep hoặc tăng nhẹ tạ so với lần trước.';
  }
  const pre = now.at(-1) || last[0] || { kg: 0, reps: 10, rpe: 8 };
  const hist = [...new Set(prev.map(r => r.date))].reverse().slice(0, 8).map(d => `<div class="item"><div style="width:48px" class="muted">${dm(d)}</div><div class="grow" style="font-variant-numeric:tabular-nums">${prev.filter(r => r.date === d).map(r => `${W(r.kg)}×${r.reps}`).join(' · ')}</div></div>`).join('');
  const series = [...new Set(all.map(r => r.date))].map(d => ({ x: d, y: toU(e1rm(bestOf(all.filter(r => r.date === d)).e1.kg, bestOf(all.filter(r => r.date === d)).e1.reps)) }));
  return {
    title: e.name,
    html: `${e.imgs.length ? `<div class="anim smooth">${e.imgs.slice(0, 2).map(u => `<img src="${esc(u)}" alt="${esc(e.name)}">`).join('')}</div>` : ''}
      ${e.en && e.en !== e.name ? `<div class="muted" style="margin:-4px 4px 12px;font-size:14px">${esc(e.en)}</div>` : ''}
      ${e.loading ? '<div class="muted" style="margin-bottom:12px">Đang tải thư viện bài tập…</div>' : ''}
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${e.muscles.map(m => `<span class="pill acc">${MUSCLE[m] || esc(m)}</span>`).join('')}${e.second.map(m => `<span class="pill">${MUSCLE[m] || m}</span>`).join('')}${e.equipment ? `<span class="pill">${EQUIP[e.equipment] || esc(e.equipment)}</span>` : ''}${e.level ? `<span class="pill">${LEVEL[e.level]}</span>` : ''}</div>
      <div class="card coach"><div class="label" style="margin-bottom:4px">Huấn luyện viên</div>${coach}</div>
      <div class="card"><div class="between"><div class="label">Hôm nay</div><span class="muted" style="font-size:13px">${now.length} set</span></div>
        ${now.length ? `<table class="sets"><tr><th>Set</th><th>${unit()}</th><th>Reps</th><th>RPE</th><th></th></tr>${now.map((r, i) => `<tr class="${r.id === lastSaved ? 'new' : ''}"><td>${i + 1}</td><td>${r.kg ? nf(toU(r.kg)) : 'BW'}</td><td>${r.reps}</td><td>${r.rpe || '–'}</td><td style="text-align:right"><button class="x" onclick="delSet('${r.id}')">${IC.x}</button></td></tr>`).join('')}</table>` : ''}
        <form class="logger" style="margin-top:12px" onsubmit="return saveSet(this,'${esc(id)}')">
          <label>${unit()}<input class="in" name="kg" type="number" inputmode="decimal" step="any" min="0" value="${pre.kg ? +toU(pre.kg).toFixed(1) : ''}" placeholder="0"></label>
          <label>Reps<input class="in" name="reps" type="number" inputmode="numeric" min="1" value="${pre.reps || ''}" required></label>
          <label>RPE<select class="in" name="rpe">${[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(v => `<option ${v === (pre.rpe || 8) ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
          <button class="btn" style="width:52px;height:48px;padding:0;display:grid;place-items:center" aria-label="Lưu set">${IC.ok}</button>
        </form></div>
      ${all.length ? `<div class="card"><div class="label">Kỷ lục cá nhân</div><div class="grid2" style="margin:8px 0 0">
          <div><div class="big" style="font-size:24px">${W(best.kg.kg)}</div><div class="muted" style="font-size:13px">Tạ nặng nhất × ${best.kg.reps} · ${dm(best.kg.date)}</div></div>
          <div><div class="big" style="font-size:24px">${W(e1rm(best.e1.kg, best.e1.reps))}</div><div class="muted" style="font-size:13px">1RM ước tính · ${dm(best.e1.date)}</div></div></div>
        ${series.length > 1 ? `<div style="margin-top:12px">${chart(series)}</div>` : ''}</div>` : ''}
      ${hist ? `<div class="card"><div class="label">Lịch sử</div><div class="list">${hist}</div></div>` : ''}
      ${e.steps.length ? `<div class="card"><details open><summary>Hướng dẫn thực hiện</summary><ol class="steps">${e.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></details></div>` : ''}`,
  };
};
let lastSaved = null;
function saveSet(f, id) {
  const td = today(), kg = Math.max(0, fromU(+f.kg.value || 0)), reps = +f.reps.value, rpe = +f.rpe.value;
  if (!reps) return false;
  const before = bestOf(logsOf(id)), n = rows('WorkoutLog').filter(r => r.exercise === id && r.date === td).length;
  if (!session(td)) put('Sessions', { id: 's' + td, date: td, name: sched(dow(td)).name || DAYS[dow(td)], start: nowTime(), end: '' });
  lastSaved = uid();
  put('WorkoutLog', { id: lastSaved, date: td, exercise: id, set: n + 1, reps, kg, rpe });
  draw();
  if (before.kg && (kg > before.kg.kg || e1rm(kg, reps) > e1rm(before.e1.kg, before.e1.reps) + 0.01)) {
    toast(`🏆 Kỷ lục mới: ${W(kg)} × ${reps}`, 'pr'); navigator.vibrate?.([30, 40, 30]); burst(18, true);
  } else { toast(`Set ${n + 1} đã lưu`); navigator.vibrate?.(15); burst(); }
  return false;
}
function delSet(rid) { del('WorkoutLog', rid); draw(); }

// Bộ chọn bài tập (bottom sheet)
let pickCb = null, pickQ = '', pickM = '';
function openPicker(cb) {
  openSheet(`<div class="between" style="margin-bottom:10px"><h2 style="margin:0">Chọn bài tập</h2><button class="btn sm ghost" onclick="closeSheet()">Xong</button></div>
    <input class="in" id="pq" placeholder="Tìm: bench, squat, ngực, vai…" oninput="pickQ=this.value;pickList()" value="${esc(pickQ)}" style="margin-bottom:10px">
    <div class="chips">${[['', 'Phổ biến'], ...Object.entries(MUSCLE)].map(([k, l]) => `<button class="${k === pickM ? 'on' : ''}" onclick="pickM='${k}';this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on');pickList()">${l}</button>`).join('')}</div>
    <div id="plist" class="list"></div>
    <button class="btn ghost" style="margin-top:12px" onclick="customExSheet()">+ Tạo bài tập riêng</button>`, true);
  pickCb = cb; pickList();
}
function pickList() {
  const el = $('#plist'); if (!el) return;
  if (!EX) { el.innerHTML = '<div class="empty">Đang tải thư viện…</div>'; return; }
  const q = fold(pickQ.trim()), words = q.split(/\s+/).filter(Boolean);
  let list = allEx();
  if (q) list = list.filter(e => { const hay = fold([e.name, e.en, mus(e), e.muscles.join(' '), e.equipment, EQUIP[e.equipment]].join(' ')); return words.every(w => hay.includes(w)); });
  if (pickM) list = list.filter(e => e.muscles.includes(pickM));
  if (!q && !pickM) list = [...rows('ExerciseLibrary').map(r => ex(r.id)), ...POPULAR.map(id => EX.get(id)).filter(Boolean)];
  else list.sort((a, b) => (POPULAR.includes(b.id) - POPULAR.includes(a.id)) || ((b.category === 'strength') - (a.category === 'strength')));
  el.innerHTML = list.slice(0, 80).map(e => `<div class="item ex" style="cursor:pointer" onclick="pickCb&&pickCb('${esc(e.id)}');this.querySelector('.pk').innerHTML='${IC.ok.replace(/"/g, '&quot;')}'">${thumb(e)}<div style="flex:1;min-width:0"><b class="ellip">${esc(e.name)}</b><div class="muted ellip" style="font-size:14px">${mus(e)} · ${EQUIP[e.equipment] || e.equipment || ''}</div></div><span class="pk" style="color:var(--good)"></span></div>`).join('') || '<div class="empty">Không tìm thấy</div>';
}
function customExSheet() {
  const cb = pickCb;
  openSheet(`<h2>Bài tập riêng</h2><form onsubmit="return saveCustomEx(this)">
    <label class="field"><span>Tên bài</span><input class="in" name="name" required></label>
    <label class="field"><span>Nhóm cơ chính</span><select class="in" name="muscle">${Object.entries(MUSCLE).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></label>
    <label class="field"><span>Dụng cụ</span><select class="in" name="equipment">${Object.entries(EQUIP).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></label>
    <label class="field"><span>Link ảnh (tuỳ chọn)</span><input class="in" name="image" type="url" placeholder="https://…"></label>
    <button class="btn">Lưu</button></form>`);
  pickCb = cb;
}
function saveCustomEx(f) {
  const id = 'c_' + uid(), cb = pickCb;
  put('ExerciseLibrary', { id, name: f.name.value.trim(), muscle: f.muscle.value, equipment: f.equipment.value, image: f.image.value.trim() });
  closeSheet(); if (cb) cb(id); else draw();
  return false;
}

V.food = ({ seg: sg = 'log', date = today() }) => {
  if (sg === 'lib') return {
    title: 'Dinh dưỡng',
    html: seg([['log', 'Nhật ký'], ['lib', 'Thư viện món']], 'lib', 'foodSeg') + `<input class="in" placeholder="Tìm món…" oninput="foodLib(this.value)" style="margin-bottom:10px"><div id="flib" class="card list">${foodRows('')}</div>`,
    fab: ['Món mới', () => foodSheet()],
  };
  const t = targets(), e = eaten(date), logs = rows('NutritionLog').filter(r => r.date === date && !isExtra(r));
  return {
    title: 'Dinh dưỡng',
    html: seg([['log', 'Nhật ký'], ['lib', 'Thư viện món']], 'log', 'foodSeg') + `
      <div class="between" style="margin-bottom:10px"><button class="icon-btn" onclick="setRoot({date:addDays('${date}',-1)})">${IC.left}</button>
        <b>${date === today() ? 'Hôm nay' : new Date(date + 'T00:00').toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}</b>
        <button class="icon-btn" style="transform:scaleX(-1);${date >= today() ? 'visibility:hidden' : ''}" onclick="setRoot({date:addDays('${date}',1)})">${IC.left}</button></div>
      <div class="card"><div class="row">${ring(e.kcal, t.kcal, `<div><div style="font:400 26px/1.2 var(--display)" data-count="${Math.round(e.kcal)}">0</div><div class="muted" style="font-size:12.5px">/ ${t.kcal} kcal</div></div>`)}
        <div class="grow"><div class="macro"><span>Protein</span>${bar(e.protein, t.protein)}<span>${nf(e.protein, 0)}/${t.protein}g</span></div>
        <div class="macro"><span>Carb</span>${bar(e.carb, t.carb)}<span>${nf(e.carb, 0)}/${t.carb}g</span></div>
        <div class="macro"><span>Fat</span>${bar(e.fat, t.fat)}<span>${nf(e.fat, 0)}/${t.fat}g</span></div></div></div></div>
      ${waterCard(date)}${suppCard(date)}
      ${date === today() ? suggestCard(date) : ''}
      <div class="sec">Đã ăn (${logs.length})</div>
      ${logs.length ? `<div class="card list stagger">${logs.map(r => `<div class="item"><div class="grow"><b>${esc(r.food)}</b><div class="muted" style="font-size:14px">${nf(r.grams, 0)}g · P ${nf(r.protein, 0)} · C ${nf(r.carb, 0)} · F ${nf(r.fat, 0)}</div></div><b>${nf(r.kcal, 0)}</b><span class="muted" style="font-size:13px">kcal</span><button class="x" onclick="del('NutritionLog','${r.id}');draw()">${IC.x}</button></div>`).join('')}</div>` : empty('Chưa ghi món nào. Bấm “Thêm món”.')}`,
    fab: ['Thêm món', () => push('addFood', { date })],
  };
};
function suggestCard(date) {
  const { rem, list, needP } = suggest(date);
  if (!list.length) return rem.k < 120 ? `<div class="card coach"><b>Đã đủ calo hôm nay.</b> <span class="muted">${rem.p > 10 ? `Còn thiếu ${nf(rem.p, 0)}g protein, ưu tiên lòng trắng trứng, ức gà, whey.` : 'Giữ nhịp này nhé.'}</span></div>` : '';
  return `<div class="card coach"><div class="between"><div class="label">Gợi ý bữa tiếp theo</div><span class="muted" style="font-size:13px">còn ${nf(rem.k, 0)} kcal · ${nf(Math.max(0, rem.p), 0)}g đạm</span></div>
    ${needP ? '<div class="muted" style="font-size:14px;margin-top:4px">Đạm còn thiếu nhiều so với calo còn lại, nên ưu tiên món giàu đạm.</div>' : ''}
    <div class="list" style="margin-top:4px">${list.map(x => `<div class="item" style="cursor:pointer" onclick="gramSheet('${x.f.id}',${x.g})"><div class="grow"><b>${esc(x.f.name)}</b> <span class="pill">${x.why}</span><div class="muted" style="font-size:14px">${nf(x.g, 0)}g · ${nf(x.K, 0)} kcal · P ${nf(x.P, 0)}g</div></div><span class="pill acc">+</span></div>`).join('')}</div></div>`;
}
// ----- Nước & thực phẩm bổ sung -----
const isExtra = r => /^(wa|sp)_/.test(r.id);
const waterGoal = date => Math.round((35 * (lastWeight() || 65) + (session(date) ? 500 : 0)) / 50) * 50; // 35 ml/kg, +500 ml ngày tập
const drank = date => rows('NutritionLog').filter(r => r.date === date && r.id.startsWith('wa_')).reduce((a, r) => a + r.grams, 0);
function waterCard(date) {
  const ml = drank(date), goal = waterGoal(date), k = Math.min(1, ml / goal);
  return `<div class="card water"><div class="between"><div><div class="label">Nước</div>
      <div style="font:400 28px/1.3 var(--display)">${nf(ml / 1000, 2)}<span class="muted" style="font:500 15px 'Be Vietnam Pro'"> / ${nf(goal / 1000, 1)} lít</span></div></div>
      <div class="glass" style="--k:${k}"><i></i></div></div>
    <div class="muted" style="font-size:13px;margin:2px 0 12px">${ml >= goal ? 'Đủ nước rồi, tốt lắm.' : `Còn ${nf((goal - ml) / 1000, 2)} lít${session(date) ? ' (đã cộng 500 ml cho buổi tập)' : ''}`}</div>
    <div class="row" style="gap:8px">${[[150, 'Ngụm'], [250, 'Cốc'], [500, 'Chai']].map(([v, l]) => `<button class="btn sm soft" style="flex:1;padding:8px 4px;white-space:nowrap;line-height:1.25" onclick="addWater('${date}',${v})">+${v} ml<br><span style="font-size:12px;font-weight:500;opacity:.8">${l}</span></button>`).join('')}
      <button class="btn sm ghost" aria-label="Bỏ lần vừa thêm" onclick="undoWater('${date}')">↶</button></div></div>`;
}
function addWater(date, ml) { put('NutritionLog', { id: 'wa_' + uid(), date, food: 'Nước', grams: ml, kcal: 0, protein: 0, carb: 0, fat: 0 }); draw(); burst(8); }
function undoWater(date) { const last = rows('NutritionLog').filter(r => r.date === date && r.id.startsWith('wa_')).at(-1); if (last) { del('NutritionLog', last.id); draw(); } }
const SUPP_PRESETS = [
  { name: 'Creatine', dose: '5 g', tip: 'Creatine monohydrate 3–5 g mỗi ngày, cả ngày nghỉ; uống lúc nào cũng được.' },
  { name: 'Whey protein', dose: '1 muỗng (30 g)', kcal: 117, protein: 23, carb: 2.4, fat: 1.8 },
  { name: 'Vitamin D3', dose: '1 viên' }, { name: 'Omega-3', dose: '2 viên' }, { name: 'Magie', dose: '1 viên' },
  { name: 'Vitamin tổng hợp', dose: '1 viên' }, { name: 'Caffeine / pre-workout', dose: '1 liều' },
];
const supps = () => prof().supps || [];
const suppId = (date, name) => 'sp_' + date + '_' + name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
function suppCard(date) {
  const list = supps();
  const rowsHtml = list.map((s, i) => {
    const taken = rows('NutritionLog').some(r => r.id === suppId(date, s.name));
    return `<div class="item" onclick="toggleSupp('${date}',${i})" style="cursor:pointer"><span class="tick ${taken ? 'on' : ''}">${IC.ok}</span>
      <div class="grow"><b>${esc(s.name)}</b><div class="muted" style="font-size:13px">${esc(s.dose || '')}${s.kcal ? ` · ${s.kcal} kcal · P ${s.protein || 0}g` : ''}</div></div></div>`;
  }).join('');
  const done = list.filter(s => rows('NutritionLog').some(r => r.id === suppId(date, s.name))).length;
  return `<div class="card"><div class="between"><div class="label">Thực phẩm bổ sung</div>${list.length ? `<span class="pill ${done === list.length ? 'good' : 'acc'}">${done}/${list.length} đã uống</span>` : ''}</div>
    ${list.length ? `<div class="list" style="margin-top:4px">${rowsHtml}</div>` : '<div class="muted" style="font-size:14px;margin:6px 0 4px">Chưa có. Thêm creatine, whey, vitamin… để tick mỗi ngày.</div>'}
    <button class="btn sm ghost" style="margin-top:10px" onclick="suppSheet()">${list.length ? 'Sửa danh sách' : '+ Thêm thực phẩm bổ sung'}</button></div>`;
}
function toggleSupp(date, i) {
  const s = supps()[i], id = suppId(date, s.name);
  if (rows('NutritionLog').some(r => r.id === id)) del('NutritionLog', id);
  else { put('NutritionLog', { id, date, food: 'Bổ sung: ' + s.name, grams: parseFloat(s.dose) || 0, kcal: +s.kcal || 0, protein: +s.protein || 0, carb: +s.carb || 0, fat: +s.fat || 0 }); burst(8); }
  draw();
}
function suppSheet() {
  const list = supps(), have = new Set(list.map(s => s.name));
  const tip = list.find(s => s.name === 'Creatine') ? `<div class="card coach" style="background:var(--card2);box-shadow:none">${SUPP_PRESETS[0].tip}</div>` : '';
  openSheet(`<h2>Thực phẩm bổ sung</h2>${tip}
    <div class="list">${list.map((s, i) => `<div class="item"><div class="grow"><b>${esc(s.name)}</b><div class="muted" style="font-size:13px">${esc(s.dose || '')}</div></div><button class="x" onclick="removeSupp(${i})">${IC.x}</button></div>`).join('')}</div>
    <div class="label" style="margin:14px 0 8px">Thêm nhanh</div>
    <div class="chips" style="flex-wrap:wrap;margin:0 0 14px;padding:0">${SUPP_PRESETS.filter(p => !have.has(p.name)).map(p => `<button onclick="addSupp(${SUPP_PRESETS.indexOf(p)})">+ ${esc(p.name)}</button>`).join('') || '<span class="muted">Đã thêm hết gợi ý</span>'}</div>
    <form onsubmit="return saveSupp(this)"><div class="label" style="margin-bottom:8px">Hoặc tự thêm</div>
      <div class="grid2" style="margin:0"><label class="field"><span>Tên</span><input class="in" name="name" required placeholder="VD: BCAA"></label><label class="field"><span>Liều</span><input class="in" name="dose" placeholder="VD: 5 g"></label></div>
      <div class="grid2" style="margin:0"><label class="field"><span>Calo (nếu có)</span><input class="in" name="kcal" type="number" min="0" step="any" placeholder="0"></label><label class="field"><span>Protein g (nếu có)</span><input class="in" name="protein" type="number" min="0" step="any" placeholder="0"></label></div>
      <button class="btn">Thêm</button></form>`);
}
function setSupps(list) { setProf('supps', list); draw(); suppSheet(); }
const addSupp = i => { const { tip, ...s } = SUPP_PRESETS[i]; setSupps([...supps(), s]); };
const removeSupp = i => setSupps(supps().filter((_, j) => j !== i));
function saveSupp(f) {
  const name = f.name.value.trim(); if (!name || supps().some(s => s.name === name)) return false;
  setSupps([...supps(), { name, dose: f.dose.value.trim(), kcal: +f.kcal.value || 0, protein: +f.protein.value || 0 }]); return false;
}
const foodSeg = s => nav('tab', () => Object.assign(R.root.food, { seg: s }));
function foods() { // món có sẵn + món trong Sheet (trùng id thì Sheet ghi đè)
  const custom = rows('FoodLibrary'), ids = new Set(custom.map(f => f.id));
  return [...custom, ...FOODS.filter(f => !ids.has(f.id))];
}
function foodRows(q, pick) {
  q = q.trim().toLowerCase();
  const recent = [...new Set(rows('NutritionLog').slice().reverse().map(r => r.food))];
  const list = foods().filter(f => f.name.toLowerCase().includes(q)).sort((a, b) => {
    const ra = recent.indexOf(a.name), rb = recent.indexOf(b.name);
    return (ra < 0 ? 999 : ra) - (rb < 0 ? 999 : rb) || a.name.localeCompare(b.name, 'vi');
  });
  return list.map(f => `<div class="item" style="cursor:pointer" onclick="${pick ? `gramSheet('${f.id}')` : `foodSheet('${f.id}')`}"><div class="grow"><b>${esc(f.name)}</b><div class="muted" style="font-size:14px">${f.kcal} kcal · P ${f.protein} · C ${f.carb} · F ${f.fat} /100g</div></div>${pick ? '<span class="pill acc">+</span>' : IC.chev}</div>`).join('') || '<div class="empty">Không có món này — thêm mới ở tab Thư viện món</div>';
}
const foodLib = q => $('#flib').innerHTML = foodRows(q);
function foodSheet(id) {
  const f = foods().find(x => x.id === id) || { name: '', kcal: '', protein: '', carb: '', fat: '', portion: 100 };
  const n = (k, l) => `<label class="field"><span>${l}</span><input class="in" name="${k}" type="number" step="any" min="0" value="${f[k]}" required></label>`;
  openSheet(`<h2>${id ? 'Sửa món' : 'Món mới'}</h2><form onsubmit="return saveFood(this,'${id || ''}')">
    <label class="field"><span>Tên món</span><input class="in" name="name" value="${esc(f.name)}" required></label>
    <div class="grid2" style="margin:0">${n('kcal', 'Calo / 100g')}${n('protein', 'Protein (g)')}${n('carb', 'Carb (g)')}${n('fat', 'Fat (g)')}</div>
    ${n('portion', '1 phần thường ăn (g)')}
    <button class="btn">Lưu</button>${f.id && !f.builtin ? `<button type="button" class="btn danger" onclick="del('FoodLibrary','${f.id}');closeSheet();draw()">Xoá món</button>` : ''}</form>`);
}
function saveFood(f, id) {
  const g = k => +f[k].value;
  put('FoodLibrary', { id: id || 'f_' + uid(), name: f.name.value.trim(), kcal: g('kcal'), protein: g('protein'), carb: g('carb'), fat: g('fat'), portion: g('portion') });
  closeSheet(); draw(); toast('Đã lưu món'); return false;
}

V.addFood = ({ date }) => ({
  title: 'Thêm món',
  html: `<input class="in" placeholder="Tìm món: phở, cơm, ức gà…" oninput="$('#fpick').innerHTML=foodRows(this.value,1)" style="margin-bottom:10px">
    <div id="fpick" class="card list">${foodRows('', 1)}</div>`,
  fab: ['Món mới', () => foodSheet()],
});
function gramSheet(id, preset) {
  const f = foods().find(x => x.id === id), p = f.portion || 100;
  openSheet(`<h2>${esc(f.name)}</h2><form onsubmit="return saveEat(this,'${id}')">
    <label class="field"><span>Khối lượng (g)</span><input class="in" name="g" id="gg" type="number" inputmode="decimal" min="1" step="any" value="${preset || p}" oninput="gramPrev('${id}')" required style="font-size:22px;font-weight:700"></label>
    <div class="chips" style="margin:0 0 12px">${[[p, '1 phần'], [p / 2, '½ phần'], [p * 1.5, '1,5 phần'], [100, '100g'], [200, '200g']].map(([g, l]) => `<button type="button" onclick="$('#gg').value=${g};gramPrev('${id}')">${l} · ${nf(g, 0)}g</button>`).join('')}</div>
    <div class="card" style="background:var(--card2);box-shadow:none" id="gprev"></div>
    <button class="btn">Thêm vào nhật ký</button></form>`);
  gramPrev(id);
}
function gramPrev(id) {
  const f = foods().find(x => x.id === id), k = (+$('#gg').value || 0) / 100;
  $('#gprev').innerHTML = `<div class="between"><div class="big" style="font-size:28px">${nf(f.kcal * k, 0)}<small>kcal</small></div><div class="muted" style="font-size:14px;text-align:right">P ${nf(f.protein * k)}g · C ${nf(f.carb * k)}g · F ${nf(f.fat * k)}g</div></div>`;
}
function saveEat(form, id) {
  const f = foods().find(x => x.id === id), g = +form.g.value, k = g / 100, date = cur().p.date || today();
  const r1 = n => Math.round(n * 10) / 10;
  put('NutritionLog', { id: uid(), date, food: f.name, grams: g, kcal: Math.round(f.kcal * k), protein: r1(f.protein * k), carb: r1(f.carb * k), fat: r1(f.fat * k) });
  toast(`Đã thêm ${f.name}`); if (R.stacks[R.tab].length) history.back(); else { closeSheet(); draw(); }
  return false;
}

V.progress = ({ seg: sg = 'weight', range = 90 }) => {
  const head = seg([['weight', 'Cân nặng'], ['body', 'Số đo & Ảnh'], ['pr', 'Kỷ lục']], sg, 'progSeg');
  if (sg === 'weight') {
    const ws = weights(), from = range ? addDays(today(), -range) : '', shown = ws.filter(w => w.date >= from), lw = ws.at(-1);
    const ch = shown.length > 1 ? toU(shown.at(-1).kg - shown[0].kg) : null;
    return {
      title: 'Tiến độ',
      html: head + `<div class="card"><div class="between"><div><div class="label">Hiện tại</div><div class="big">${lw ? `<span data-count="${toU(lw.kg)}" data-dec="1">0</span><small>${unit()}</small>` : '—'}</div></div>
          ${ch != null ? `<div style="text-align:right"><div class="label">Thay đổi</div><b class="${ch > 0 ? 'up' : 'down'}" style="font-size:18px">${ch > 0 ? '+' : ''}${nf(ch)} ${unit()}</b></div>` : ''}</div>
        <div class="chips" style="margin:10px 0 4px">${[[30, '30 ngày'], [90, '90 ngày'], [365, '1 năm'], [0, 'Tất cả']].map(([k, l]) => `<button class="${k === range ? 'on' : ''}" onclick="setRoot({range:${k}})">${l}</button>`).join('')}</div>
        ${chart(shown.map(w => ({ x: w.date, y: toU(w.kg) })))}</div>
        <div class="sec">Lịch sử</div>${ws.length ? `<div class="card list">${ws.slice().reverse().slice(0, 60).map((w, i, a) => { const d = a[i + 1] ? Math.round(toU(w.kg - a[i + 1].kg) * 10) / 10 : 0; return `<div class="item"><div class="grow">${new Date(w.date + 'T00:00').toLocaleDateString('vi-VN')}${w.time ? `<div class="muted" style="font-size:13px">lúc ${esc(w.time)}</div>` : ''}</div><span class="${d > 0 ? 'up' : d < 0 ? 'down' : 'muted'}" style="font-size:13px">${d ? (d > 0 ? '+' : '') + nf(d) : ''}</span><b>${nf(toU(w.kg))} ${unit()}</b><button class="x" onclick="del('WeightLog','${w.id}');draw()">${IC.x}</button></div>`; }).join('')}</div>` : empty('Chưa có số cân nào')}`,
      fab: ['Cân nặng', weightSheet],
    };
  }
  if (sg === 'body') {
    const ms = rows('BodyMeasurement').slice().sort((a, b) => a.date < b.date ? -1 : 1), f = ms[0], l = ms.at(-1);
    const cmp = (k, lbl) => `<div><div class="label">${lbl}</div><div style="font-size:22px;font-weight:800">${l?.[k] ? nf(l[k]) : '—'}<small class="muted" style="font-size:13px"> cm</small></div>${f && l && f !== l && f[k] && l[k] ? `<div style="font-size:13px" class="muted">${l[k] - f[k] > 0 ? '+' : ''}${nf(l[k] - f[k])} từ ${dm(f.date)}</div>` : ''}</div>`;
    const photos = ms.filter(m => m.photo).reverse();
    return {
      title: 'Tiến độ',
      html: head + `<div class="card"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${cmp('waist', 'Eo')}${cmp('chest', 'Ngực')}${cmp('arm', 'Tay')}</div></div>
        ${photos.length ? `<div class="sec">Ảnh tiến trình</div><div class="photos stagger">${photos.map(m => `<a href="${esc(m.photo)}" target="_blank" rel="noopener"><img src="${esc(m.photo)}" loading="lazy" alt="Ảnh ${dm(m.date)}"></a>`).join('')}</div>` : ''}
        <div class="sec">Lịch sử</div>${ms.length ? `<div class="card list">${ms.slice().reverse().map(m => `<div class="item"><div class="grow">${new Date(m.date + 'T00:00').toLocaleDateString('vi-VN')}<div class="muted" style="font-size:14px">Eo ${nf(m.waist) || '–'} · Ngực ${nf(m.chest) || '–'} · Tay ${nf(m.arm) || '–'} cm${m.photo ? ' · có ảnh' : ''}</div></div><button class="x" onclick="del('BodyMeasurement','${m.id}');draw()">${IC.x}</button></div>`).join('')}</div>` : empty('Đo mỗi 2-4 tuần, cùng giờ, trước khi ăn')}`,
      fab: ['Số đo', bodySheet],
    };
  }
  const ids = [...new Set(rows('WorkoutLog').map(r => r.exercise))];
  const prs = ids.map(id => ({ id, e: ex(id), b: bestOf(logsOf(id)) })).sort((a, b) => b.b.e1.date.localeCompare(a.b.e1.date));
  return {
    title: 'Tiến độ',
    html: head + (prs.length ? `<div class="stagger">${prs.map(({ e, b }) => `<div class="card ex">${thumb(e)}<div style="flex:1;min-width:0"><b class="ellip">${esc(e.name)}</b>
        <div style="font-size:14px"><b>${W(b.kg.kg)} × ${b.kg.reps}</b> <span class="muted">· 1RM ~${W(e1rm(b.e1.kg, b.e1.reps))}</span></div>
        <div class="muted" style="font-size:13px">Nhiều rep nhất: ${b.reps.reps} · đạt ${dm(b.e1.date)}</div></div></div>`).join('')}</div>` : empty('Kỷ lục sẽ tự xuất hiện khi bạn ghi set tập')),
  };
};
const progSeg = s => nav('tab', () => Object.assign(R.root.progress, { seg: s }));
function weightSheet() {
  const now = nowTime().slice(0, 5);
  openSheet(`<h2>Khai báo cân nặng</h2><form onsubmit="return saveWeight(this)">
    <div class="grid2" style="margin:0"><label class="field"><span>Ngày</span><input class="in" name="date" type="date" value="${today()}" max="${today()}" required></label>
    <label class="field"><span>Giờ cân</span><input class="in" name="time" type="time" value="${now}" required></label></div>
    <label class="field"><span>Cân nặng (${unit()})</span><input class="in" name="kg" type="number" inputmode="decimal" step="0.1" min="20" max="700" value="${lastWeight() ? +toU(lastWeight()).toFixed(1) : ''}" required style="font-size:22px;font-weight:700"></label>
    <button class="btn">Lưu</button></form>`);
}
function saveWeight(f) {
  const date = f.date.value;
  put('WeightLog', { id: 'w' + date, date, time: f.time.value, kg: Math.round(fromU(+f.kg.value) * 100) / 100 }); // 1 số/ngày, khai báo lại trong ngày sẽ ghi đè
  closeSheet(); draw(); burst(); toast('Đã lưu cân nặng'); return false;
}
function bodySheet() {
  const l = rows('BodyMeasurement').slice().sort((a, b) => a.date < b.date ? -1 : 1).at(-1) || {};
  const n = (k, lbl) => `<label class="field"><span>${lbl} (cm)</span><input class="in" name="${k}" type="number" inputmode="decimal" step="0.1" min="0" value="${l[k] || ''}"></label>`;
  openSheet(`<h2>Số đo & ảnh</h2><form onsubmit="saveBody(this);return false">
    <label class="field"><span>Ngày</span><input class="in" name="date" type="date" value="${today()}" max="${today()}" required></label>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${n('waist', 'Eo')}${n('chest', 'Ngực')}${n('arm', 'Tay')}</div>
    <label class="field"><span>Ảnh tiến trình ${AUTH.api ? '(lưu vào Google Drive của bạn)' : '(cần kết nối Google Sheet)'}</span><input class="in" name="photo" type="file" accept="image/*" ${AUTH.api ? '' : 'disabled'}></label>
    <button class="btn" id="bsave">Lưu</button></form>`);
}
async function saveBody(f) {
  const date = f.date.value, file = f.photo.files[0], old = rows('BodyMeasurement').find(m => m.id === 'm' + date);
  let photo = old?.photo || '';
  if (file) {
    const b = $('#bsave'); b.disabled = true; b.textContent = 'Đang tải ảnh…';
    try { photo = (await api({ action: 'upload', name: `body-${date}.jpg`, data: await shrink(file) })).url; }
    catch (e) { b.disabled = false; b.textContent = 'Lưu'; toast('Tải ảnh lỗi: ' + e.message); return; }
  }
  put('BodyMeasurement', { id: 'm' + date, date, waist: +f.waist.value || 0, chest: +f.chest.value || 0, arm: +f.arm.value || 0, photo });
  closeSheet(); draw(); toast('Đã lưu số đo');
}
function shrink(file) { // thu ảnh về cạnh dài 1200px JPEG → base64
  return new Promise((ok, fail) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1200 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = img.width * k; c.height = img.height * k; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src); ok(c.toDataURL('image/jpeg', 0.82).split(',')[1]);
    };
    img.onerror = fail; img.src = URL.createObjectURL(file);
  });
}

V.me = () => {
  const p = prof(), t = targets(), last = store.get('last', 0), lw = weights().at(-1);
  const inp = (k, lbl, type = 'number', ph = '') => `<label class="field"><span>${lbl}</span><input class="in" type="${type}" value="${esc(p[k] ?? '')}" placeholder="${ph}" onchange="setProf('${k}',this.value);draw()"></label>`;
  return {
    title: 'Cá nhân',
    html: `<div class="stagger">
      <div class="card">${inp('name', 'Tên hiển thị', 'text', OWNER)}
        <div class="field"><span class="label" style="display:block;margin-bottom:4px">Giới tính</span>${seg([['m', 'Nam'], ['f', 'Nữ']], p.sex || 'm', 'setProf_sex')}</div>
        <div class="grid2" style="margin:0">${inp('age', 'Tuổi', 'number', '25')}${inp('height', 'Chiều cao (cm)', 'number', '170')}</div></div>
      <div class="card"><div class="label" style="margin-bottom:10px">Cân nặng & mục tiêu</div>
        <div class="between" style="margin-bottom:16px"><div><div class="muted" style="font-size:14px">Cân nặng hiện tại</div>
            <div style="font:400 28px/1.3 var(--display)">${lw ? `${nf(toU(lw.kg))} <span class="muted" style="font:500 15px 'Be Vietnam Pro'">${unit()}</span>` : '—'}</div>
            <div class="muted" style="font-size:13px">${lw ? `${lw.time ? 'lúc ' + esc(lw.time) + ' · ' : ''}${new Date(lw.date + 'T00:00').toLocaleDateString('vi-VN')}` : 'Chưa khai báo'}</div></div>
          <button class="btn sm" onclick="weightSheet()">Khai báo cân nặng</button></div>
        <label class="field"><span>Cân nặng mục tiêu (${unit()})</span><input class="in" type="number" inputmode="decimal" step="0.5" value="${p.targetKg ? +toU(p.targetKg).toFixed(1) : ''}" placeholder="VD: 75" onchange="setProf('targetKg',this.value?Math.round(fromU(+this.value)*10)/10:'');draw()"></label>
        ${t.goal !== 'maintain' && p.targetKg ? `<div class="field"><span class="label" style="display:block;margin-bottom:4px">Tốc độ ${t.goal === 'bulk' ? 'tăng' : 'giảm'} mỗi tuần</span>${seg(t.goal === 'bulk' ? [['0.25', 'Chậm 0,25kg'], ['0.5', 'Nhanh 0,5kg']] : [['0.25', 'Nhẹ 0,25kg'], ['0.5', 'Vừa 0,5kg'], ['0.75', 'Nhanh 0,75kg']], String(t.pace), 'setProf_pace')}</div>` : ''}
        <div class="field"><span class="label" style="display:block;margin-bottom:4px">Mức vận động ngoài giờ tập</span>${seg([['low', 'Ít (văn phòng)'], ['mid', 'Vừa'], ['high', 'Nhiều']], p.activity || 'mid', 'setProf_activity')}</div>
        <div class="field"><span class="label" style="display:block;margin-bottom:4px">Tạng người</span>${seg([['ecto', 'Ecto · gầy'], ['meso', 'Meso · cân đối'], ['endo', 'Endo · dễ béo']], p.body || '', 'setProf_body')}
          <div class="muted" style="font-size:13px;margin-top:-8px">${{ ecto: 'Khung nhỏ, khó tăng cân → mặc định trao đổi chất nhanh, nhiều carb hơn (fat 22%).', meso: 'Dễ lên cơ, dáng cân đối → giữ tỷ lệ chuẩn (fat 25%).', endo: 'Dễ tích mỡ → mặc định trao đổi chất chậm, bớt carb (fat 30%).' }[p.body] || 'Chọn tạng gần giống bạn nhất. Đây là điểm xuất phát, app sẽ hiệu chỉnh bằng dữ liệu thật.'}</div></div>
        <div class="field"><span class="label" style="display:block;margin-bottom:4px">Trao đổi chất</span>${seg([['slow', 'Chậm'], ['normal', 'Bình thường'], ['fast', 'Nhanh']], metabOf(p), 'setProf_metab')}
          <div class="muted" style="font-size:13px;margin-top:-8px">${{ slow: 'Ăn ít vẫn khó giảm → tính thấp hơn công thức 7%.', normal: 'Theo công thức chuẩn Mifflin-St Jeor.', fast: 'Ăn nhiều vẫn khó tăng → tính cao hơn công thức 7%.' }[metabOf(p)]}</div></div>
        <div class="card coach" style="background:var(--card2);box-shadow:none;margin:0 0 16px">
          <div class="label" style="margin-bottom:4px">Trao đổi chất thực tế của bạn</div>
          ${t.real.tdee ? `<div>Theo 21 ngày gần nhất (ăn trung bình ${nf(t.real.intake, 0)} kcal, cân ${t.real.slope >= 0 ? 'tăng' : 'giảm'} ${nf(Math.abs(t.real.slope * 7), 2)} kg/tuần), cơ thể bạn đốt khoảng <b>${nf(t.real.tdee, 0)} kcal/ngày</b>.</div>
            <div class="muted" style="font-size:14px;margin-top:4px">${(() => { const d = (t.real.tdee / (t.formula / METAB[metabOf(p)]) - 1) * 100; return Math.abs(d) < 5 ? 'Gần đúng công thức chuẩn → trao đổi chất bình thường.' : `${d > 0 ? 'Cao' : 'Thấp'} hơn công thức chuẩn ${nf(Math.abs(d), 0)}% → trao đổi chất <b style="color:var(--text)">${d > 0 ? 'nhanh' : 'chậm'}</b>.`; })()}</div>
            <button class="btn sm ${p.useReal ? '' : 'soft'}" style="margin-top:10px" onclick="setProf('useReal',${p.useReal ? 'false' : 'true'});draw()">${p.useReal ? '✓ Đang dùng số thực tế' : 'Dùng số thực tế để tính calo'}</button>`
          : `<div class="muted" style="font-size:14px">Ghi ăn uống đủ <b style="color:var(--text)">10 ngày</b> và cân ít nhất <b style="color:var(--text)">4 lần</b> trong 3 tuần, app sẽ tự đo cơ thể bạn đốt bao nhiêu calo thật, chính xác hơn mọi cách tự đoán tạng. Hiện có ${t.real.days}/10 ngày, ${t.real.weighs}/4 lần cân.</div>`}
        </div>
        <div class="card" style="background:var(--card2);box-shadow:none;margin:0 0 12px">
          <div class="between"><span class="pill acc">${{ bulk: 'Bulk · tăng cân', cut: 'Cut · giảm mỡ', maintain: 'Giữ cân' }[t.goal]}</span>${t.weeks ? `<span class="muted" style="font-size:13px">~${t.weeks} tuần · dự kiến ${dm(addDays(today(), t.weeks * 7))}</span>` : ''}</div>
          <div style="margin-top:8px"><span class="big" style="font-size:30px">${nf(t.kcal, 0)}</span> <span class="muted">kcal/ngày</span></div>
          <div class="muted" style="font-size:14px">Protein ${t.protein}g · Carb ${t.carb}g · Fat ${t.fat}g · tiêu hao ước tính ~${nf(t.tdee, 0)} kcal</div>
          ${p.targetKg ? `<div class="muted" style="font-size:13px;margin-top:4px">${t.goal === 'maintain' ? 'Đã sát cân nặng mục tiêu.' : `Còn ${t.diff > 0 ? 'tăng' : 'giảm'} ${nf(Math.abs(toU(t.diff)))} ${unit()}.`}</div>` : '<div class="muted" style="font-size:13px;margin-top:4px">Nhập cân nặng mục tiêu để app tự tính calo.</div>'}
          ${t.floored ? '<div style="font-size:13px;margin-top:4px;color:var(--warn)">Đã giữ calo ở mức tối thiểu an toàn, nên chọn tốc độ giảm chậm hơn.</div>' : ''}
        </div>
        ${inp('kcal', 'Tự đặt calo (để trống = app tự tính)', 'number', String(t.auto))}</div>
      <div class="card"><div class="label" style="margin-bottom:8px">Giao diện</div>${seg([['light', 'Sáng'], ['dark', 'Tối'], ['system', 'Theo hệ thống']], p.theme || 'system', 'setProf_theme')}
        <div class="label" style="margin-bottom:8px">Đơn vị</div>${seg([['kg', 'kg'], ['lbs', 'lbs']], unit(), 'setProf_unit')}</div>
      <div class="card tap" onclick="customList()"><div class="between"><div><b>Thư viện bài tập riêng</b><div class="muted" style="font-size:14px">${rows('ExerciseLibrary').length} bài tự tạo · ${EX ? EX.size : '…'} bài có sẵn kèm hình</div></div>${IC.chev}</div></div>
      <div class="card"><div class="label" style="margin-bottom:6px">Đồng bộ Google Sheet</div>
        <div style="font-size:14px">${AUTH.api ? `Đã kết nối · ${QUEUE.length ? `<b>${QUEUE.length}</b> thay đổi chờ gửi` : 'đã đồng bộ hết'}<div class="muted" style="font-size:13px">Lần cuối: ${last ? new Date(last).toLocaleString('vi-VN') : 'chưa'}</div>` : '<span class="muted">Chế độ offline — dữ liệu chỉ nằm trên máy này.</span>'}</div>
        <div class="row" style="margin-top:12px">${AUTH.api ? '<button class="btn sm" onclick="sync().then(()=>{draw();toast(\'Đã đồng bộ\')})">Đồng bộ ngay</button>' : ''}<button class="btn sm ghost" onclick="logout()">Đăng xuất</button></div></div>
    </div>`,
  };
};
// seg() gọi fn('giá trị') → bọc setProf cho từng trường
['sex', 'goal', 'theme', 'unit', 'pace', 'activity', 'body', 'metab'].forEach(k => window['setProf_' + k] = v => { setProf(k, v); draw(); });
window.setProf_body = v => { const p = prof(); if (!p.metabManual) setProf('metab', ''); setProf('body', v); draw(); }; // đổi tạng → trao đổi chất theo tạng, trừ khi đã tự chọn
window.setProf_metab = v => { setProf('metabManual', true); setProf('metab', v); draw(); };
window.setProf_theme = v => themeReveal(() => { setProf('theme', v); draw(); });
function customList() {
  const list = rows('ExerciseLibrary');
  openSheet(`<h2>Bài tập riêng</h2><div class="list">${list.map(r => `<div class="item"><div class="grow"><b>${esc(r.name)}</b><div class="muted" style="font-size:14px">${MUSCLE[r.muscle] || ''} · ${EQUIP[r.equipment] || ''}</div></div><button class="x" onclick="del('ExerciseLibrary','${r.id}');customList()">${IC.x}</button></div>`).join('') || '<div class="empty">Chưa có bài tự tạo</div>'}</div>
    <button class="btn" style="margin-top:12px" onclick="customExSheet()">+ Tạo bài mới</button>`);
}
function logout() {
  if (!confirm(QUEUE.length ? `Còn ${QUEUE.length} thay đổi chưa đồng bộ sẽ bị mất. Vẫn đăng xuất?` : 'Đăng xuất khỏi máy này?')) return;
  localStorage.clear(); location.reload();
}

// ===== Đăng nhập =====
function drawLogin() {
  $('#title').textContent = ''; $('#title').removeAttribute('aria-label'); $('#fab').classList.add('hide'); setSync('off'); $('#tabs').style.display = 'none';
  $('#screen').innerHTML = `<form class="login" onsubmit="login(this);return false">
    <div class="logo">${IC.dumb}</div>
    <h1 id="hello" style="font:400 36px/1.3 var(--display);letter-spacing:.01em;margin:0 0 28px"></h1>
    <label class="field"><span>Mật khẩu</span><input class="in" name="key" type="password" autocomplete="current-password" required autofocus></label>
    <button class="btn" id="lbtn">Vào app</button></form>`;
  blurIn($('#hello'), 'Xin chào ' + OWNER);
}
async function login(f) {
  const a = { name: OWNER, api: API, key: f.key.value }, b = $('#lbtn');
  b.disabled = true; b.textContent = 'Đang kiểm tra…';
  AUTH = a;
  try { DATA = norm((await api({ ops: [] })).data); }
  catch (e) { AUTH = null; b.disabled = false; b.textContent = 'Vào app'; toast(/Sai mã/.test(e.message) ? 'Sai mật khẩu' : 'Không kết nối được, thử lại'); return; }
  store.set('auth', a); store.set('last', Date.now()); save();
  $('#tabs').style.display = ''; applyTheme(); draw(true);
}

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
let lastTap = { x: innerWidth / 2, y: innerHeight / 2 };
document.addEventListener('pointerdown', e => { // gợn sóng từ đúng chỗ ngón tay chạm
  lastTap = { x: e.clientX, y: e.clientY };
  const el = e.target.closest('.btn, .card.tap, .seg button, .chips button, #tabs button, .list .item[onclick], #fab, .icon-btn');
  if (!el || REDUCED.matches) return;
  const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  el.appendChild(dot); setTimeout(() => dot.remove(), 700);
}, { passive: true });
function burst(n = 10, gold) { // hạt bắn ra từ chỗ vừa bấm (lưu set, kỷ lục…)
  if (REDUCED.matches) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'), a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = 40 + Math.random() * (gold ? 70 : 34);
    p.className = 'spark' + (gold ? ' gold' : '');
    p.style.cssText = `left:${lastTap.x}px;top:${lastTap.y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--s:${gold ? 1 + Math.random() : 0.6 + Math.random() * 0.6}`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 900);
  }
}
function themeReveal(fn) { // đổi sáng/tối: màu mới loang tròn từ chỗ chạm
  if (!document.startViewTransition || REDUCED.matches) return fn();
  const { x, y } = lastTap, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)), root = document.documentElement;
  root.classList.add('theme-vt');
  const t = document.startViewTransition(fn);
  t.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' }));
  t.finished.finally(() => root.classList.remove('theme-vt'));
}
function applyTheme() {
  const t = prof().theme, root = document.documentElement;
  if (t === 'light' || t === 'dark') root.dataset.theme = t; else delete root.dataset.theme;
  requestAnimationFrame(() => document.querySelector('meta[name=theme-color]').content = getComputedStyle(document.body).backgroundColor);
}

// ===== Khởi động =====
document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => go(b.dataset.tab));
addEventListener('online', queueSync);
document.addEventListener('visibilitychange', () => { if (!document.hidden) queueSync(); });
applyTheme(); draw(true); loadEx();
if (AUTH) sync();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });
