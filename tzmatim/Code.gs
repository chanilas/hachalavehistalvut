/**
 * צמתים – תוכנית עבודה שנתית לרכזות המקצועות
 * הקוד הזה יושב בתוך גיליון Google (תוספים ← Apps Script) ושומר את כל מה שהרכזות כותבות.
 * את הדף עצמו הוא מגיש מהקובץ Index.html.
 */

// קוד הכניסה ל"מבט ניהולי" – אפשר לשנות לכל מספר שתרצי
const ADMIN_CODE = '5787';

// כל סוג נתונים נשמר בלשונית משלו. העמודה האחרונה (json) היא מה שהכלי קורא; השאר בשבילך, לקריאה נוחה.
const TABLES = {
  teams: {
    sheet: 'צוותים',
    headers: ['מזהה', 'רכזת', 'מורות בצוות', 'עודכן'],
    row: o => [o.id, coordName(o.coord), (o.teachers || []).join(', ')]
  },
  goals: {
    sheet: 'יעדים',
    headers: ['מזהה', 'רכזת', 'סוג יעד', 'יעד', 'פירוט', 'שכבות', 'מורות', 'עודכן'],
    row: o => [o.id, coordName(o.coord), goalKindName(o.kind), o.title, o.desc,
      gradesText(o.grades), (o.teachers || []).join(', ')]
  },
  actions: {
    sheet: 'פעולות',
    headers: ['מזהה', 'רכזת', 'פעולה', 'פירוט', 'מקדמת', 'שכבות', 'מורות', 'שותפים', 'מחודש', 'עד חודש',
      'סדירות', 'מה צריך', 'איך נדע שהצלחנו', 'סטטוס', 'מה עובד / מה נתקע', 'עודכן'],
    row: o => [o.id, coordName(o.coord), o.title, o.desc, (o.tags || []).map(tagName).join(', '),
      gradesText(o.grades), (o.teachers || []).join(', '), (o.partners || []).join(', '), o.from, o.to,
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

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('צמתים · תוכנית עבודה שנתית')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
function statusName(s) {
  return { planned: 'מתוכנן', active: 'בביצוע', done: 'הושלם', stuck: 'נתקע' }[s] || '';
}
function gradesText(g) {
  if (!g || !g.length) return '';
  return g.indexOf('all') > -1 ? 'כל השכבות' : g.join(', ');
}
