/**
 * צמתים – תוכנית עבודה שנתית לרכזות המקצועות
 * הקוד הזה יושב בתוך גיליון Google (תוספים ← Apps Script) ושומר את כל מה שהרכזות כותבות.
 * את הדף עצמו הוא מגיש מהקובץ Index.html.
 */

// קוד הכניסה ל"מבט ניהולי" – אפשר לשנות לכל מספר שתרצי
const ADMIN_CODE = '5787';

// קוד הכניסה ל"נתוני הערכה" – לתת רק לרכזות ולמנהלת. בלי הקוד הסקריפט לא מחזיר שום ציון.
const ASSESS_CODE = '2468';

// כל סוג נתונים נשמר בלשונית משלו. העמודה האחרונה (json) היא מה שהכלי קורא; השאר בשבילך, לקריאה נוחה.
const TABLES = {
  teams: {
    sheet: 'צוותים',
    headers: ['מזהה', 'רכזת', 'מורות בצוות', 'עודכן'],
    row: o => [o.id, coordName(o.coord), (o.teachers || []).join(', ')]
  },
  goals: {
    sheet: 'יעדים',
    headers: ['מזהה', 'רכזת', 'סוג יעד', 'יעד', 'פירוט', 'עודכן'],
    row: o => [o.id, coordName(o.coord), goalKindName(o.kind), o.title, o.desc]
  },
  actions: {
    sheet: 'פעולות',
    headers: ['מזהה', 'רכזת', 'פעולה', 'פירוט', 'מקדמת', 'מודל חוויה', 'שלבי חוויה', 'שכבות', 'מורות', 'שותפים', 'מחודש', 'עד חודש',
      'סדירות', 'מה צריך', 'איך נדע שהצלחנו', 'סטטוס', 'מה עובד / מה נתקע', 'עודכן'],
    row: o => [o.id, coordName(o.coord), o.title, o.desc, (o.tags || []).map(tagName).join(', '),
      chavayaName(o.chavaya), (o.stages || []).map(stageName).join(', '), gradesText(o.grades), (o.teachers || []).join(', '), (o.partners || []).join(', '), o.from, o.to,
      o.regularity, [].concat(o.needs || [], o.needsOther ? [o.needsOther] : []).join(', '), o.success,
      statusName(o.status), o.reflection]
  },
  district: {
    sheet: 'מהלך מחוזי',
    headers: ['מזהה', 'רכזת', 'איך זה בא לידי ביטוי בתחום שלי', 'מורות', 'מחודש', 'עד חודש', 'סטטוס', 'מה עובד / מה נתקע', 'עודכן'],
    row: o => [o.id, coordName(o.coord), o.expression, (o.teachers || []).join(', '), o.from, o.to,
      statusName(o.status), o.reflection]
  }
};

function doGet(e) {
  const p = (e && e.parameter) || {};
  // כשהדף יושב באתר, הוא מבקש מכאן נתונים
  if (p.action === 'getAll') return json(() => getAll());
  if (p.action === 'checkAdmin') return json(() => checkAdmin(p.code));
  if (p.action === 'assessAll') return json(() => assessAll(p.code));
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('צמתים · תוכנית עבודה שנתית')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** שמירה ומחיקה כשהדף יושב באתר */
function doPost(e) {
  return json(() => {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'save') return saveItem(body.type, body.obj);
    if (body.action === 'remove') return removeItem(body.type, body.id);
    if (body.action === 'saveGrades') return saveGrades(body.code, body.cls, body.subject, body.half, body.entries);
    if (body.action === 'saveClass') return saveClass(body.code, body.cls, body.names);
    if (body.action === 'saveBands') return saveBands(body.code, body.bands);
    throw new Error('פעולה לא מוכרת');
  });
}

