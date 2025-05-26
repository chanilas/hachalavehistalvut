
import { StatementCategory, WorkArena, KnowledgeSolution } from './types';

export const APP_TITLE = "לראות את כל הקשת";
export const APP_SUBTITLE = "מפת ידע ומארז כלים לקידום תהליכי הוראה מותאמי פרט בכיתה ההטרוגנית";

export const STATEMENT_CATEGORIES: StatementCategory[] = [
  {
    id: "policy",
    title: "מדיניות ותהליכים",
    color: "bg-amber-50",
    borderColor: "border-amber-500",
    statements: [
      { id: "policy_1", categoryId: "policy", text: "בבית ספרנו קיימים נהלים סדורים ושגרות שיטתיות לזיהוי ומענה לפרט." },
      { id: "policy_2", categoryId: "policy", text: "נאספת בבית הספר תמונת מצב מערכתית ומבוססת נתונים על הצרכים המגוונים של התלמידים." },
      { id: "policy_3", categoryId: "policy", text: "רכזת הכלה והשתלבות שותפה פעיל/ה בבניית מדיניות המענה לפרט." },
    ],
  },
  {
    id: "climate",
    title: "אקלים ותרבות בית ספרית",
    color: "bg-purple-50",
    borderColor: "border-purple-500",
    statements: [
      { id: "climate_1", categoryId: "climate", text: "תרבות של הכלה, שיח רגשי והוגנות מושרשת בקרב הצוות ומובילה את העשייה החינוכית." },
      { id: "climate_2", categoryId: "climate", text: "בבית ספרנו קיימים תהליכים לקידום תחושת שייכות, ערך עצמי ומסוגלות בקרב כלל התלמידים." },
      { id: "climate_3", categoryId: "climate", text: "רכזת הכלה והשתלבות פועל/ת לקידום חזון חינוכי המבוסס על הכלה, שותפות והוגנות." },
    ],
  },
  {
    id: "pedagogy",
    title: "פדגוגיה מותאמת ומגוונת",
    color: "bg-teal-50",
    borderColor: "border-teal-500",
    statements: [
      { id: "pedagogy_1", categoryId: "pedagogy", text: "הצוות החינוכי פועל באופן עקבי מתוך פדגוגיה דיפרנציאלית, בשילוב עבודה בקבוצות הטרוגניות." },
      { id: "pedagogy_2", categoryId: "pedagogy", text: "קיימת היכרות עם עקרונות ה-UDL ונעשים צעדים להטמעתם בהוראה." },
      { id: "pedagogy_3", categoryId: "pedagogy", text: "רכזת הכלה והשתלבות מהווה גורם מוביל בתיווך ידע פדגוגי מותאם ובבנייה של מענה הוליסטי." },
    ],
  },
  {
    id: "development",
    title: "פיתוח מקצועי ותמיכה בצוות",
    color: "bg-sky-50",
    borderColor: "border-sky-500",
    statements: [
      { id: "development_1", categoryId: "development", text: "קיימות תכניות פיתוח מקצועי לצוות החינוכי המתמקדות בהכלה והשתלבות." },
      { id: "development_2", categoryId: "development", text: "הצוות מרגיש כי הוא מקבל תמיכה מקצועית וכלים להתמודדות עם מורכבות הכיתה ההטרוגנית." },
      { id: "development_3", categoryId: "development", text: "רכזת הכלה והשתלבות מייצר/ת תהליכים ללמידה, הנחיה ורפלקציה בצוות בנושאים אלו." },
    ],
  },
];

