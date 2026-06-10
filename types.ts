
export type Suite = 'Major' | 'Cups' | 'Pentacles' | 'Swords' | 'Wands';
export type Language = 'en' | 'zh';

export interface TarotCard {
  id: string;
  nameEn: string;
  nameZh: string;
  suite: Suite;
  value: string;
  arcana: 'Major' | 'Minor';
  meaningEn: string;
  meaningZh: string;
  image: string; // URL to Rider-Waite image
}

export interface ReadingCard {
  card: TarotCard;
  isReversed: boolean;
  positionDescription?: string;
}

export type DrawerType = 'self' | 'behalf';

export interface ReadingExtension {
  id: string;
  timestamp: number;
  cards: ReadingCard[];
  query?: string;
  analysis?: string;
  status: 'pending' | 'analyzed' | 'error';
}

export interface TarotReading {
  id: string;
  timestamp: number;
  query: string;
  drawer: DrawerType;
  cards: ReadingCard[];
  userAnalysis?: string;
  outcome?: string;
  analysis?: string;
  status: 'pending' | 'analyzed' | 'error';
  language: Language;
  extensions?: ReadingExtension[];
}