function json(fn) {
  let out;
  try { out = { ok: true, data: fn() }; } catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/** מחזיר את כל הנתונים לדף */
function getAll() {
  const out = {};
  Object.keys(TABLES).forEach(type => {
    const sh = sheetFor(type);
    const last = sh.getLastRow();
    if (last < 2) { out[type] = []; return; }
    const width = TABLES[type].headers.length + 1;
    out[type] = sh.getRange(2, 1, last - 1, width).getValues()
      .map(r => { try { return JSON.parse(r[width - 1]); } catch (e) { return null; } })
      .filter(Boolean);
  });
  return out;
}

/** שומר רשומה אחת (יוצר או מעדכן לפי מזהה) */
function saveItem(type, obj) {
  if (!TABLES[type]) throw new Error('סוג לא מוכר');
  if (!obj || !obj.id) throw new Error('חסר מזהה');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    obj.updatedAt = new Date().toISOString();
    const sh = sheetFor(type);
    const values = TABLES[type].row(obj).map(v => v == null ? '' : v);
    values.push(new Date(), JSON.stringify(obj));
    const r = findRow(sh, obj.id);
    if (r) sh.getRange(r, 1, 1, values.length).setValues([values]);
    else sh.appendRow(values);
    return obj;
  } finally {
    lock.releaseLock();
  }
}

/** מוחק רשומה */
function removeItem(type, id) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheetFor(type);
    const r = findRow(sh, id);
    if (r) sh.deleteRow(r);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function checkAdmin(code) {
  return String(code).trim() === ADMIN_CODE;
}

// ---------- עזרים ----------

function sheetFor(type) {
  const t = TABLES[type];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(t.sheet);
  if (!sh) {
    sh = ss.insertSheet(t.sheet);
    sh.setRightToLeft(true);
    const headers = t.headers.concat(['json']);
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#2B2550').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.hideColumns(headers.length);
  }
  return sh;
}

function findRow(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (ids[i][0] === id) return i + 2;
  return 0;
}

function coordName(c) {
  return { kodesh: 'קודש', hebrew: 'עברית', english: 'אנגלית', math: 'מתמטיקה' }[c] || c;
}
function goalKindName(k) {
  return { subject: 'יעד מקצועי', curiosity: 'סקרנות וחקרנות', skills: 'הוראת מיומנויות' }[k] || '';
}
function tagName(t) {
  return { curiosity: 'סקרנות וחקרנות', skills: 'הוראת מיומנויות', subject: 'יעד מקצועי' }[t] || t;
}
function chavayaName(c) {
  return { long: 'התנסות ארוכה', short: 'התנסות קצרה', none: 'לא' }[c] || '';
}
function stageName(s) {
  return { research: 'חקר', organize: 'ארגון', create: 'יצירה', present: 'הצגה' }[s] || s;
}
function statusName(s) {
  return { planned: 'מתוכנן', active: 'בביצוע', done: 'הושלם', stuck: 'נתקע' }[s] || '';
}
function gradesText(g) {
  if (!g || !g.length) return '';
  return g.indexOf('all') > -1 ? 'כל השכבות' : g.join(', ');
}

// ================= נתוני הערכה =================
// לשונית "ציונים": שורה לכל תלמידה, עמודה לכל תחום ומחצית.

const SUBJECTS = [['kodesh', 'קודש'], ['hebrew', 'עברית'], ['english', 'אנגלית'], ['math', 'מתמטיקה']];
const HALVES = [['a', 'מחצית א'], ['b', 'מחצית ב']];
const GRADES_SHEET = 'ציונים';
const SETTINGS_SHEET = 'הגדרות';
const DEFAULT_BANDS = [0, 41, 61, 76, 90];