// Enriched WORK_ARENAS with centralEmphasisDetails from "תשתית תפיסתית יישומית" (map bottom row)
export const WORK_ARENAS: WorkArena[] = [
  {
    id: "wa_policy",
    statementCategoryId: "policy",
    title: "מדיניות ותהליכים",
    suggestedActionArea: "תשתית תפיסתית-יישומית",
    centralEmphasisDetails: [
      { id: "ced_policy_1", title: "היכרות, תכנון ומעקב", points: ["היכרות הוליסטית ומעמיקה", "סיפור פרטני וכיתתי", "שימוש במיפוי העוגן", "תכנית עבודה", "מעקב ובקרה"] },
      { id: "ced_policy_2", title: "עקרונות פעולה מרכזיים", points: ["עיצוב אוניברסלי ללמידה", "הוגנות", "למידה רגשית חברתית"] },
      { id: "ced_policy_3", title: "ארגון מערכתי", points: ["ארגון זמן", "ארגון סביבה", "ארגון לומדים", "ארגון תכנים"] },
    ],
    color: "bg-amber-100",
    borderColor: "border-amber-600",
  },
  {
    id: "wa_climate",
    statementCategoryId: "climate",
    title: "אקלים ותרבות בית ספרית",
    suggestedActionArea: "למידה רגשית-חברתית והובלת אקלים",
    centralEmphasisDetails: [
        { id: "ced_climate_1", title: "טיפוח שייכות וזהות", points: ["חיזוק תחושת שייכות", "טיפוח זהות אישית וקבוצתית", "טיפוח תחושת קהילה"] },
        { id: "ced_climate_2", title: "יצירת קשרים ובריתות", points: ["יצירת בריתות חינוכיות עם הורים וקהילה", "פיתוח תקשורת מיטבית"] },
        { id: "ced_climate_3", title: "קידום רווחה רגשית וחברתית", points: ["הטמעת למידה רגשית-חברתית (SEL)", "שיח ערכי ורגשי מתמיד"] },
    ],
    color: "bg-purple-100",
    borderColor: "border-purple-600",
  },
  {
    id: "wa_pedagogy",
    statementCategoryId: "pedagogy",
    title: "פדגוגיה מותאמת ומגוונת",
    suggestedActionArea: "פדגוגיה איכותית והוראה בקבוצות",
     centralEmphasisDetails: [
        { id: "ced_pedagogy_1", title: "עקרונות הוראה מכילה", points: ["יישום עקרונות הוראה דיפרנציאלית", "שילוב עקרון הבחירה בתהליכי למידה", "שימוש במתודות הוראה מגוונות"] },
        { id: "ced_pedagogy_2", title: "הנגשה והתאמה", points: ["התאמת דרכי ייצוג הידע וההבעה", "הנגשת חומרי למידה וסביבות למידה", "שימוש בטכנולוגיה להנגשה", "זיהוי והסרת חסמים"] },
        { id: "ced_pedagogy_3", title: "עבודה בקבוצות", points: ["הוראה ולמידה בקבוצות הטרוגניות", "פיתוח מיומנויות עבודה שיתופית"] },
    ],
    color: "bg-teal-100",
    borderColor: "border-teal-600",
  },
  {
    id: "wa_development",
    statementCategoryId: "development",
    title: "פיתוח מקצועי ותמיכה בצוות",
    suggestedActionArea: "הובלה מקצועית והנחיית צוות",
    centralEmphasisDetails: [
        { id: "ced_dev_1", title: "בניית תשתיות למידה צוותית", points: ["יצירת קהילות למידה מקצועיות (PLC)", "פיתוח תהליכי למידה, הנחיה ורפלקציה בצוות"] },
        { id: "ced_dev_2", title: "ליווי והתפתחות מקצועית", points: ["ליווי מקצועי לרכזים ולצוותי חינוך", "התמקצעות בהובלת שינוי פדגוגי מערכתי"] },
        { id: "ced_dev_3", title: "טיפוח תחושת מסוגלות צוותית", points: ["מתן כלים להתמודדות עם מורכבות הכיתה ההטרוגנית", "חיזוק תחושת המסוגלות והמוטיבציה של הצוות"] },
    ],
    color: "bg-sky-100",
    borderColor: "border-sky-600",
  },
];

