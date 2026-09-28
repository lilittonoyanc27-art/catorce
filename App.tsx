import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  HelpCircle,
  Table as TableIcon,
  FileText,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  Shuffle,
  Info,
  Check,
  X
} from 'lucide-react';
import {
  TOPIC_INFO,
  FULL_TEXT_ITEMS,
  CONCEPTS,
  MEMORY_TABLE,
  QA_ITEMS,
  SHORT_TEXT_ITEMS,
  VOCABULARY_FLASHCARDS,
  QAItem,
  ConceptItem,
  FullTextItem
} from './data';

type TabType = 'fulltext' | 'concepts' | 'table' | 'qa' | 'shorttext' | 'flashcards' | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('fulltext');
  const [searchQuery, setSearchQuery] = useState('');
  // Set of item IDs that have their translation revealed
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Learned items tracking
  const [learnedIds, setLearnedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('palabras_learned');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('palabras_learned', JSON.stringify(learnedIds));
    } catch {
      // ignore
    }
  }, [learnedIds]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
    }
  }, []);

  const toggleLearned = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLearnedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isRevealed = (id: string) => {
    return showAllTranslations || !!revealedIds[id];
  };

  const handleRevealAll = () => {
    setShowAllTranslations(true);
  };

  const handleHideAll = () => {
    setShowAllTranslations(false);
    setRevealedIds({});
  };

  // Text to speech for Spanish
  const speakSpanish = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setSpeakingId(id);

    const cleanText = text
      .replace(/🇪🇸|🇦🇲|“|”|«|»/g, '')
      .replace(/→/g, 'es')
      .replace(/—/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = speechRate;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Filtered QA
  const filteredQA = useMemo(() => {
    if (!searchQuery.trim()) return QA_ITEMS;
    const q = searchQuery.toLowerCase();
    return QA_ITEMS.filter(
      (item) =>
        item.questionEs.toLowerCase().includes(q) ||
        item.questionHy.toLowerCase().includes(q) ||
        item.answerEs.toLowerCase().includes(q) ||
        item.answerHy.toLowerCase().includes(q) ||
        item.number.toString().includes(q)
    );
  }, [searchQuery]);

  // Filtered Concepts
  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return CONCEPTS;
    const q = searchQuery.toLowerCase();
    return CONCEPTS.filter(
      (c) =>
        c.titleEs.toLowerCase().includes(q) ||
        c.titleHy.toLowerCase().includes(q) ||
        c.descriptionEs.toLowerCase().includes(q) ||
        c.descriptionHy.toLowerCase().includes(q) ||
        c.exampleEs.toLowerCase().includes(q) ||
        c.exampleHy.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Quiz questions generation from QA and concepts
  const quizQuestions = useMemo(() => {
    return QA_ITEMS.map((qa, index) => {
      // Create 3 distractors
      const otherAnswers = QA_ITEMS.filter((_, i) => i !== index).map((o) => o.answerEs);
      // shuffle and take 3
      const shuffledOthers = [...otherAnswers].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [...shuffledOthers, qa.answerEs].sort(() => 0.5 - Math.random());

      return {
        id: `quiz-${qa.number}`,
        questionEs: qa.questionEs,
        questionHy: qa.questionHy,
        correctAnswer: qa.answerEs,
        correctHy: qa.answerHy,
        options,
        category: qa.category
      };
    });
  }, []);

  const currentQuiz = quizQuestions[quizIndex];

  const handleSelectQuizOption = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    setIsAnswerSubmitted(true);
    setAnsweredCount((c) => c + 1);
    if (option === currentQuiz.correctAnswer) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizIndex(0);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-amber-100 selection:text-amber-900 pb-16">
      {/* Top Banner / Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              7
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  ES ⇄ HY
                </span>
                <span className="text-xs text-slate-500">Իսպաներեն / Հայերեն</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                TEMA 7: Palabras y Significados <span className="text-slate-400 font-normal">|</span> Բառեր և Իմաստներ
              </h1>
            </div>
          </div>

          {/* Quick controls: reveal all & speech settings */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              onClick={showAllTranslations ? handleHideAll : handleRevealAll}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                showAllTranslations
                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
              title="Սեղմեք բոլոր թարգմանությունները միանգամից ցուցադրելու կամ թաքցնելու համար"
            >
              {showAllTranslations ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Թաքցնել թարգմանությունը</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Ցույց տալ բոլորը</span>
                </>
              )}
            </button>

            {hasSpeechSupport && (
              <button
                onClick={() => setSpeechRate((r) => (r === 0.9 ? 0.75 : r === 0.75 ? 1.0 : 0.9))}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
                title="Աուդիո արագություն"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{speechRate}x</span>
              </button>
            )}

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Որոնել բառ կամ թեմա..."
                className="w-36 sm:w-48 pl-7 pr-6 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 absolute left-2 top-2.5 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 mt-1">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('fulltext')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'fulltext'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Լիարժեք տեքստ (Texto completo)</span>
            </button>

            <button
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'concepts'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>8 Հասկացություն (8 Conceptos)</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'table'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Աղյուսակ (Tabla)</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'qa'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="flex items-center gap-1.5">
                <span>16 Հարց ու պատասխան</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-900">
                  16
                </span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('shorttext')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'shorttext'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Կարճ տեքստ (Texto corto)</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Քարտեր (Flashcards)</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ինտերակտիվ թեստ (Quiz)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Helper Hint Bar */}
        <div className="mb-6 p-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs md:text-sm text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500 text-white">
              <Info className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold">Ինտերակտիվ մեթոդ․</span> Սեղմեք ցանկացած{' '}
              <span className="font-semibold text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-2">
                իսպաներեն նախադասության
              </span>{' '}
              կամ բառի վրա՝ հայերեն թարգմանությունը բացելու համար։ Սեղմեք 🔊 լսելու համար։
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Յուրացված՝ {Object.values(learnedIds).filter(Boolean).length} բաժին</span>
          </div>
        </div>

        {/* TAB 1: FULL TEXT (Լիարժեք տեքստ) */}
        {activeTab === 'fulltext' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Texto completo / Լիարժեք տեքստ
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Կարդացեք իսպաներեն նախադասությունները։ Սեղմեք նախադասության վրա՝ բացելու հայերեն թարգմանությունը։
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Կարգավիճակ․</span>
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    {FULL_TEXT_ITEMS.length} նախադասություն
                  </span>
                </div>
              </div>

              {/* Sentences List */}
              <div className="space-y-3">
                {FULL_TEXT_ITEMS.map((item, idx) => {
                  const revealed = isRevealed(item.id);
                  const learned = !!learnedIds[item.id];
                  const isSpeaking = speakingId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleReveal(item.id)}
                      className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                        revealed
                          ? 'bg-amber-50/40 border-amber-200 ring-1 ring-amber-200/50 shadow-xs'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-800 flex items-center justify-center text-xs font-semibold mt-0.5 transition-colors">
                            {idx + 1}
                          </span>

                          <div className="flex-1 space-y-2">
                            {/* Spanish Original */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-semibold text-slate-900 leading-snug group-hover:text-amber-900 transition-colors">
                                {item.es}
                              </span>
                            </div>

                            {/* Armenian Translation */}
                            {revealed ? (
                              <div className="pt-2 border-t border-amber-200/70 text-slate-700 text-sm font-medium flex items-start gap-2 animate-fadeIn">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold flex-shrink-0">
                                  🇦🇲 ՀԱՅ
                                </span>
                                <span className="leading-relaxed text-slate-800">{item.hy}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-amber-600/80 font-medium pt-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Սեղմեք թարգմանությունը տեսնելու համար</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="flex items-center gap-1.5 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => speakSpanish(item.es, item.id, e)}
                            className={`p-2 rounded-lg border transition-all ${
                              isSpeaking
                                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300'
                            }`}
                            title="Լսել իսպաներեն արտասանությունը"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => toggleLearned(item.id, e)}
                            className={`p-2 rounded-lg border transition-all ${
                              learned
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
                            }`}
                            title={learned ? 'Նշված է որպես յուրացված' : 'Նշել որպես յուրացված'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 8 CONCEPTS (8 Հասկացություններ) */}
        {activeTab === 'concepts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  8 Conceptos Fundamentales / 8 Հիմնական Հասկացություն
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  Սեղմեք յուրաքանչյուր քարտի վրա՝ կանոնը և օրինակը հայերեն տեսնելու համար։
                </p>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                8-ից 8 թեմաները մանրամասն օրինակներով
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConcepts.map((c) => {
                const id = `concept-${c.number}`;
                const revealed = isRevealed(id);
                const learned = !!learnedIds[id];
                const isSpeaking = speakingId === id;

                return (
                  <div
                    key={c.number}
                    onClick={() => toggleReveal(id)}
                    className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      revealed
                        ? 'bg-amber-50/50 border-amber-300 shadow-sm ring-1 ring-amber-200/50'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Header of Concept */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                            {c.number}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900">{c.titleEs}</h3>
                              {c.badge && (
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                  {c.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-amber-700">
                              {c.titleHy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) =>
                              speakSpanish(
                                `${c.titleEs}. ${c.descriptionEs}. ${c.exampleEs}`,
                                id,
                                e
                              )
                            }
                            className={`p-2 rounded-lg border transition-all ${
                              isSpeaking
                                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300'
                            }`}
                            title="Լսել բացատրությունն ու օրինակը"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => toggleLearned(id, e)}
                            className={`p-2 rounded-lg border transition-all ${
                              learned
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
                            }`}
                            title="Յուրացված"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="py-3 space-y-3">
                        {/* Definition in ES */}
                        <div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                            Definición (Իսպաներեն)
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                            🇪🇸 {c.descriptionEs}
                          </p>
                        </div>

                        {/* Examples in ES */}
                        <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/60 font-mono text-xs">
                          <div className="text-[11px] font-sans font-bold text-slate-600 uppercase mb-1">
                            Ejemplo:
                          </div>
                          <div className="text-slate-900 whitespace-pre-line leading-relaxed font-sans text-sm">
                            {c.exampleEs}
                          </div>
                        </div>

                        {/* Armenian translation (revealed or hint) */}
                        {revealed ? (
                          <div className="pt-3 border-t border-amber-200/80 space-y-2 animate-fadeIn">
                            <div>
                              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-0.5">
                                Սահմանում (Հայերեն)
                              </div>
                              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                🇦🇲 {c.descriptionHy}
                              </p>
                            </div>
                            <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/70 text-xs">
                              <span className="font-bold text-amber-900 block mb-0.5">
                                Օրինակ հայերեն՝
                              </span>
                              <div className="text-slate-800 whitespace-pre-line font-medium">
                                {c.exampleHy}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium pt-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Սեղմեք հայերեն թարգմանությունն ու բացատրությունը տեսնելու համար</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MEMORY TABLE (Աղյուսակ՝ հիշելու համար) */}
        {activeTab === 'table' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    Tabla para memorizar / Աղյուսակ՝ հիշելու համար
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Արագ կրկնեք բոլոր 8 հասկացությունները։ Սեղմեք իսպաներեն բառի կամ տողի վրա՝ հայերենը բացելու համար։
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                    8 Հասկացություն
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-lg">Concepto (Հասկացություն)</th>
                      <th className="py-3 px-4">Significado (Իսպաներեն)</th>
                      <th className="py-3 px-4 rounded-r-lg">Հայերեն (Թարգմանություն)</th>
                      <th className="py-3 px-2 text-right">Աուդիո</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {MEMORY_TABLE.map((row) => {
                      const revealed = isRevealed(row.id);
                      const isSpeaking = speakingId === row.id;

                      return (
                        <tr
                          key={row.id}
                          onClick={() => toggleReveal(row.id)}
                          className={`cursor-pointer transition-colors ${
                            revealed ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{row.concept}</span>
                              <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                {row.conceptHy}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {row.significadoEs}
                          </td>
                          <td className="py-3.5 px-4">
                            {revealed ? (
                              <span className="font-semibold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-amber-200 inline-block shadow-2xs">
                                {row.significadoHy}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-medium">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Սեղմեք բացելու համար</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) =>
                                speakSpanish(
                                  `${row.concept}. ${row.significadoEs}`,
                                  row.id,
                                  e
                                )
                              }
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSpeaking
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white text-slate-400 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                              }`}
                              title="Լսել"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 16 QA (16 Հարց ու պատասխան) */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    Preguntas y respuestas / Հարցեր և պատասխաններ
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Բոլոր 16 պաշտոնական հարցերն ու պատասխանները։ Սեղմեք հարցի կամ պատասխանի վրա՝ հայերեն տարբերակը տեսնելու համար։
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                    Ընդհանուր 16 հարց
                  </span>
                </div>
              </div>

              {/* Questions Accordion / List */}
              <div className="space-y-3.5">
                {filteredQA.map((qa) => {
                  const id = `qa-${qa.number}`;
                  const revealed = isRevealed(id);
                  const learned = !!learnedIds[id];
                  const isSpeaking = speakingId === id;

                  return (
                    <div
                      key={qa.number}
                      onClick={() => toggleReveal(id)}
                      className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                        revealed
                          ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200/60 shadow-xs'
                          : 'bg-white hover:bg-slate-50/90 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold mt-0.5">
                            {qa.number}
                          </span>

                          <div className="space-y-2 flex-1">
                            {/* Spanish Question */}
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-base">
                                🇪🇸 {qa.questionEs}
                              </span>
                              {qa.category && (
                                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {qa.category}
                                </span>
                              )}
                            </div>

                            {/* Spanish Answer */}
                            <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-800">
                              🇪🇸 <span className="text-amber-900">{qa.answerEs}</span>
                            </div>

                            {/* Armenian Reveal Area */}
                            {revealed ? (
                              <div className="pt-2 border-t border-amber-200/70 space-y-2 animate-fadeIn">
                                <div className="text-sm font-semibold text-slate-800">
                                  🇦🇲 <span className="text-slate-900">{qa.questionHy}</span>
                                </div>
                                <div className="bg-amber-100/70 p-2.5 rounded-lg border border-amber-200 text-sm font-bold text-amber-950">
                                  🇦🇲 {qa.answerHy}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium pt-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Սեղմեք հայերեն հարցն ու պատասխանը բացելու համար</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Audio & Learned buttons */}
                        <div
                          className="flex items-center gap-1.5 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) =>
                              speakSpanish(
                                `${qa.questionEs} ${qa.answerEs}`,
                                id,
                                e
                              )
                            }
                            className={`p-2 rounded-lg border transition-all ${
                              isSpeaking
                                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300'
                            }`}
                            title="Լսել հարցն ու պատասխանը իսպաներեն"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => toggleLearned(id, e)}
                            className={`p-2 rounded-lg border transition-all ${
                              learned
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
                            }`}
                            title="Յուրացված"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SHORT TEXT (Կարճ տեքստ) */}
        {activeTab === 'shorttext' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    Texto corto / Կարճ տեքստ
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Հակիրճ տեքստ ամփոփման համար։ Սեղմեք պարբերության վրա՝ հայերեն թարգմանությունը բացելու համար։
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                    Ամփոփում
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {SHORT_TEXT_ITEMS.map((item, idx) => {
                  const revealed = isRevealed(item.id);
                  const isSpeaking = speakingId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleReveal(item.id)}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        revealed
                          ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                              🇪🇸 {item.es}
                            </div>
                          </div>

                          {revealed ? (
                            <div className="pt-3 border-t border-amber-200/80 pl-8 space-y-1 animate-fadeIn">
                              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                                🇦🇲 Հայերեն թարգմանություն՝
                              </span>
                              <p className="text-sm md:text-base text-slate-800 font-medium leading-relaxed">
                                {item.hy}
                              </p>
                            </div>
                          ) : (
                            <div className="pl-8 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Սեղմեք հայերեն տարբերակը տեսնելու համար</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => speakSpanish(item.es, item.id, e)}
                            className={`p-2 rounded-lg border transition-all ${
                              isSpeaking
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-100 hover:text-amber-800'
                            }`}
                            title="Լսել իսպաներեն"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FLASHCARDS (Քարտեր) */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Ինտերակտիվ Քարտեր (Flashcards)
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Ստուգեք ձեր գիտելիքները։ Սեղմեք քարտի վրա՝ այն շրջելու և հայերեն թարգմանությունը տեսնելու համար։
              </p>
            </div>

            {/* The Flashcard */}
            {(() => {
              const currentCard = VOCABULARY_FLASHCARDS[cardIndex];
              const isSpeaking = speakingId === `card-${cardIndex}`;

              return (
                <div className="space-y-4">
                  <div
                    onClick={() => setCardFlipped(!cardFlipped)}
                    className="relative min-h-[260px] md:min-h-[300px] rounded-3xl bg-white border-2 border-amber-200/80 p-8 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between items-center text-center group"
                  >
                    {/* Top card info */}
                    <div className="w-full flex items-center justify-between text-xs text-slate-400">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                        {currentCard.tag}
                      </span>
                      <span>
                        Քարտ {cardIndex + 1} / {VOCABULARY_FLASHCARDS.length}
                      </span>
                    </div>

                    {/* Middle Card Content */}
                    <div className="my-auto py-4 space-y-3">
                      {!cardFlipped ? (
                        <div className="space-y-2 animate-fadeIn">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                            🇪🇸 Español (Իսպաներեն)
                          </span>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                            {currentCard.es}
                          </h3>
                          <div className="text-xs text-amber-600 font-medium pt-2">
                            🔄 Սեղմեք քարտը շրջելու համար
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 animate-fadeIn">
                          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block">
                            🇦🇲 Հայերեն թարգմանություն
                          </span>
                          <h3 className="text-2xl md:text-3xl font-black text-amber-900 leading-tight">
                            {currentCard.hy}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-600 font-medium pt-2 max-w-md">
                            {currentCard.detail}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom audio trigger */}
                    <div className="w-full flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => speakSpanish(currentCard.es, `card-${cardIndex}`, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                          isSpeaking
                            ? 'bg-amber-500 text-white border-amber-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-100 hover:text-amber-800'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Լսել արտասանությունը</span>
                      </button>

                      <span className="text-slate-400 text-xs">
                        {cardFlipped ? 'Ցուցադրված է հայերենը' : 'Ցուցադրված է իսպաներենը'}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        setCardFlipped(false);
                        setCardIndex((prev) => (prev > 0 ? prev - 1 : VOCABULARY_FLASHCARDS.length - 1));
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm shadow-2xs"
                    >
                      ← Նախորդը
                    </button>

                    <button
                      onClick={() => {
                        setCardFlipped(false);
                        const rand = Math.floor(Math.random() * VOCABULARY_FLASHCARDS.length);
                        setCardIndex(rand);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 font-bold text-amber-900 hover:bg-amber-100 transition-all text-sm shadow-2xs"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Խառնել</span>
                    </button>

                    <button
                      onClick={() => {
                        setCardFlipped(false);
                        setCardIndex((prev) => (prev < VOCABULARY_FLASHCARDS.length - 1 ? prev + 1 : 0));
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all text-sm shadow-xs"
                    >
                      Հաջորդը →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 7: QUIZ (Ինտերակտիվ թեստ) */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              {/* Quiz Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    Հարց {quizIndex + 1} / {quizQuestions.length}
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mt-2">
                    Գիտելիքների Ստուգում
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Միավորներ</div>
                  <div className="text-xl font-black text-amber-600">
                    {quizScore} / {answeredCount}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                      🇪🇸 {currentQuiz.questionEs}
                    </div>
                    <div className="text-sm font-semibold text-amber-800">
                      🇦🇲 {currentQuiz.questionHy}
                    </div>
                  </div>
                  <button
                    onClick={() => speakSpanish(currentQuiz.questionEs, `quiz-q-${quizIndex}`)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800 flex-shrink-0"
                    title="Լսել հարցը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuiz.options.map((opt, i) => {
                  const isCorrect = opt === currentQuiz.correctAnswer;
                  const isChosen = selectedOption === opt;

                  let buttonStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      buttonStyle = 'bg-rose-100 border-rose-300 text-rose-950 font-bold';
                    } else {
                      buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectQuizOption(opt)}
                      className={`w-full p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between text-sm md:text-base ${buttonStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <Check className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                      )}
                      {isAnswerSubmitted && isChosen && !isCorrect && (
                        <X className="w-5 h-5 text-rose-700 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback after answer */}
              {isAnswerSubmitted && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-950">
                      {selectedOption === currentQuiz.correctAnswer ? '🎉 Ճիշտ է!' : '❌ Սխալ պատասխան'}
                    </span>
                    <button
                      onClick={() => speakSpanish(currentQuiz.correctAnswer, `quiz-ans-${quizIndex}`)}
                      className="text-xs flex items-center gap-1 text-amber-800 font-semibold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Լսել ճիշտ պատասխանը
                    </button>
                  </div>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Ճիշտ պատասխան՝ </span>
                    {currentQuiz.correctAnswer} (🇦🇲 {currentQuiz.correctHy})
                  </p>
                </div>
              )}

              {/* Next Question / Reset */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Սկսել նորից</span>
                </button>

                {isAnswerSubmitted ? (
                  <button
                    onClick={handleNextQuiz}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all text-sm shadow-xs"
                  >
                    <span>{quizIndex < quizQuestions.length - 1 ? 'Հաջորդ հարցը' : 'Ավարտել'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Ընտրեք պատասխանը վերևում</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Help */}
      <footer className="max-w-6xl mx-auto px-4 mt-12 text-center text-xs text-slate-400">
        <p>
          TEMA 7: Palabras y Significados • ԹԵՄԱ 7․ ԲԱՌԵՐ ԵՎ ԻՄԱՍՏՆԵՐ • Իսպաներեն-Հայերեն Ուսումնական Հավելված
        </p>
      </footer>
    </div>
  );
}