function gradeHeaders() {
  const h = ['מזהה', 'כיתה', 'שם'];
  SUBJECTS.forEach(s => HALVES.forEach(hv => h.push(s[1] + ' – ' + hv[1])));
  return h;
}
function gradeCol(subject, half) {
  const si = SUBJECTS.findIndex(s => s[0] === subject), hi = HALVES.findIndex(h => h[0] === half);
  if (si < 0 || hi < 0) throw new Error('תחום או מחצית לא מוכרים');
  return 4 + si * 2 + hi; // מספר עמודה בגיליון
}
function gradesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(GRADES_SHEET);
  if (!sh) {
    sh = ss.insertSheet(GRADES_SHEET);
    sh.setRightToLeft(true);
    const h = gradeHeaders();
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#2B2550').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.hideColumns(1);
  }
  return sh;
}
function requireCode(code, adminOnly) {
  const c = String(code || '').trim();
  if (c === ADMIN_CODE || (!adminOnly && c === ASSESS_CODE)) return;
  throw new Error(adminOnly ? 'נדרש קוד ניהול' : 'קוד שגוי');
}
function readGradeRows() {
  const sh = gradesSheet(), last = sh.getLastRow(), w = gradeHeaders().length;
  return last < 2 ? [] : sh.getRange(2, 1, last - 1, w).getValues();
}
function getBands() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET);
  if (!sh) return DEFAULT_BANDS;
  try { const b = JSON.parse(sh.getRange('B1').getValue()); return Array.isArray(b) && b.length === 5 ? b : DEFAULT_BANDS; }
  catch (e) { return DEFAULT_BANDS; }
}

/** כל התלמידות, הציונים והמדרג */
function assessAll(code) {
  requireCode(code, false);
  const students = readGradeRows().filter(r => r[0]).map(r => {
    const g = {};
    SUBJECTS.forEach((s, si) => {
      g[s[0]] = {};
      HALVES.forEach((h, hi) => {
        const v = r[3 + si * 2 + hi];
        g[s[0]][h[0]] = v === '' || v === null ? null : Number(v);
      });
    });
    return { id: String(r[0]), cls: String(r[1]), name: String(r[2]), g: g };
  });
  return { students: students, bands: getBands(), admin: String(code).trim() === ADMIN_CODE };
}

/** הדבקת ציונים: entries = [{id, score}] (score ריק = מחיקת הציון) */
function saveGrades(code, cls, subject, half, entries) {
  requireCode(code, false);
  const col = gradeCol(subject, half);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = gradesSheet(), last = sh.getLastRow();
    if (last < 2) throw new Error('אין עדיין רשימות תלמידות');
    const ids = sh.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0]));
    const range = sh.getRange(2, col, last - 1, 1), vals = range.getValues();
    (entries || []).forEach(e => {
      const i = ids.indexOf(String(e.id));
      if (i < 0) return;
      const n = e.score === '' || e.score === null || e.score === undefined ? '' : Number(e.score);
      vals[i][0] = n === '' || (isFinite(n) && n >= 0 && n <= 100) ? n : vals[i][0];
    });
    range.setValues(vals);
  } finally {
    lock.releaseLock();
  }
  return assessAll(code);
}

/** רשימת תלמידות לכיתה. תלמידה שכבר קיימת (לפי שם) שומרת את הציונים שלה. */
function saveClass(code, cls, names) {
  requireCode(code, true);
  cls = String(cls || '').trim();
  if (!cls) throw new Error('חסרה כיתה');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = gradesSheet(), w = gradeHeaders().length, rows = readGradeRows();
    const others = rows.filter(r => String(r[1]) !== cls);
    const mine = rows.filter(r => String(r[1]) === cls);
    const key = n => String(n).replace(/\s+/g, ' ').trim();
    const fresh = (names || []).map(key).filter(Boolean).map(n => {
      const old = mine.find(r => key(r[2]) === n);
      if (old) return old;
      const row = new Array(w).fill('');
      row[0] = Utilities.getUuid().slice(0, 8); row[1] = cls; row[2] = n;
      return row;
    });
    const all = others.concat(fresh);
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, w).clearContent();
    if (all.length) sh.getRange(2, 1, all.length, w).setValues(all);
  } finally {
    lock.releaseLock();
  }
  return assessAll(code);
}

/** גבולות המדרג: חמישה מספרים, הציון המינימלי של כל צבע */
function saveBands(code, bands) {
  requireCode(code, true);
  if (!Array.isArray(bands) || bands.length !== 5) throw new Error('מדרג לא תקין');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SETTINGS_SHEET) || ss.insertSheet(SETTINGS_SHEET);
  sh.getRange('A1:B1').setValues([['מדרג ציונים', JSON.stringify(bands.map(Number))]]);
  return assessAll(code);
}