// Shared solution groups based on the 4 main pillars of the graphical knowledge map
const SHARED_SOLUTION_GROUPS = {
  diversityAsValue: {
    id: "sg_diversity",
    groupTitle: "תפיסת המגוון כערך (עקרון מלווה: לחגוג את השונות)",
    items: [
      { id: "ss_diversity_1", text: "הבלטת ייחודיות של כל תלמיד ומורה" },
      { id: "ss_diversity_2", text: "ארגון לומדים בקבוצות הטרוגניות" },
    ],
  },
  relationshipsAndCare: {
    id: "sg_relationships",
    groupTitle: "יצירת יחסי קרבה ואכפתיות (עקרון מלווה: לא עלינו בלעדינו)",
    items: [
      { id: "ss_relationships_1", text: "המורה בעל סמכות מיטיבה ומגדלת (מבוגר משמעותי)" },
      { id: "ss_relationships_2", text: "יציקת תכנים רגשיים וחברתיים בהוראה" },
      { id: "ss_relationships_3", text: "תודעת צמיחה" },
      { id: "ss_relationships_4", text: "קהילה כיתתית מכילה וצוות ותלמידים" },
      { id: "ss_relationships_5", text: "ברית חינוכית עם ההורים" },
      { id: "ss_relationships_6", text: "אמון במסוגלות כלל התלמידים" },
    ],
  },
  accessibility: {
    id: "sg_accessibility",
    groupTitle: "הנגשת הסביבה לתלמיד ולמורה (עקרון מלווה: הוראה מכוונת הסרת חסמים)",
    items: [
      { id: "ss_accessibility_1", text: "הוראה מפורשת וישירה" },
      { id: "ss_accessibility_2", text: "התאמת דרכי ייצוג הידע וההבעה" },
      { id: "ss_accessibility_3", text: "הנגשת ההוראה והלמידה", subItems: ["הערכה מכוונת מגוון", "עקרון הריווח", "משוב מקדם למידה"] },
      { id: "ss_accessibility_4", text: "הנגשת סביבת הלמידה" },
      { id: "ss_accessibility_5", text: "הנגשת חומרי הלמידה" },
      { id: "ss_accessibility_6", text: "הנגשה טכנולוגית" },
    ],
  },
  qualityPedagogy: {
    id: "sg_pedagogy",
    groupTitle: "שימוש בפדגוגיה איכותית המאפשרת הכלה (עקרון מלווה: חיוני לחלק, מטיב לרבים)",
    items: [
      { id: "ss_pedagogy_1", text: "הוראה חכמה" },
      { id: "ss_pedagogy_2", text: "עקרון הגיוון" },
      { id: "ss_pedagogy_3", text: "עקרון הבחירה" },
      { id: "ss_pedagogy_4", text: "הערכה מכוונת מגוון" }, // Note: Also mentioned under accessibility's sub-item. Included here as per map structure.
      { id: "ss_pedagogy_5", text: "עקרון הריווח" }, // Note: Also mentioned under accessibility's sub-item.
      { id: "ss_pedagogy_6", text: "משוב מקדם למידה" }, // Note: Also mentioned under accessibility's sub-item.
      { id: "ss_pedagogy_7", text: "עקרון הלמידה המשולבת" },
      { id: "ss_pedagogy_8", text: "עקרון הפדגוגיה הקשובה" },
      { id: "ss_pedagogy_9", text: "הוראה בקבוצות" },
      { id: "ss_pedagogy_10", text: "עקרון ההפעלה והמעורבות השתתפות פעילה" },
    ],
  },
};

export const KNOWLEDGE_SOLUTIONS: KnowledgeSolution[] = [
  {
    id: "ks_policy",
    workArenaStatementCategoryId: "policy",
    title: "מענים ופתרונות עבור: תשתית תפיסתית ויישומית",
    color: "bg-amber-200",
    borderColor: "border-amber-700",
    solutionGroups: [
      SHARED_SOLUTION_GROUPS.diversityAsValue,
      SHARED_SOLUTION_GROUPS.relationshipsAndCare,
      SHARED_SOLUTION_GROUPS.accessibility,
      SHARED_SOLUTION_GROUPS.qualityPedagogy,
    ],
  },
  {
    id: "ks_climate",
    workArenaStatementCategoryId: "climate",
    title: "מענים ופתרונות עבור: אקלים רגשי-חברתי",
    color: "bg-purple-200",
    borderColor: "border-purple-700",
    solutionGroups: [
      SHARED_SOLUTION_GROUPS.diversityAsValue, // Relevant for inclusive climate
      SHARED_SOLUTION_GROUPS.relationshipsAndCare, // Core for climate
      SHARED_SOLUTION_GROUPS.accessibility, // Accessibility supports positive climate
      SHARED_SOLUTION_GROUPS.qualityPedagogy, // Pedagogy impacts climate
    ],
  },
  {
    id: "ks_pedagogy",
    workArenaStatementCategoryId: "pedagogy",
    title: "מענים ופתרונות עבור: הוראה מותאמת",
    color: "bg-teal-200",
    borderColor: "border-teal-700",
    solutionGroups: [
      SHARED_SOLUTION_GROUPS.diversityAsValue, // UDL and diversity
      SHARED_SOLUTION_GROUPS.accessibility, // Core for adapted teaching
      SHARED_SOLUTION_GROUPS.qualityPedagogy, // Core for adapted teaching
      SHARED_SOLUTION_GROUPS.relationshipsAndCare, // Relationships support pedagogy
    ],
  },
  {
    id: "ks_development",
    workArenaStatementCategoryId: "development",
    title: "מענים ופתרונות עבור: פיתוח מקצועי",
    color: "bg-sky-200",
    borderColor: "border-sky-700",
    solutionGroups: [
       // All pillars are relevant for holistic professional development for inclusion
      SHARED_SOLUTION_GROUPS.diversityAsValue,
      SHARED_SOLUTION_GROUPS.relationshipsAndCare,
      SHARED_SOLUTION_GROUPS.accessibility,
      SHARED_SOLUTION_GROUPS.qualityPedagogy,
    ],
  },
];

export const SECTIONS_TITLES = {
  statements: "שלב 1: בחירת היגדים לשיפור",
  focusAreas: "שלב 2: זירות פעולה מרכזיות למיקוד",
  solutions: "שלב 3: מענים ופתרונות מתוך מפת הידע",
  geminiPlayground: "שלב 4: קבל/י רעיונות נוספים בעזרת Gemini",
};
