
import React, { useState, useEffect, useCallback } from 'react';
import { StatementCategory, Statement, WorkArena, KnowledgeSolution } from './types';
import { STATEMENT_CATEGORIES, WORK_ARENAS, KNOWLEDGE_SOLUTIONS, APP_TITLE, APP_SUBTITLE, SECTIONS_TITLES } from './constants';
import StatementSelector from './components/StatementSelector';
import FocusAreaDisplay from './components/FocusAreaDisplay';
import KnowledgeSolutionDisplay from './components/KnowledgeSolutionDisplay';
import GeminiPlayground from './components/GeminiPlayground'; // Import GeminiPlayground
import Card from './components/shared/Card';

const App: React.FC = () => {
  const [selectedStatementIds, setSelectedStatementIds] = useState<Set<string>>(new Set());
  const [derivedFocusAreas, setDerivedFocusAreas] = useState<WorkArena[]>([]);
  const [derivedKnowledgeSolutions, setDerivedKnowledgeSolutions] = useState<KnowledgeSolution[]>([]);
  const [shareFeedback, setShareFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleStatementToggle = useCallback((statementId: string) => {
    setSelectedStatementIds(prevSelectedIds => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(statementId)) {
        newSelectedIds.delete(statementId);
      } else {
        newSelectedIds.add(statementId);
      }
      return newSelectedIds;
    });
  }, []);

  useEffect(() => {
    const implicatedCategoryIds = new Set<string>();
    selectedStatementIds.forEach(id => {
      const foundStatement = STATEMENT_CATEGORIES.flatMap(cat => cat.statements).find(stmt => stmt.id === id);
      if (foundStatement) {
        implicatedCategoryIds.add(foundStatement.categoryId);
      }
    });

    const focusAreas = WORK_ARENAS.filter(arena => implicatedCategoryIds.has(arena.statementCategoryId));
    setDerivedFocusAreas(focusAreas);

  }, [selectedStatementIds]);

  useEffect(() => {
    const focusAreaStatementCategoryIds = new Set<string>(derivedFocusAreas.map(area => area.statementCategoryId));
    const solutions = KNOWLEDGE_SOLUTIONS.filter(solution => focusAreaStatementCategoryIds.has(solution.workArenaStatementCategoryId));
    setDerivedKnowledgeSolutions(solutions);
  }, [derivedFocusAreas]);

  useEffect(() => {
    if (shareFeedback) {
      const timer = setTimeout(() => {
        setShareFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shareFeedback]);

  const handleShare = async () => {
    setShareFeedback(null); 
    const shareData = {
      title: APP_TITLE,
      text: `הנני משתף/ת איתך את הכלי: ${APP_TITLE} - ${APP_SUBTITLE}. כתובת: ${window.location.href}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Success feedback is often handled by the native share UI itself, 
        // but we can add our own if desired or for consistency.
        // setShareFeedback({ message: 'האפליקציה שותפה!', type: 'success' });
      } catch (error) {
        // Don't show error if user cancelled share dialog (AbortError)
        if (error.name !== 'AbortError') {
          console.error('שגיאה בפעולת השיתוף:', error);
          setShareFeedback({ message: 'פעולת השיתוף נכשלה או בוטלה.', type: 'error' });
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback({ message: 'קישור הועתק ללוח!', type: 'success' });
      } catch (err) {
        console.error('שגיאה בהעתקת קישור:', err);
        setShareFeedback({ message: 'לא ניתן היה להעתיק את הקישור.', type: 'error' });
      }
    }
  };
  
  const rainbowBanner = (
    <div className="h-2 w-full flex">
      <div className="flex-1 bg-red-500"></div>
      <div className="flex-1 bg-orange-500"></div>
      <div className="flex-1 bg-yellow-400"></div>
      <div className="flex-1 bg-green-500"></div>
      <div className="flex-1 bg-blue-500"></div>
      <div className="flex-1 bg-indigo-500"></div>
      <div className="flex-1 bg-purple-500"></div>
    </div>
  );


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <header className="bg-white shadow-md sticky top-0 z-50">
        {rainbowBanner}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-sky-700">{APP_TITLE}</h1>
            <p className="text-sm text-slate-600">{APP_SUBTITLE}</p>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <button 
                onClick={handleShare} 
                title="שיתוף האפליקציה" 
                aria-label="שיתוף האפליקציה"
                className="p-2 rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-700">
                  {/* Standard Share Icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zM12 5.25a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zM16.783 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zM7.217 10.907l4.783-2.907m0 0V5.25m0 2.25v2.25m4.783 2.907l-4.783-2.907m0 0l4.783 2.907M7.217 10.907L12 12.75l4.783 1.843m-4.783-1.843L7.217 10.907M12 12.75v2.25m0 0l4.783 1.843m-4.783-1.843L7.217 15M12 15l4.783-1.843" />
                </svg>
              </button>
              {shareFeedback && (
                <div 
                  className={`absolute top-full right-0 mt-2 p-2 text-xs text-white rounded shadow-lg w-max
                              ${shareFeedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`} 
                  role="status"
                >
                  {shareFeedback.message}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
             <img src="https://raw.githubusercontent.com/MoeGovIL/gems-design-system-brand/main/logo/png/color.png" alt="לראות את כל הקשת לוגו" className="h-16 w-auto opacity-80" />
            </div>
          </div>

        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <section id="statements" aria-labelledby="statements-title" className="mb-12">
          <h2 id="statements-title" className="text-2xl font-semibold text-sky-600 mb-2">{SECTIONS_TITLES.statements}</h2>
          <p className="text-slate-600 mb-6">בחר/י את ההיגדים המשקפים אתגרים או תחומים לחיזוק בבית הספר שלך. הבחירות שלך יסייעו בזיהוי זירות פעולה ופתרונות מתאימים.</p>
          <StatementSelector 
            categories={STATEMENT_CATEGORIES}
            selectedStatementIds={selectedStatementIds}
            onStatementToggle={handleStatementToggle}
          />
        </section>

        {selectedStatementIds.size > 0 && (
          <>
            <section id="focus-areas" aria-labelledby="focus-areas-title" className="mb-12">
              <h2 id="focus-areas-title" className="text-2xl font-semibold text-indigo-600 mb-6">{SECTIONS_TITLES.focusAreas}</h2>
              <FocusAreaDisplay focusAreas={derivedFocusAreas} />
            </section>

            {derivedFocusAreas.length > 0 && (
               <section id="solutions" aria-labelledby="solutions-title" className="mb-12">
                <h2 id="solutions-title" className="text-2xl font-semibold text-emerald-600 mb-6">{SECTIONS_TITLES.solutions}</h2>
                <KnowledgeSolutionDisplay solutions={derivedKnowledgeSolutions} />
              </section>
            )}

            {derivedFocusAreas.length > 0 && (
              <section id="gemini-playground" aria-labelledby="gemini-playground-title" className="mb-12">
                <h2 id="gemini-playground-title" className="text-2xl font-semibold text-purple-600 mb-6">{SECTIONS_TITLES.geminiPlayground}</h2>
                 <Card className="bg-purple-50" borderColor="border-purple-500">
                    <GeminiPlayground selectedFocusAreas={derivedFocusAreas} />
                 </Card>
              </section>
            )}
          </>
        )}

        {selectedStatementIds.size === 0 && (
          <Card className="mt-12 text-center py-10" borderColor="border-slate-300">
            <p className="text-lg text-slate-500">אנא בחר/י היגדים בשלב 1 כדי להתחיל בתהליך.</p>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mt-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8m0 0L3 4m4 4l4-4m-4 4H3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 16h10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16V8m0 0l4-4m-4 4l-4-4m4 4h4" />
             </svg>
          </Card>
        )}
      </main>
      
      <footer className="bg-slate-800 text-slate-300 py-6 text-center mt-auto">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} {APP_TITLE}. פותח בהשראת מסמכי משרד החינוך.</p>
          <p className="text-xs mt-1">יישום זה הינו כלי עזר ואינו מהווה תחליף לייעוץ פדגוגי מקצועי.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
