
export interface Statement {
  id: string;
  text: string;
  categoryId: string;
}

export interface StatementCategory {
  id: string;
  title: string;
  statements: Statement[];
  color: string; // For visual distinction, e.g., 'bg-sky-100'
  borderColor: string; // e.g., 'border-sky-500'
}

export interface CentralEmphasisDetail {
  id: string;
  title: string;
  points: string[];
}

export interface WorkArena {
  id: string;
  statementCategoryId: string; // The category this work arena primarily addresses
  title: string; // תחום ההיגדים this work arena relates to (e.g., "מדיניות ותהליכים")
  suggestedActionArea: string; // זירת פעולה מוצעת להדרכה
  centralEmphasisDetails: CentralEmphasisDetail[]; // Detailed breakdown of central emphasis
  color: string;
  borderColor: string;
}

export interface SolutionItem {
  id: string;
  text: string;
  subItems?: string[]; // For nested details, e.g., under "הנגשת ההוראה והלמידה"
}

export interface SolutionGroup {
  id: string;
  groupTitle: string; // e.g., "תפיסת המגוון כערך (עקרון מלווה: לחגוג את השונות)"
  items: SolutionItem[];
  // Optional: add specific colors for these groups if needed later
  // pillarColor?: string; 
  // pillarBorderColor?: string;
}

export interface KnowledgeSolution {
  id: string;
  workArenaStatementCategoryId: string; // The statement category ID this solution set is for
  title: string; // Title for the solution set, e.g., "פתרונות עבור תשתית תפיסתית ויישומית"
  solutionGroups: SolutionGroup[]; // Structured groups of solutions based on the 4 main pillars of the map
  color: string;
  borderColor: string;
}
