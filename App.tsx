
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { TarotReading, ReadingCard, TarotCard, DrawerType, Language, Suite } from './types';
import { TAROT_DECK, DRAWER_OPTIONS, UI_TEXT, TAROT_SUITES } from './constants';
import { analyzeReading } from './services/geminiService';
import { TarotCardUI } from './components/TarotCardUI';
import { StorageManager } from './utils/StorageManager';
import { FileService } from './utils/FileService';
import { importReadingFromHTML, importReadingFromJSON } from './utils/ImportHelper';
import { exportReadingToHTML, exportReadingToJSON } from './utils/ExportHelper';

// --- Shared Components ---

const Navbar = ({ language, setLanguage }: { language: Language, setLanguage: (l: Language) => void }) => {
  const text = UI_TEXT[language];
  return (
    <nav className="glass sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center no-print">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-900 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
          <i className="fa-solid fa-moon text-lg"></i>
        </div>
        <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest bg-gradient-to-r from-amber-200 to-stone-400 bg-clip-text text-transparent">
          ARCANUM
        </span>
      </Link>
      <div className="flex gap-2 sm:gap-4 items-center font-cinzel text-[10px] sm:text-sm">
        <Link 
          to="/" 
          className="text-stone-400 hover:text-amber-200 transition-colors flex items-center gap-2 px-2 py-1"
          title={language === 'zh' ? '回到首頁' : 'Home'}
        >
          <i className="fa-solid fa-house"></i>
          <span className="hidden md:inline">{language === 'zh' ? '首頁' : 'Home'}</span>
        </Link>
        <button 
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="text-stone-500 hover:text-amber-200 transition-colors border border-stone-800 px-2 sm:px-3 py-1 rounded-md font-bold"
        >
          {language === 'en' ? '繁體' : 'EN'}
        </button>
        <Link to="/" className="text-stone-300 hover:text-amber-200 transition-colors hidden sm:block">{text.history}</Link>
        <Link to="/new" className="bg-amber-700 hover:bg-amber-600 text-stone-100 px-3 sm:px-4 py-2 rounded-full font-bold transition-all shadow-lg uppercase">
          {text.newReading}
        </Link>
      </div>
    </nav>
  );
};

