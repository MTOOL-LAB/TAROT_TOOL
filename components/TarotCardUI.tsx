
import React from 'react';
import { ReadingCard, Language } from '../types';

interface Props {
  readingCard: ReadingCard;
  language: Language;
  onClick?: () => void;
  small?: boolean;
  interactive?: boolean;
  showMeaning?: boolean;
}

export const TarotCardUI: React.FC<Props> = ({ 
  readingCard, 
  language, 
  onClick, 
  small = false, 
  interactive = false,
  showMeaning = false
}) => {
  const { card, isReversed } = readingCard;
  const isZh = language === 'zh';
  
  // Dynamic height class based on whether meaning is shown
  const heightClass = showMeaning 
    ? (small ? 'h-72 sm:h-96' : 'h-[28rem] sm:h-[36rem]') 
    : (small ? 'h-40 sm:h-56' : 'h-64 sm:h-96');

  return (
    <div 
      onClick={onClick}
      className={`relative rounded-xl border border-stone-800 overflow-hidden shadow-2xl transition-all duration-500 shrink-0
      ${interactive ? 'hover:border-amber-500/50 hover:shadow-amber-900/40 active:scale-95' : ''}
      ${small ? 'w-24 sm:w-32' : 'w-40 sm:w-56'} 
      ${heightClass}
      bg-stone-900 group cursor-pointer select-none flex flex-col`}
    >
      <div className="flex flex-col flex-grow transition-transform duration-700">
        <div className="relative flex-grow overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
          <img 
            src={card.image} 
            alt={card.nameEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain brightness-90 group-hover:brightness-100 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent pointer-events-none"></div>
        </div>
        
        <div className={`p-2 sm:p-4 bg-stone-900 flex flex-col items-center justify-center border-t border-stone-800/50 ${showMeaning ? 'h-1/3' : ''}`}>
          <h3 className={`font-cinzel font-bold text-amber-100/90 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center ${small ? 'text-[8px] sm:text-[10px]' : 'text-[10px] sm:text-base'}`}>
            {isZh ? card.nameZh : card.nameEn}
          </h3>
          <div className="text-stone-600 text-[6px] sm:text-[9px] uppercase tracking-[0.2em] mt-0.5 font-bold">
            {card.suite}
          </div>
          
          {showMeaning && (
            <div className="mt-3 w-full overflow-y-auto no-scrollbar scroll-smooth">
              <p className={`text-stone-400 font-inter leading-relaxed italic text-center px-1 border-t border-stone-800/30 pt-2 ${small ? 'text-[7px] sm:text-[9px]' : 'text-[9px] sm:text-[12px]'}`}>
                {isZh ? card.meaningZh : card.meaningEn}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Reversed Indicator Badge Removed */}
    </div>
  );
};
