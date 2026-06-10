
import { TarotCard, Suite } from './types';

const IMG_BASE = 'https://www.sacred-texts.com/tarot/pkt/img/';

export const TAROT_SUITES: (Suite | 'All')[] = ['All', 'Major', 'Wands', 'Cups', 'Swords', 'Pentacles'];

export const TAROT_DECK: TarotCard[] = [
  // --- Major Arcana (22 cards) ---
  { id: 'ar00', nameEn: 'The Fool', nameZh: '愚者', suite: 'Major', value: '0', arcana: 'Major', meaningEn: 'Beginnings, innocence, spontaneity, a free spirit, leap of faith.', meaningZh: '新的開始、天真、自發性、自由的靈魂、冒險的信心。', image: `${IMG_BASE}ar00.jpg` },
  { id: 'ar01', nameEn: 'The Magician', nameZh: '魔術師', suite: 'Major', value: '1', arcana: 'Major', meaningEn: 'Manifestation, resourcefulness, power, inspired action, conscious awareness.', meaningZh: '顯化、資源豐富、力量、啟發性的行動、意識覺醒。', image: `${IMG_BASE}ar01.jpg` },
  { id: 'ar02', nameEn: 'The High Priestess', nameZh: '女祭司', suite: 'Major', value: '2', arcana: 'Major', meaningEn: 'Intuition, sacred knowledge, divine feminine, subconscious, mystery.', meaningZh: '直覺、神聖知識、女性神性、潛意識、神秘感。', image: `${IMG_BASE}ar02.jpg` },
  { id: 'ar03', nameEn: 'The Empress', nameZh: '皇后', suite: 'Major', value: '3', arcana: 'Major', meaningEn: 'Femininity, beauty, nature, nurturing, abundance, fertility.', meaningZh: '女性氣質、美麗、自然、滋育、豐饒、生產力。', image: `${IMG_BASE}ar03.jpg` },
  { id: 'ar04', nameEn: 'The Emperor', nameZh: '皇帝', suite: 'Major', value: '4', arcana: 'Major', meaningEn: 'Authority, establishment, structure, father figure, strategic thinking.', meaningZh: '權威、體制、結構、父親形象、戰略思維。', image: `${IMG_BASE}ar04.jpg` },
  { id: 'ar05', nameEn: 'The Hierophant', nameZh: '教皇', suite: 'Major', value: '5', arcana: 'Major', meaningEn: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions.', meaningZh: '精神智慧、宗教信仰、遵循規則、傳統、制度。', image: `${IMG_BASE}ar05.jpg` },
  { id: 'ar06', nameEn: 'The Lovers', nameZh: '戀人', suite: 'Major', value: '6', arcana: 'Major', meaningEn: 'Love, harmony, relationships, values alignment, critical choices.', meaningZh: '愛、和諧、關係、價值觀一致、重大選擇。', image: `${IMG_BASE}ar06.jpg` },
  { id: 'ar07', nameEn: 'The Chariot', nameZh: '戰車', suite: 'Major', value: '7', arcana: 'Major', meaningEn: 'Control, willpower, success, action, determination, triumph.', meaningZh: '控制、意志力、成功、行動、決心、凱旋。', image: `${IMG_BASE}ar07.jpg` },
  { id: 'ar08', nameEn: 'Strength', nameZh: '力量', suite: 'Major', value: '8', arcana: 'Major', meaningEn: 'Strength, courage, persuasion, influence, compassion, inner power.', meaningZh: '力量、勇氣、說服力、影響力、慈悲、內在能量。', image: `${IMG_BASE}ar08.jpg` },
  { id: 'ar09', nameEn: 'The Hermit', nameZh: '隱士', suite: 'Major', value: '9', arcana: 'Major', meaningEn: 'Soul-searching, introspection, solitude, inner guidance, enlightenment.', meaningZh: '尋求靈魂、內省、獨處、內在指引、啟蒙。', image: `${IMG_BASE}ar09.jpg` },
  { id: 'ar10', nameEn: 'Wheel of Fortune', nameZh: '命運之輪', suite: 'Major', value: '10', arcana: 'Major', meaningEn: 'Good luck, karma, life cycles, destiny, a turning point, inevitability.', meaningZh: '好運、業力、生命週期、命運、轉折點、不可避免的變化。', image: `${IMG_BASE}ar10.jpg` },
  { id: 'ar11', nameEn: 'Justice', nameZh: '正義', suite: 'Major', value: '11', arcana: 'Major', meaningEn: 'Justice, fairness, truth, cause and effect, legal matters.', meaningZh: '正義、公平、真相、因果、法律事務。', image: `${IMG_BASE}ar11.jpg` },
  { id: 'ar12', nameEn: 'The Hanged Man', nameZh: '倒吊人', suite: 'Major', value: '12', arcana: 'Major', meaningEn: 'Pause, surrender, letting go, new perspectives, sacrifice.', meaningZh: '暫停、臣服、放手、新觀點、犧牲。', image: `${IMG_BASE}ar12.jpg` },
  { id: 'ar13', nameEn: 'Death', nameZh: '死亡', suite: 'Major', value: '13', arcana: 'Major', meaningEn: 'Endings, radical change, transformation, transition, rebirth.', meaningZh: '結束、劇變、轉型、過渡、重生。', image: `${IMG_BASE}ar13.jpg` },
  { id: 'ar14', nameEn: 'Temperance', nameZh: '節制', suite: 'Major', value: '14', arcana: 'Major', meaningEn: 'Balance, moderation, patience, purpose, alchemy.', meaningZh: '平衡、節制、耐心、目標、融合。', image: `${IMG_BASE}ar14.jpg` },
  { id: 'ar15', nameEn: 'The Devil', nameZh: '惡魔', suite: 'Major', value: '15', arcana: 'Major', meaningEn: 'Shadow self, attachment, addiction, restriction, materialism.', meaningZh: '陰影自我、執著、成癮、束縛、物質主義。', image: `${IMG_BASE}ar15.jpg` },
  { id: 'ar16', nameEn: 'The Tower', nameZh: '高塔', suite: 'Major', value: '16', arcana: 'Major', meaningEn: 'Sudden change, upheaval, chaos, revelation, awakening, breakdown.', meaningZh: '突然的改變、動盪、混難、啟示、覺醒、瓦解。', image: `${IMG_BASE}ar16.jpg` },
  { id: 'ar17', nameEn: 'The Star', nameZh: '星星', suite: 'Major', value: '17', arcana: 'Major', meaningEn: 'Hope, faith, purpose, renewal, spirituality, serenity.', meaningZh: '希望、信念、目標、更新、靈性、寧靜。', image: `${IMG_BASE}ar17.jpg` },
  { id: 'ar18', nameEn: 'The Moon', nameZh: '月亮', suite: 'Major', value: '18', arcana: 'Major', meaningEn: 'Illusion, fear, anxiety, subconscious, intuition, deception.', meaningZh: '幻覺、恐懼、焦慮、潛意識、直覺、欺瞞。', image: `${IMG_BASE}ar18.jpg` },
  { id: 'ar19', nameEn: 'The Sun', nameZh: '太陽', suite: 'Major', value: '19', arcana: 'Major', meaningEn: 'Positivity, fun, warmth, success, vitality, enlightenment.', meaningZh: '積極、快樂、溫暖、成功、活力、啟蒙。', image: `${IMG_BASE}ar19.jpg` },
  { id: 'ar20', nameEn: 'Judgement', nameZh: '審判', suite: 'Major', value: '20', arcana: 'Major', meaningEn: 'Judgement, rebirth, inner calling, absolution, awakening.', meaningZh: '審判、重生、內心召喚、赦免、覺醒。', image: `${IMG_BASE}ar20.jpg` },
  { id: 'ar21', nameEn: 'The World', nameZh: '世界', suite: 'Major', value: '21', arcana: 'Major', meaningEn: 'Completion, integration, accomplishment, travel, fulfillment.', meaningZh: '完成、整合、成就、旅行、圓滿。', image: `${IMG_BASE}ar21.jpg` },

  // --- Wands ---
  { id: 'wa01', nameEn: 'Ace of Wands', nameZh: '權杖首牌', suite: 'Wands', value: 'Ace', arcana: 'Minor', meaningEn: 'Inspiration, new opportunities, growth, potential, spark.', meaningZh: '靈感、新機會、成長、潛力、火花。', image: `${IMG_BASE}waac.jpg` },
  { id: 'wa02', nameEn: 'Two of Wands', nameZh: '權杖二', suite: 'Wands', value: '2', arcana: 'Minor', meaningEn: 'Future planning, progress, decisions, discovery, bold moves.', meaningZh: '未來規劃、進步、決定、發現、大膽行動。', image: `${IMG_BASE}wa02.jpg` },
  { id: 'wa03', nameEn: 'Three of Wands', nameZh: '權杖三', suite: 'Wands', value: '3', arcana: 'Minor', meaningEn: 'Expansion, foresight, overseas opportunities, expansion.', meaningZh: '擴張、遠見、海外機會、版圖擴大。', image: `${IMG_BASE}wa03.jpg` },
  { id: 'wa04', nameEn: 'Four of Wands', nameZh: '權杖四', suite: 'Wands', value: '4', arcana: 'Minor', meaningEn: 'Celebration, joy, harmony, relaxation, homecoming, stability.', meaningZh: '慶祝、喜悅、和諧、放鬆、歸鄉、穩定。', image: `${IMG_BASE}wa04.jpg` },
  { id: 'wa05', nameEn: 'Five of Wands', nameZh: '權杖五', suite: 'Wands', value: '5', arcana: 'Minor', meaningEn: 'Conflict, competition, disagreements, tension, rivalry.', meaningZh: '衝突、競爭、分歧、緊張、競爭對手。', image: `${IMG_BASE}wa05.jpg` },
  { id: 'wa06', nameEn: 'Six of Wands', nameZh: '權杖六', suite: 'Wands', value: '6', arcana: 'Minor', meaningEn: 'Success, public recognition, progress, self-confidence, victory.', meaningZh: '成功、大眾認可、進展、自信、勝利。', image: `${IMG_BASE}wa06.jpg` },
  { id: 'wa07', nameEn: 'Seven of Wands', nameZh: '權杖七', suite: 'Wands', value: '7', arcana: 'Minor', meaningEn: 'Challenge, competition, protection, perseverance, holding ground.', meaningZh: '挑戰、競爭、保護、毅力、堅持陣地。', image: `${IMG_BASE}wa07.jpg` },
  { id: 'wa08', nameEn: 'Eight of Wands', nameZh: '權杖八', suite: 'Wands', value: '8', arcana: 'Minor', meaningEn: 'Speed, action, air travel, movement, rapid change, alignment.', meaningZh: '速度、行動、航空旅行、移動、快速變化、步調一致。', image: `${IMG_BASE}wa08.jpg` },
  { id: 'wa09', nameEn: 'Nine of Wands', nameZh: '權杖九', suite: 'Wands', value: '9', arcana: 'Minor', meaningEn: 'Resilience, courage, persistence, test of faith, final push.', meaningZh: '韌性、勇氣、堅持、信念的考驗、最後衝刺。', image: `${IMG_BASE}wa09.jpg` },
  { id: 'wa10', nameEn: 'Ten of Wands', nameZh: '權杖十', suite: 'Wands', value: '10', arcana: 'Minor', meaningEn: 'Burden, extra responsibility, hard work, completion, exhaustion.', meaningZh: '負擔、額外責任、努力工作、完成、精疲力竭。', image: `${IMG_BASE}wa10.jpg` },
  { id: 'wa11', nameEn: 'Page of Wands', nameZh: '權杖侍從', suite: 'Wands', value: 'Page', arcana: 'Minor', meaningEn: 'Discovery, creative spark, youthful messenger, enthusiasm.', meaningZh: '發現、創意火花、年輕的使者、熱忱。', image: `${IMG_BASE}wapa.jpg` },
  { id: 'wa12', nameEn: 'Knight of Wands', nameZh: '權杖騎士', suite: 'Wands', value: 'Knight', arcana: 'Minor', meaningEn: 'Energy, passion, inspired action, adventure, fierce pursuit.', meaningZh: '能量、激情、啟發性的行動、冒險、猛烈的追求。', image: `${IMG_BASE}wakn.jpg` },
  { id: 'wa13', nameEn: 'Queen of Wands', nameZh: '權杖王后', suite: 'Wands', value: 'Queen', arcana: 'Minor', meaningEn: 'Confidence, independence, vibrant social presence, charismatic.', meaningZh: '自信、獨立、活躍的社交形象、魅力領袖。', image: `${IMG_BASE}waqu.jpg` },
  { id: 'wa14', nameEn: 'King of Wands', nameZh: '權杖國王', suite: 'Wands', value: 'King', arcana: 'Minor', meaningEn: 'Visionary leadership, grand ideas, honor, entrepreneurship.', meaningZh: '遠見拓識的領導、宏大的想法、榮譽、企業家精神。', image: `${IMG_BASE}waki.jpg` },

  // --- Cups ---
  { id: 'cu01', nameEn: 'Ace of Cups', nameZh: '聖杯首牌', suite: 'Cups', value: 'Ace', arcana: 'Minor', meaningEn: 'Love, new relationships, compassion, creativity.', meaningZh: '愛、新關係、慈悲、創造力。', image: `${IMG_BASE}cuac.jpg` },
  { id: 'cu02', nameEn: 'Two of Cups', nameZh: '聖杯二', suite: 'Cups', value: '2', arcana: 'Minor', meaningEn: 'Unified love, partnership, mutual attraction, soul connection.', meaningZh: '統一的愛、夥伴關係、相互吸引、靈魂連結。', image: `${IMG_BASE}cu02.jpg` },
  { id: 'cu03', nameEn: 'Three of Cups', nameZh: '聖杯三', suite: 'Cups', value: '3', arcana: 'Minor', meaningEn: 'Celebration, friendship, creativity, community.', meaningZh: '慶祝、友誼、創造力、社群。', image: `${IMG_BASE}cu03.jpg` },
  { id: 'cu04', nameEn: 'Four of Cups', nameZh: '聖杯四', suite: 'Cups', value: '4', arcana: 'Minor', meaningEn: 'Meditation, contemplation, apathy, re-evaluation.', meaningZh: '冥想、沉思、冷淡、重新評估。', image: `${IMG_BASE}cu04.jpg` },
  { id: 'cu05', nameEn: 'Five of Cups', nameZh: '聖杯五', suite: 'Cups', value: '5', arcana: 'Minor', meaningEn: 'Regret, failure, disappointment, pessimism.', meaningZh: '遺憾、失敗、失望、悲觀。', image: `${IMG_BASE}cu05.jpg` },
  { id: 'cu06', nameEn: 'Six of Cups', nameZh: '聖杯六', suite: 'Cups', value: '6', arcana: 'Minor', meaningEn: 'Revisiting the past, childhood memories, innocence, nostalgia.', meaningZh: '重溫過去、童年回憶、天真、懷舊。', image: `${IMG_BASE}cu06.jpg` },
  { id: 'cu07', nameEn: 'Seven of Cups', nameZh: '聖杯七', suite: 'Cups', value: '7', arcana: 'Minor', meaningEn: 'Opportunities, choices, wishful thinking, illusion.', meaningZh: '機會、選擇、一廂情願、幻覺。', image: `${IMG_BASE}cu07.jpg` },
  { id: 'cu08', nameEn: 'Eight of Cups', nameZh: '聖杯八', suite: 'Cups', value: '8', arcana: 'Minor', meaningEn: 'Disappointment, abandonment, withdrawal, escaping.', meaningZh: '失望、放棄、撤退、逃避。', image: `${IMG_BASE}cu08.jpg` },
  { id: 'cu09', nameEn: 'Nine of Cups', nameZh: '聖杯九', suite: 'Cups', value: '9', arcana: 'Minor', meaningEn: 'Contentment, satisfaction, gratitude, wish come true.', meaningZh: '滿足、欣慰、感激、美夢成真。', image: `${IMG_BASE}cu09.jpg` },
  { id: 'cu10', nameEn: 'Ten of Cups', nameZh: '聖杯十', suite: 'Cups', value: '10', arcana: 'Minor', meaningEn: 'Divine love, blissful relationships, harmony, happiness.', meaningZh: '神聖的愛、幸福的關係、和諧、快樂。', image: `${IMG_BASE}cu10.jpg` },
  { id: 'cu11', nameEn: 'Page of Cups', nameZh: '聖杯侍從', suite: 'Cups', value: 'Page', arcana: 'Minor', meaningEn: 'Emotional openness, intuitive messages, artistic curiosity.', meaningZh: '情感開放、直覺訊息、藝術好奇心。', image: `${IMG_BASE}cupa.jpg` },
  { id: 'cu12', nameEn: 'Knight of Cups', nameZh: '聖杯騎士', suite: 'Cups', value: 'Knight', arcana: 'Minor', meaningEn: 'Romance, charm, poetic imagination, beauty.', meaningZh: '浪漫、魅力、詩意的想像、美麗。', image: `${IMG_BASE}cukn.jpg` },
  { id: 'cu13', nameEn: 'Queen of Cups', nameZh: '聖杯王后', suite: 'Cups', value: 'Queen', arcana: 'Minor', meaningEn: 'Deep empathy, caring energy, emotional stability, intuitive.', meaningZh: '深切的共情、關懷能量、情緒穩定、直覺。', image: `${IMG_BASE}cuqu.jpg` },
  { id: 'cu14', nameEn: 'King of Cups', nameZh: '聖杯國王', suite: 'Cups', value: 'King', arcana: 'Minor', meaningEn: 'Emotional balance, compassionate wisdom, calm.', meaningZh: '情感平衡、慈悲智慧、冷靜。', image: `${IMG_BASE}cuki.jpg` },

  // --- Swords ---
  { id: 'sw01', nameEn: 'Ace of Swords', nameZh: '寶劍首牌', suite: 'Swords', value: 'Ace', arcana: 'Minor', meaningEn: 'Breakthroughs, new ideas, mental clarity, victory.', meaningZh: '突破、新想法、清晰心智、勝利。', image: `${IMG_BASE}swac.jpg` },
  { id: 'sw02', nameEn: 'Two of Swords', nameZh: '寶劍二', suite: 'Swords', value: '2', arcana: 'Minor', meaningEn: 'Difficult choices, indecision, stalemate, avoided emotions.', meaningZh: '困難的選擇、猶豫不決、僵局、逃避情緒。', image: `${IMG_BASE}sw02.jpg` },
  { id: 'sw03', nameEn: 'Three of Swords', nameZh: '寶劍三', suite: 'Swords', value: '3', arcana: 'Minor', meaningEn: 'Heartbreak, emotional pain, sorrow, betrayal.', meaningZh: '心碎、情緒痛苦、悲傷、背叛。', image: `${IMG_BASE}sw03.jpg` },
  { id: 'sw04', nameEn: 'Four of Swords', nameZh: '寶劍四', suite: 'Swords', value: '4', arcana: 'Minor', meaningEn: 'Rest, relaxation, meditation, recovery.', meaningZh: '休息、放鬆、冥想、康復。', image: `${IMG_BASE}sw04.jpg` },
  { id: 'sw05', nameEn: 'Five of Swords', nameZh: '寶劍五', suite: 'Swords', value: '5', arcana: 'Minor', meaningEn: 'Conflict, disagreements, defeat, hollow victory.', meaningZh: '衝突、分歧、失敗、虛空的勝利。', image: `${IMG_BASE}sw05.jpg` },
  { id: 'sw06', nameEn: 'Six of Swords', nameZh: '寶劍六', suite: 'Swords', value: '6', arcana: 'Minor', meaningEn: 'Transition, change, leaving baggage behind.', meaningZh: '過渡、改變、放下包袱。', image: `${IMG_BASE}sw06.jpg` },
  { id: 'sw07', nameEn: 'Seven of Swords', nameZh: '寶劍七', suite: 'Swords', value: '7', arcana: 'Minor', meaningEn: 'Betrayal, deception, stealth, tactical wit.', meaningZh: '背叛、欺騙、秘密行動、戰術智慧。', image: `${IMG_BASE}sw07.jpg` },
  { id: 'sw08', nameEn: 'Eight of Swords', nameZh: '寶劍八', suite: 'Swords', value: '8', arcana: 'Minor', meaningEn: 'Negative thoughts, self-imposed restriction, victimhood.', meaningZh: '負面想法、自我限制、受害者心態。', image: `${IMG_BASE}sw08.jpg` },
  { id: 'sw09', nameEn: 'Nine of Swords', nameZh: '寶劍九', suite: 'Swords', value: '9', arcana: 'Minor', meaningEn: 'Anxiety, nightmares, overthinking.', meaningZh: '焦慮、噩夢、過度思考。', image: `${IMG_BASE}sw09.jpg` },
  { id: 'sw10', nameEn: 'Ten of Swords', nameZh: '寶劍十', suite: 'Swords', value: '10', arcana: 'Minor', meaningEn: 'Painful endings, deep wounds, rock bottom.', meaningZh: '痛苦的結束、深深的傷口、谷底。', image: `${IMG_BASE}sw10.jpg` },
  { id: 'sw11', nameEn: 'Page of Swords', nameZh: '寶劍侍從', suite: 'Swords', value: 'Page', arcana: 'Minor', meaningEn: 'Mental alertness, truth-seeking, keen observation.', meaningZh: '心智警覺、尋求真相、敏銳觀察。', image: `${IMG_BASE}swpa.jpg` },
  { id: 'sw12', nameEn: 'Knight of Swords', nameZh: '寶劍騎士', suite: 'Swords', value: 'Knight', arcana: 'Minor', meaningEn: 'Ambition, fast-thinking, action-oriented, success.', meaningZh: '雄心壯志、思維敏捷、行動導向、成功。', image: `${IMG_BASE}swkn.jpg` },
  { id: 'sw13', nameEn: 'Queen of Swords', nameZh: '寶劍王后', suite: 'Swords', value: 'Queen', arcana: 'Minor', meaningEn: 'Intellectual power, unbiased judgment, direct.', meaningZh: '理智力量、無偏見的判斷、直接。', image: `${IMG_BASE}swqu.jpg` },
  { id: 'sw14', nameEn: 'King of Swords', nameZh: '寶劍國王', suite: 'Swords', value: 'King', arcana: 'Minor', meaningEn: 'Mental clarity, authority, truth, logic.', meaningZh: '清晰心智、權威、真相、邏輯。', image: `${IMG_BASE}swki.jpg` },

  // --- Pentacles ---
  { id: 'pe01', nameEn: 'Ace of Pentacles', nameZh: '星幣首牌', suite: 'Pentacles', value: 'Ace', arcana: 'Minor', meaningEn: 'Financial opportunity, manifestation, abundance.', meaningZh: '財務機會、顯化、豐饒。', image: `${IMG_BASE}peac.jpg` },
  { id: 'pe02', nameEn: 'Two of Pentacles', nameZh: '星幣二', suite: 'Pentacles', value: '2', arcana: 'Minor', meaningEn: 'Balance, time management, adaptability.', meaningZh: '平衡、時間管理、適應力。', image: `${IMG_BASE}pe02.jpg` },
  { id: 'pe03', nameEn: 'Three of Pentacles', nameZh: '星幣三', suite: 'Pentacles', value: '3', arcana: 'Minor', meaningEn: 'Teamwork, collaboration, implementation, mastery.', meaningZh: '團隊合作、協作、執行、精通。', image: `${IMG_BASE}pe03.jpg` },
  { id: 'pe04', nameEn: 'Four of Pentacles', nameZh: '星幣四', suite: 'Pentacles', value: '4', arcana: 'Minor', meaningEn: 'Security, conservatism, control, stability.', meaningZh: '安全感、保守主義、控制、穩定。', image: `${IMG_BASE}pe04.jpg` },
  { id: 'pe05', nameEn: 'Five of Pentacles', nameZh: '星幣五', suite: 'Pentacles', value: '5', arcana: 'Minor', meaningEn: 'Financial loss, poverty, isolation, hard times.', meaningZh: '財務損失、貧窮、孤立、艱難時期。', image: `${IMG_BASE}pe05.jpg` },
  { id: 'pe06', nameEn: 'Six of Pentacles', nameZh: '星幣六', suite: 'Pentacles', value: '6', arcana: 'Minor', meaningEn: 'Giving, receiving, sharing wealth, generosity.', meaningZh: '給予、接受、分享財富、慷慨。', image: `${IMG_BASE}pe06.jpg` },
  { id: 'pe07', nameEn: 'Seven of Pentacles', nameZh: '星幣七', suite: 'Pentacles', value: '7', arcana: 'Minor', meaningEn: 'Long-term view, perseverance, investment.', meaningZh: '長遠眼光、毅力、投資。', image: `${IMG_BASE}pe07.jpg` },
  { id: 'pe08', nameEn: 'Eight of Pentacles', nameZh: '星幣八', suite: 'Pentacles', value: '8', arcana: 'Minor', meaningEn: 'Skill development, mastery, apprenticeship.', meaningZh: '技能發展、精通、學徒期。', image: `${IMG_BASE}pe08.jpg` },
  { id: 'pe09', nameEn: 'Nine of Pentacles', nameZh: '星幣九', suite: 'Pentacles', value: '9', arcana: 'Minor', meaningEn: 'Abundance, luxury, self-sufficiency.', meaningZh: '豐饒、奢侈、自給自足。', image: `${IMG_BASE}pe09.jpg` },
  { id: 'pe10', nameEn: 'Ten of Pentacles', nameZh: '星幣十', suite: 'Pentacles', value: '10', arcana: 'Minor', meaningEn: 'Wealth, financial security, family, legacy.', meaningZh: '財富、財務安全、家庭、遺產。', image: `${IMG_BASE}pe10.jpg` },
  { id: 'pe11', nameEn: 'Page of Pentacles', nameZh: '星幣侍從', suite: 'Pentacles', value: 'Page', arcana: 'Minor', meaningEn: 'Practical beginnings, diligent learner, skills.', meaningZh: '實用的開始、勤奮的學習者、技能。', image: `${IMG_BASE}pepa.jpg` },
  { id: 'pe12', nameEn: 'Knight of Pentacles', nameZh: '星幣騎士', suite: 'Pentacles', value: 'Knight', arcana: 'Minor', meaningEn: 'Reliability, slow but steady progress, hard work.', meaningZh: '可靠、緩慢但穩步的進展、努力工作。', image: `${IMG_BASE}pekn.jpg` },
  { id: 'pe13', nameEn: 'Queen of Pentacles', nameZh: '星幣王后', suite: 'Pentacles', value: 'Queen', arcana: 'Minor', meaningEn: 'Practical nurturing, providing security, grounded.', meaningZh: '實用的滋養、提供安全感、踏實。', image: `${IMG_BASE}pequ.jpg` },
  { id: 'pe14', nameEn: 'King of Pentacles', nameZh: '星幣國王', suite: 'Pentacles', value: 'King', arcana: 'Minor', meaningEn: 'Material wealth, financial security, business authority.', meaningZh: '物質財富、財務安全、商界權威。', image: `${IMG_BASE}peki.jpg` },
];

export const DRAWER_OPTIONS = {
  en: [
    { value: 'self', label: 'Self-drawn' },
    { value: 'behalf', label: 'On behalf of others' }
  ],
  zh: [
    { value: 'self', label: '親自抽取' },
    { value: 'behalf', label: '代為抽取' }
  ]
};

export const UI_TEXT = {
  en: {
    history: 'Tarot',
    newReading: 'New Spread',
    noReadings: 'No entries found',
    recordFirst: 'Start your journey',
    inquiry: 'Question / Inquiry',
    reader: 'Drawn by',
    spread: 'The Spread',
    userInterpretation: 'Your Personal Analysis',
    userInterpretationPlaceholder: 'Record your own thoughts first...',
    outcome: 'Follow-up / Outcome Verification',
    outcomePlaceholder: 'Add notes here to verify the reading later...',
    saveOutcome: 'Update Outcome',
    analyze: 'Request AI Verification',
    back: 'Back',
    overview: 'AI Insights',
    interpretation: 'Deep Interpretation',
    analyzing: 'Celestial analysis in progress...',
    searchPlaceholder: 'Find a card...',
    verification: 'AI Supplemental Verification',
    shuffle: 'Random Draw',
    delete: 'Delete Record',
    deleteConfirm: 'Purge this record from the chronicles?',
    saved: 'Chronicle Updated',
    recordedCards: 'Original Alignment',
    editMode: 'Manage Records',
    cancelEdit: 'Cancel',
    confirmMultiDelete: 'Delete Selected',
    importJSON: 'Import (JSON)',
    exportAllJSON: 'Export All (JSON)',
    exportSingleJSON: 'Export (JSON)'
  },
  zh: {
    history: 'Tarot',
    newReading: '開啟新牌陣',
    noReadings: '尚無任何紀錄',
    recordFirst: '開始第一次占卜',
    inquiry: '占卜問題',
    reader: '抽牌者',
    spread: '牌陣',
    userInterpretation: '個人分析/直覺',
    userInterpretationPlaceholder: '請先記錄下你自己的初步分析...',
    outcome: '後續驗證與追蹤',
    outcomePlaceholder: '記錄實際情況，以驗證占卜結果...',
    saveOutcome: '儲存追蹤紀錄',
    analyze: '請求 AI 驗證分析',
    back: '返回',
    overview: 'AI 深度洞見',
    interpretation: '牌面解析',
    analyzing: '正在進行星象數據分析...',
    searchPlaceholder: '搜尋卡牌...',
    verification: 'AI 輔助驗證',
    shuffle: '隨機抽取',
    delete: '刪除紀錄',
    deleteConfirm: '永久移除此項紀錄？',
    saved: '追蹤紀錄已儲存',
    recordedCards: '原始抽牌陣容',
    editMode: '批次管理',
    cancelEdit: '取消',
    confirmMultiDelete: '確認刪除所選',
    importJSON: '匯入 (JSON)',
    exportAllJSON: '匯出所有 (JSON)',
    exportSingleJSON: '匯出 JSON'
  }
};