const AnalysisRenderer: React.FC<{ text: string }> = ({ text }) => {
  const sections = text.split('# ').filter(s => s.trim() !== '');
  const parseLine = (line: string) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <span key={i} className="text-amber-400 font-bold tracking-wide mx-0.5">{part}</span> : part
    );
  };
  return (
    <div className="space-y-10">
      {sections.map((section, sIdx) => {
        const lines = section.split('\n');
        const title = lines[0].replace(/[\[\]]/g, '').trim();
        return (
          <div key={sIdx} className="relative group">
            <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="font-cinzel text-xs sm:text-sm text-amber-100 font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
               <span className="text-amber-600/40 font-inter text-xs">0{sIdx + 1}</span>
               {title}
               <span className="flex-grow h-[1px] bg-stone-800/50"></span>
            </h3>
            <div className="space-y-4">
              {lines.slice(1).map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                  return (
                    <div key={lIdx} className="flex gap-4 pl-4 items-start">
                      <span className="text-amber-900/40 mt-1.5"><i className="fa-solid fa-sparkles text-[8px]"></i></span>
                      <p className="text-stone-300 text-sm leading-relaxed flex-grow">{parseLine(trimmed.substring(1).trim())}</p>
                    </div>
                  );
                }
                return <p key={lIdx} className="text-stone-400 text-sm leading-relaxed pl-4">{parseLine(trimmed)}</p>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Fisher-Yates Shuffle ---
const shuffleDeck = (array: TarotCard[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Views ---

const HistoryView: React.FC<{ 
  readings: TarotReading[], 
  language: Language,
  onUpdate: () => void,
  onImport: (r: TarotReading | TarotReading[]) => void
}> = ({ readings, language, onUpdate, onImport }) => {
  const text = UI_TEXT[language];
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(text.deleteConfirm)) {
      selectedIds.forEach(id => StorageManager.deleteReading(id));
      setSelectedIds(new Set());
      setIsBatchMode(false);
      onUpdate();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reading = await importReadingFromHTML(file);
        StorageManager.saveReading(reading);
        onUpdate();
        alert(language === 'zh' ? '匯入成功' : 'Import successful');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Import failed');
      }
    }
    e.target.value = '';
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await importReadingFromJSON(file);
        if (Array.isArray(data)) {
          data.forEach(r => StorageManager.saveReading(r));
        } else {
          StorageManager.saveReading(data);
        }
        onUpdate();
        alert(language === 'zh' ? 'JSON 匯入成功' : 'JSON Import successful');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Import failed');
      }
    }
    e.target.value = '';
  };

  return (
    <div className="p-4 sm:p-12 max-w-7xl mx-auto">
      <header className="mb-12 border-b border-stone-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-100 mb-2 uppercase tracking-widest">{text.history}</h1>
          <p className="text-stone-500 text-sm italic">Tracking the flow of destiny through the Arcanum chronicles.</p>
        </div>
        <div className="flex flex-wrap gap-4 no-print">
          <button 
            onClick={() => { setIsBatchMode(!isBatchMode); setSelectedIds(new Set()); }}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 border rounded-lg glass ${isBatchMode ? 'bg-amber-900/40 border-amber-500 text-white' : 'text-stone-400 hover:text-amber-500 border-stone-800'}`}
          >
            <i className="fa-solid fa-list-check mr-2"></i> {isBatchMode ? (language === 'zh' ? '取消' : 'Cancel') : text.editMode}
          </button>
          
          <button 
            onClick={() => exportReadingToJSON(readings, `Arcanum_Full_Export_${Date.now()}.json`)}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-all px-4 py-2 border border-stone-800 rounded-lg glass"
          >
            <i className="fa-solid fa-file-export mr-2"></i> {text.exportAllJSON}
          </button>

          <button 
            onClick={() => jsonInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-all px-4 py-2 border border-stone-800 rounded-lg glass"
          >
            <i className="fa-solid fa-file-import mr-2"></i> {text.importJSON}
          </button>
          <input type="file" ref={jsonInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-all px-4 py-2 border border-stone-800 rounded-lg glass"
          >
            <i className="fa-solid fa-file-import mr-2"></i> HTML
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".html" className="hidden" />

          {isBatchMode && (
            <button 
              onClick={handleBatchDelete}
              disabled={selectedIds.size === 0}
              className="text-[10px] font-bold uppercase tracking-widest text-white bg-red-900 hover:bg-red-800 transition-all px-4 py-2 rounded-lg shadow-lg disabled:opacity-30"
            >
              <i className="fa-solid fa-trash-can mr-2"></i> {text.confirmMultiDelete} ({selectedIds.size})
            </button>
          )}
        </div>
      </header>
      
      {readings.length === 0 ? (
        <div className="text-center py-24 glass rounded-3xl border border-stone-900">
          <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-700">
            <i className="fa-solid fa-book-open text-2xl"></i>
          </div>
          <p className="text-stone-500 font-cinzel tracking-widest uppercase mb-8">{text.noReadings}</p>
          <Link to="/new" className="inline-block bg-amber-700 hover:bg-amber-600 text-stone-100 px-8 py-3 rounded-full font-bold transition-all shadow-xl uppercase tracking-widest">
            {text.recordFirst}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {readings.sort((a,b) => b.timestamp - a.timestamp).map(reading => (
            <div 
              key={reading.id} 
              onClick={() => isBatchMode ? toggleSelect(reading.id) : navigate(`/reading/${reading.id}`)}
              className={`relative glass group cursor-pointer border transition-all duration-300 rounded-2xl p-6 ${isBatchMode ? (selectedIds.has(reading.id) ? 'border-amber-500 bg-amber-950/20' : 'border-stone-800') : 'border-stone-800 hover:border-amber-900/50 hover:shadow-2xl hover:shadow-amber-900/10'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-cinzel">
                  {new Date(reading.timestamp).toLocaleDateString()}
                </span>
                {isBatchMode && (
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedIds.has(reading.id) ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-700'}`}>
                    {selectedIds.has(reading.id) && <i className="fa-solid fa-check text-[10px]"></i>}
                  </div>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-playfair italic text-amber-100 line-clamp-2 mb-4">"{reading.query}"</h3>
              <div className="flex -space-x-3 overflow-hidden mb-6">
                {reading.cards.map((rc, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-stone-950 overflow-hidden bg-stone-900">
                    <img src={rc.card.image} alt={rc.card.nameEn} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale opacity-50" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-900/50">
                <span className="text-[10px] text-stone-600 uppercase tracking-widest">{reading.drawer === 'self' ? (language === 'zh' ? '本人' : 'Self') : (language === 'zh' ? '代抽' : 'Behalf')}</span>
                <span className="text-amber-500/60 group-hover:text-amber-500 transition-colors text-xs font-cinzel tracking-widest uppercase">View Details <i className="fa-solid fa-chevron-right ml-1"></i></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NewReadingView: React.FC<{ language: Language, onSave: (r: TarotReading) => void }> = ({ language, onSave }) => {
  const text = UI_TEXT[language];
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState<DrawerType>('self');
  const [userAnalysis, setUserAnalysis] = useState('');
  const [selectedCards, setSelectedCards] = useState<ReadingCard[]>([]);
  
  // Immersive Draw State
  const [isImmersiveDraw, setIsImmersiveDraw] = useState(false);
  const [shuffledPool, setShuffledPool] = useState<TarotCard[]>([]);
  const [pickedIndices, setPickedIndices] = useState<Set<number>>(new Set());

  // Manual Picker State
  const [showManualPicker, setShowManualPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSuiteTab, setActiveSuiteTab] = useState<Suite | 'All'>('All');

  const filteredDeck = useMemo(() => {
    return TAROT_DECK.filter(c => {
      const matchesSearch = c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.nameZh.includes(searchTerm);
      const matchesSuite = activeSuiteTab === 'All' || c.suite === activeSuiteTab;
      return matchesSearch && matchesSuite;
    });
  }, [searchTerm, activeSuiteTab]);

  const startImmersiveDraw = () => {
    setShuffledPool(shuffleDeck(TAROT_DECK));
    setPickedIndices(new Set());
    setIsImmersiveDraw(true);
  };

  const handlePickCard = (card: TarotCard, index: number) => {
    if (pickedIndices.has(index)) return;
    const nextIndices = new Set(pickedIndices);
    nextIndices.add(index);
    setPickedIndices(nextIndices);
    setSelectedCards([...selectedCards, { card, isReversed: false }]);
  };

  const addManualCard = (card: TarotCard) => {
    setSelectedCards([...selectedCards, { card, isReversed: false }]);
    setShowManualPicker(false);
    setSearchTerm('');
  };

  const removeCard = (idx: number) => {
    setSelectedCards(selectedCards.filter((_, i) => i !== idx));
  };

  const getAngle = (index: number) => {
    const startAngle = -45;
    const endAngle = 45;
    const total = 78;
    const step = (endAngle - startAngle) / (total - 1);
    return `${startAngle + index * step}deg`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || selectedCards.length === 0) return;
    const newReading: TarotReading = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      query,
      drawer,
      userAnalysis,
      cards: selectedCards,
      status: 'pending',
      language
    };
    onSave(newReading);
    navigate(`/reading/${newReading.id}`);
  };

  return (
    <div className="p-4 sm:p-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="text-stone-600 hover:text-amber-600 font-cinzel text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <i className="fa-solid fa-arrow-left"></i> {language === 'zh' ? '返回' : 'Back'}
        </button>
        <Link to="/" className="text-stone-600 hover:text-amber-600 font-cinzel text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <i className="fa-solid fa-house"></i> {language === 'zh' ? '首頁' : 'Home'}
        </Link>
      </div>

      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-amber-100 mb-2 uppercase tracking-widest">{text.newReading}</h1>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-widest">{text.inquiry}</label>
            <textarea value={query} onChange={e => setQuery(e.target.value)} className="w-full glass rounded-2xl p-6 text-stone-200 placeholder:text-stone-800 min-h-[120px] text-sm focus:ring-1 focus:ring-amber-900/50 outline-none" required />
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-widest">{text.spread}</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowManualPicker(true)} className="text-[10px] font-bold uppercase text-stone-400 hover:text-amber-500 flex items-center gap-2 transition-all">
                  <i className="fa-solid fa-hand-pointer"></i> {language === 'zh' ? '手動挑選' : 'Manual Pick'}
                </button>
                <button type="button" onClick={startImmersiveDraw} className="text-[10px] font-bold uppercase text-amber-600 hover:text-amber-400 flex items-center gap-2 transition-all hover:scale-105">
                  <i className="fa-solid fa-shuffle"></i> {text.shuffle}
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 sm:gap-6 min-h-[260px] p-6 rounded-3xl bg-stone-900/30 border border-dashed border-stone-800 items-center justify-center">
              {selectedCards.map((rc, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group pop-in">
                  <div className="relative">
                    <TarotCardUI readingCard={rc} language={language} small />
                    <div className="absolute -top-3 -left-3 w-7 h-7 bg-stone-950 border border-stone-800 text-amber-600 text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg z-20 font-cinzel">{idx + 1}</div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeCard(idx)}
                    className="text-[9px] uppercase font-bold text-stone-600 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800/50 hover:bg-red-950/20 glass"
                  >
                    <i className="fa-solid fa-trash-can"></i> {language === 'zh' ? '移除' : 'Remove'}
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setShowManualPicker(true)} className="w-24 h-40 sm:w-32 sm:h-56 border-2 border-dashed border-stone-800 rounded-xl flex flex-col items-center justify-center text-stone-800 hover:text-amber-900 transition-all gap-2 group bg-stone-950/20">
                <i className="fa-solid fa-plus text-2xl group-hover:scale-110"></i>
                <span className="text-[9px] uppercase font-bold">{language === 'zh' ? '新增牌卡' : 'Add Card'}</span>
              </button>
            </div>
          </section>

          <button type="submit" disabled={!query || selectedCards.length === 0} className="w-full bg-amber-800 hover:bg-amber-700 text-stone-100 font-cinzel font-bold py-5 rounded-2xl transition-all shadow-2xl disabled:opacity-30">
            {text.analyze}
          </button>
        </div>

        <div className="space-y-8">
            <section className="space-y-4">
              <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-widest">{text.reader}</label>
              <div className="grid grid-cols-2 gap-3">
                {DRAWER_OPTIONS[language].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setDrawer(opt.value as DrawerType)} className={`px-4 py-3 rounded-xl text-[10px] font-bold transition-all border uppercase ${drawer === opt.value ? 'bg-amber-900/20 border-amber-800 text-white' : 'bg-stone-950/50 border-stone-900 text-stone-600'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-widest">{text.userInterpretation}</label>
              <textarea value={userAnalysis} onChange={e => setUserAnalysis(e.target.value)} placeholder={text.userInterpretationPlaceholder} className="w-full glass rounded-2xl p-6 text-stone-300 min-h-[300px] text-sm focus:ring-1 focus:ring-stone-700 outline-none leading-relaxed" />
            </section>
        </div>
      </form>

      {/* Immersive Draw Overlay */}
      {isImmersiveDraw && (
        <div className="fixed inset-0 z-[100] bg-stone-950/98 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-500 p-4">
          <div className="absolute top-8 text-center z-50">
            <h2 className="font-cinzel text-2xl sm:text-3xl text-amber-100 mb-2 uppercase tracking-[0.4em]">{language === 'zh' ? '命運扇面' : 'The Fan of Fate'}</h2>
            <p className="text-stone-500 text-xs sm:text-sm italic tracking-widest px-6">{language === 'zh' ? '深呼吸，閉上眼。在扇面中感受指引，挑選出與你靈魂共鳴之牌。' : 'Breathe, close your eyes. Feel the guidance within the spread and pick the cards that resonate.'}</p>
          </div>
          
          <div className="fan-container scale-75 sm:scale-100">
            {shuffledPool.map((card, idx) => (
              <div 
                key={idx} 
                className={`fan-card ${pickedIndices.has(idx) ? 'picked' : ''}`}
                style={{ 
                    '--angle': getAngle(idx),
                    transform: `rotate(${getAngle(idx)})`,
                    zIndex: idx
                } as any}
                onClick={() => handlePickCard(card, idx)}
              >
                <div className="w-full h-full bg-[#1c1917] border border-amber-900/30 rounded-lg flex items-center justify-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-2 border border-amber-900/10 rounded-md"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(217,119,6,0.05)_0%,_transparent_70%)]"></div>
                  <i className="fa-solid fa-moon text-amber-900/20 text-3xl sm:text-4xl group-hover:scale-110 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-12 flex gap-4 no-print">
            <button 
                onClick={() => setIsImmersiveDraw(false)} 
                className="px-12 py-4 bg-amber-900/20 border border-amber-800/40 text-amber-100 font-cinzel rounded-full uppercase tracking-widest hover:bg-amber-800 transition-all shadow-xl backdrop-blur-md"
            >
                {language === 'zh' ? '確認選取' : 'Confirm Picks'}
            </button>
          </div>
        </div>
      )}

      {/* Manual Picker Modal */}
      {showManualPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl" onClick={() => setShowManualPicker(false)}></div>
          <div className="relative glass w-full max-w-3xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden border border-stone-800/50 shadow-2xl">
            <header className="p-4 sm:p-8 border-b border-stone-900 flex justify-between items-center bg-stone-900/30">
              <h3 className="font-cinzel text-xl sm:text-2xl text-amber-100 font-bold uppercase tracking-widest">{language === 'zh' ? '選擇阿爾克那' : 'Select Arcana'}</h3>
              <button onClick={() => setShowManualPicker(false)} className="text-stone-600 hover:text-white text-xl"><i className="fa-solid fa-xmark"></i></button>
            </header>
            <div className="px-4 sm:px-8 pt-4 sm:pt-8 space-y-4 sm:space-y-6">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-600"></i>
                <input 
                  autoFocus 
                  type="text" 
                  placeholder={text.searchPlaceholder} 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full bg-stone-900/50 rounded-xl py-3 sm:py-4 pl-12 pr-6 border border-stone-800 outline-none text-stone-200 focus:border-amber-900/30" 
                />
              </div>
              <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar scroll-smooth">
                {TAROT_SUITES.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setActiveSuiteTab(s)} 
                    className={`px-4 py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeSuiteTab === s ? 'bg-amber-800 border-amber-700 text-white' : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-amber-500 hover:border-amber-900/40'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 sm:p-8 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950/20">
              {filteredDeck.map(card => (
                <div key={card.id} className="glass group p-3 sm:p-4 rounded-2xl flex gap-4 items-center border border-stone-900 hover:border-amber-900/20 transition-all">
                  <div className="w-12 h-20 sm:w-14 sm:h-24 rounded border border-stone-950 overflow-hidden shrink-0 shadow-lg bg-[#0a0a0a] flex items-center justify-center">
                    <img src={card.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-stone-200 font-bold font-playfair italic leading-tight text-sm sm:text-base truncate">{language === 'zh' ? card.nameZh : card.nameEn}</div>
                    <div className="text-[9px] text-stone-600 uppercase tracking-widest mt-1">{card.suite}</div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => addManualCard(card)} className="px-3 py-1.5 rounded-lg bg-amber-900/10 text-[9px] text-amber-200 font-bold uppercase hover:bg-amber-800 hover:text-white transition-all">{language === 'zh' ? '選取' : 'Select'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReadingDetailView: React.FC<{ 
  readings: TarotReading[], 
  language: Language,
  updateReading: (id: string, updates: Partial<TarotReading>) => void,
  onDelete: (id: string) => void
}> = ({ readings, language, updateReading, onDelete }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const text = UI_TEXT[language];
  const reading = readings.find(r => r.id === id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isManagingCards, setIsManagingCards] = useState(false);
  const [showMeanings, setShowMeanings] = useState(true);
  const [outcomeDraft, setOutcomeDraft] = useState(reading?.outcome || '');
  const reportRef = useRef<HTMLDivElement>(null);

  const performAnalysis = useCallback(async () => {
    if (!reading || reading.status === 'analyzed' || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeReading(reading);
      updateReading(reading.id, { analysis: result, status: 'analyzed' });
    } catch (error) {
      console.error(error);
      updateReading(reading.id, { status: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  }, [reading, isAnalyzing, updateReading]);

  useEffect(() => {
    if (reading && reading.status === 'pending') performAnalysis();
  }, [id, reading?.status, performAnalysis]);

  const handleRemoveCard = (index: number) => {
    if (!reading) return;
    const cardName = language === 'zh' ? reading.cards[index].card.nameZh : reading.cards[index].card.nameEn;
    if (window.confirm(language === 'zh' ? `確定移除「${cardName}」？` : `Remove "${cardName}"?`)) {
      const nextCards = [...reading.cards];
      nextCards.splice(index, 1);
      updateReading(reading.id, { 
          cards: nextCards, 
          status: nextCards.length > 0 ? 'pending' : 'analyzed',
          analysis: nextCards.length === 0 ? (language === 'zh' ? '牌陣目前為空。' : 'The spread is empty.') : undefined
      });
    }
  };

  const handleExportHTML = () => reading && exportReadingToHTML(reading);
  const handleExportJSON = () => reading && exportReadingToJSON(reading, `Arcanum_Reading_${reading.id.substring(0, 8)}.json`);

  if (!reading) return <div className="p-12 text-center text-stone-600 font-cinzel">The records remain silent. Reading not found.</div>;

  return (
    <div className="p-4 sm:p-12 max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center mb-12 no-print">
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate(-1)} className="text-stone-600 hover:text-amber-600 font-cinzel text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 border border-stone-900 rounded-xl glass transition-all">
            <i className="fa-solid fa-arrow-left"></i> {language === 'zh' ? '返回' : 'Back'}
          </button>
          <button 
            onClick={() => setIsManagingCards(!isManagingCards)}
            className={`text-stone-400 font-cinzel text-[10px] font-bold uppercase border px-4 py-2 rounded-xl transition-all shadow-lg ${isManagingCards ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-stone-800 hover:text-amber-500 hover:border-amber-900/40'}`}
          >
            <i className={`fa-solid ${isManagingCards ? 'fa-check' : 'fa-pen-to-square'} mr-2`}></i> 
            {isManagingCards ? (language === 'zh' ? '完成' : 'Done') : (language === 'zh' ? '編輯牌陣' : 'Edit Cards')}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleExportJSON} className="text-stone-400 hover:text-amber-500 font-cinzel text-[10px] font-bold uppercase border border-stone-800 px-4 py-2 rounded-xl glass transition-all"><i className="fa-solid fa-file-code mr-2"></i> JSON</button>
          <button onClick={handleExportHTML} className="text-stone-400 hover:text-amber-500 font-cinzel text-[10px] font-bold uppercase border border-stone-800 px-4 py-2 rounded-xl glass transition-all"><i className="fa-solid fa-file-export mr-2"></i> HTML</button>
          <button onClick={() => { if(window.confirm(text.deleteConfirm)) { onDelete(reading.id); navigate('/'); } }} className="text-stone-700 hover:text-red-700 font-cinzel text-[10px] font-bold uppercase border border-stone-900 px-4 py-2 rounded-xl transition-all"><i className="fa-solid fa-trash-can mr-2"></i> {text.delete}</button>
        </div>
      </div>

      <div ref={reportRef} className="pb-12 bg-[#0c0a09]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-12">
            <section className="bg-stone-900/20 p-8 rounded-3xl border border-stone-900 shadow-inner">
              <h1 className="text-base sm:text-lg font-playfair font-bold text-amber-100 mb-8 italic leading-snug">&quot;{reading.query}&quot;</h1>
              <div className="text-[10px] text-stone-500 uppercase font-bold tracking-[0.2em] space-y-2">
                <div className="flex items-center gap-2"><i className="fa-solid fa-clock w-4"></i> <span>{new Date(reading.timestamp).toLocaleString()}</span></div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-user w-4"></i> <span>{reading.drawer === 'self' ? (language === 'zh' ? '親自抽取' : 'Self-drawn') : (language === 'zh' ? '代抽' : 'On behalf')}</span></div>
              </div>
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-8 border-b border-stone-900 pb-4">
                <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-3">
                   <i className="fa-solid fa-clone text-amber-900/40"></i>
                   {text.spread}
                </h3>
                <button 
                  onClick={() => setShowMeanings(!showMeanings)}
                  className={`text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 px-3 py-1 rounded-full border no-print ${showMeanings ? 'bg-amber-900/20 border-amber-800/50 text-amber-200' : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-amber-500'}`}
                >
                  <i className={`fa-solid ${showMeanings ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  {showMeanings ? (language === 'zh' ? '隱藏含義' : 'Hide') : (language === 'zh' ? '顯示含義' : 'Show')}
                </button>
              </div>
              <div className="flex flex-wrap gap-8 justify-center items-start">
                {reading.cards.map((rc, i) => (
                  <div key={i} className="flex flex-col items-center relative group pop-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <TarotCardUI readingCard={rc} language={language} small showMeaning={showMeanings} />
                    <div className="mt-4 text-[10px] text-stone-600 font-cinzel font-bold tracking-widest uppercase flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-900/40"></span>
                       Pos {i + 1}
                    </div>
                    {isManagingCards && (
                      <button 
                        onClick={() => handleRemoveCard(i)}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-950 border border-red-900 text-white flex items-center justify-center shadow-xl hover:bg-red-800 transition-all z-50 animate-in zoom-in-50 duration-300 no-print"
                      >
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {reading.userAnalysis && (
              <div className="glass rounded-3xl p-10 shadow-xl border border-stone-800/30 bg-stone-900/10">
                <h2 className="font-cinzel text-lg text-stone-100 mb-8 flex items-center gap-3"><i className="fa-solid fa-scroll text-amber-900/50"></i> {text.userInterpretation}</h2>
                <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap italic opacity-80 font-playfair">{reading.userAnalysis}</p>
              </div>
            )}

            <div className="glass rounded-3xl p-6 sm:p-14 shadow-2xl relative overflow-hidden min-h-[400px]">
              <header className="flex justify-between items-center mb-10 border-b border-stone-800 pb-8">
                <h2 className="font-cinzel text-xl text-amber-100 font-bold uppercase tracking-[0.2em]">{text.verification}</h2>
                <span className={`text-[10px] px-3 py-1 rounded-full border ${reading.status === 'analyzed' ? 'border-emerald-900/30 text-emerald-700' : 'border-amber-900/30 text-amber-700'}`}>{reading.status.toUpperCase()}</span>
              </header>
              {isAnalyzing ? (
                <div className="py-24 flex flex-col items-center text-center"><div className="w-16 h-16 relative mb-8"><div className="absolute inset-0 border-2 border-stone-900 rounded-full"></div><div className="absolute inset-0 border-t-2 border-amber-600 rounded-full animate-spin"></div></div><h3 className="font-cinzel text-amber-400 animate-pulse text-sm tracking-[0.3em]">{text.analyzing}</h3></div>
              ) : reading.status === 'error' ? (
                <div className="py-12 text-center text-red-900 font-bold uppercase text-xs">The channelling was interrupted. Please retry.</div>
              ) : <AnalysisRenderer text={reading.analysis || ''} />}
            </div>

            <div className="glass rounded-3xl p-6 sm:p-10 border border-emerald-900/10 bg-emerald-950/5 relative overflow-hidden no-print">
               <h2 className="font-cinzel text-lg text-stone-100 mb-8 flex items-center gap-3"><i className="fa-solid fa-seedling text-emerald-800"></i> {text.outcome}</h2>
               <textarea value={outcomeDraft} onChange={e => setOutcomeDraft(e.target.value)} placeholder={text.outcomePlaceholder} className="w-full bg-stone-950/40 rounded-2xl p-6 text-stone-300 min-h-[150px] text-sm focus:ring-1 focus:ring-emerald-900/20 outline-none leading-relaxed" />
               <div className="flex justify-end mt-6">
                 <button onClick={() => updateReading(reading.id, { outcome: outcomeDraft })} className="bg-emerald-900/20 text-emerald-500 border border-emerald-900/30 px-10 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900/40 transition-all shadow-lg">{text.saveOutcome}</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Entry ---

const App = () => {
  const [readings, setReadings] = useState<TarotReading[]>(StorageManager.getReadings());
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('arcanum_lang') as Language) || 'zh');

  const onUpdate = useCallback(() => {
    setReadings(StorageManager.getReadings());
  }, []);

  useEffect(() => {
    localStorage.setItem('arcanum_lang', language);
  }, [language]);

  const onSave = useCallback((reading: TarotReading) => {
    StorageManager.saveReading(reading);
    onUpdate();
  }, [onUpdate]);

  const onImport = useCallback((reading: TarotReading | TarotReading[]) => {
    if (Array.isArray(reading)) {
      reading.forEach(r => StorageManager.saveReading(r));
    } else {
      StorageManager.saveReading(reading);
    }
    onUpdate();
  }, [onUpdate]);

  const updateReading = useCallback((id: string, updates: Partial<TarotReading>) => {
    const readingsList = StorageManager.getReadings();
    const r = readingsList.find(x => x.id === id);
    if (r) {
      StorageManager.saveReading({ ...r, ...updates });
      onUpdate();
    }
  }, [onUpdate]);

  const onDelete = useCallback((id: string) => {
    StorageManager.deleteReading(id);
    onUpdate();
  }, [onUpdate]);

  return (
    <Router>
      <div className="min-h-screen bg-[#0c0a09] text-stone-300">
        <Navbar language={language} setLanguage={setLanguage} />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HistoryView readings={readings} language={language} onUpdate={onUpdate} onImport={onImport} />} />
            <Route path="/new" element={<NewReadingView language={language} onSave={onSave} />} />
            <Route path="/reading/:id" element={<ReadingDetailView readings={readings} language={language} updateReading={updateReading} onDelete={onDelete} />} />
          </Routes>
        </main>
        
        <footer className="relative z-10 p-12 text-center mt-20 border-t border-stone-900/50 no-print">
          <p className="text-[10px] tracking-[0.5em] font-bold text-stone-800 uppercase">
            Arcanum Insight • Eternal Wisdom • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
