import { useState, useRef } from 'react';
import type { TravelItinerary } from './types';
import { WishlistSupabase } from './components/WishlistSupabase';
import { SouvenirList } from './components/SouvenirList';
import { Schedule } from './components/Schedule';
import styles from './App.module.css';

const initialData: TravelItinerary = {
  title: "韓国旅行 2025",
  period: "2025年8月9日 - 8月11日",
  flightInfo: {
    outbound: {
      departure: "成田国際空港 (NRT)",
      arrival: "仁川国際空港 (ICN)",
      airline: "大韓航空",
      flightNumber: "KE123",
      date: "2025年8月9日 10:30"
    },
    return: {
      departure: "仁川国際空港 (ICN)",
      arrival: "成田国際空港 (NRT)",
      airline: "大韓航空",
      flightNumber: "KE456",
      date: "2025年8月11日 20:00"
    }
  },
  schedule: [
    {
      date: "8月9日（土）",
      day: "出発日",
      activities: [
        { 
          time: "10:30", 
          activity: "🏠 自宅出発（成田空港へ）",
          details: "成田空港第1ターミナルへ向けて出発\n※12:30のフライトに間に合うよう、2時間前にはチェックイン",
          duration: "移動時間: 約1時間",
          type: "shared" 
        },
        { 
          time: "11:30", 
          activity: "✈️ 成田空港到着・チェックイン",
          details: "Air Premia カウンターでチェックイン\n保安検査・出国審査",
          duration: "所要時間: 約1時間",
          type: "shared" 
        },
        { 
          time: "12:30", 
          activity: "✈️ NRT → ICN フライト",
          details: "Air Premia YP732便\n東京（成田）→ ソウル（仁川）",
          flightLink: "https://www.flightaware.com/live/flight/APZ732",
          flightInfo: "フライト時間: 2時間35分\n機内サービス: プレミアムエコノミークラス",
          duration: "飛行時間: 2時間35分",
          type: "shared",
          activityType: "flight"
        },
        { 
          time: "15:05", 
          activity: "🛬 仁川空港到着・入国審査",
          details: "入国審査・税関・荷物受取\n※韓国時間（日本と時差なし）",
          duration: "所要時間: 約30-45分",
          type: "shared",
          activityType: "immigration",
          flightLink: "https://www.e-arrivalcard.go.kr/portal/main/index.do?locale=JP"
        },
        { 
          time: "16:00", 
          activity: "🚆 空港→東大門移動",
          details: "選択肢1: 空港鉄道A'REX + 地下鉄 - 約60分\n選択肢2: リムジンバス（東大門行き）- 約70-90分\n選択肢3: タクシー - 約60分、約50,000ウォン",
          duration: "移動時間: 60分〜90分",
          type: "shared",
          activityType: "transfer"
        },
        { 
          time: "17:00", 
          activity: "🏨 東大門ホテルチェックイン",
          details: "ホテル ザ デザイナーズ DDP\n住所: ソウル特別市 中区 双林洞 155-1\n荷物を置いて一休み・身支度",
          duration: "所要時間: 約30分",
          type: "shared",
          flightLink: "https://naver.me/FfB02TIU"
        },
        { 
          time: "18:00", 
          activity: "🛍️ ショッピング",
          details: "東大門エリアでショッピング\nファッション・アクセサリー・コスメなど",
          duration: "所要時間: 約2時間",
          type: "shared" 
        },
        { 
          time: "20:00", 
          activity: "🍽️ 東大門で夕食",
          details: "東大門エリアの韓国料理レストランで夕食\nサムギョプサル・チゲ・韓国BBQなど",
          duration: "所要時間: 約1時間30分",
          type: "shared" 
        },
        { 
          time: "21:30", 
          activity: "🛍️ 東大門ナイトショッピング",
          details: "東大門デザインプラザ・ドゥータ・ミリオレなど\nファッション・アクセサリー・コスメショッピング",
          duration: "所要時間: 約2時間30分",
          type: "shared" 
        },
        { 
          time: "24:00", 
          activity: "🌃 夜景 @ 興仁之門公園",
          details: "興仁之門（東大門）と周辺の美しい夜景を鑑賞",
          duration: "所要時間: 約1時間",
          type: "shared",
          flightLink: "https://naver.me/FMTwyusX",
          imageUrl: "https://stat.ameba.jp/user_images/20250411/12/koreaarex/16/81/p/o1417094515565102069.png"
        },
        { 
          time: "25:00", 
          activity: "🏨 ホテル帰宅",
          details: "東大門ホテルに帰宅・就寝準備\n明日の観光に備えてゆっくり休憩",
          type: "shared" 
        }
      ]
    },
    {
      date: "8月10日（日）",
      day: "観光日",
      activities: [
        { 
          time: "09:00", 
          activity: "+ 予定を追加",
          type: "empty" 
        },
        { 
          time: "12:00", 
          activity: "+ 予定を追加（昼食）",
          type: "empty" 
        },
        { 
          time: "14:00", 
          activity: "+ 予定を追加",
          type: "empty" 
        },
        { 
          time: "15:00", 
          activity: "🚇 ザ・現代ソウルへ移動",
          details: "地下鉄で汝矣島へ移動",
          duration: "移動時間: 1時間",
          type: "shared",
          activityType: "transfer"
        },
        { 
          time: "16:00", 
          activity: "🛍️ ザ・現代ソウルでショッピング",
          details: "ソウル最大級のデパート\nファッション・コスメ・グルメ\n地下1F～6Fまでの大型ショッピングモール",
          duration: "所要時間: 4時間30分",
          type: "shared",
          flightLink: "https://naver.me/x7j8Z2hF"
        },
        { 
          time: "20:30", 
          activity: "🤫 シークレット",
          details: "謎めいた予定",
          duration: "所要時間: 1時間",
          type: "shared" 
        },
        { 
          time: "21:15", 
          activity: "🚇 汝矣ナル駅へ移動",
          details: "地下鉄5号線「汝矣ナル駅」3番出口\n漢江公園へ降りてチケット売り場へ",
          duration: "移動時間: 約30分",
          type: "shared" 
        },
        { 
          time: "22:00", 
          activity: "🛥️ ソウル汝矣島Eランド漢江リバークルーズ",
          details: "✨ スターライトクルーズ（50分）\n🎵 ジャズ生演奏付き\n🌙 盤浦大橋のムーンライトレインボー噴水ショー\n💰 料金: ¥5,020（大人2名分）\n📅 予約番号: FVG545664",
          flightInfo: "集合場所: E-land Cruiseチケットオフィス\n住所: 86-1, Yeouido-dong, Yeongdeungpo-gu, Seoul\n注意事項: 予約時間15分前到着・パスポート持参必須",
          duration: "クルーズ時間: 50分",
          type: "shared",
          flightLink: "https://naver.me/FINp4ULY"
        },
        { 
          time: "23:00", 
          activity: "🍢 弘大 夜の屋台通り",
          details: "弘大の若者の街で深夜屋台巡り\n🌭 ハットグ（チーズドッグ）・タコ焼き\n🍳 チキン・ホットック・クレープ\n🍺 치킨과 맥주（チキンとビール）文化体験\n📍 地下鉄2号線「弘大入口駅」9番出口\n💡 深夜2時頃まで営業・若者に人気のエリア",
          duration: "滞在時間: 約1時間30分",
          type: "shared" 
        },
        { 
          time: "00:30", 
          activity: "🏨 ホテル帰宅",
          details: "弘大から東大門ホテルへ\n地下鉄またはタクシーで移動",
          duration: "移動時間: 約30分",
          type: "shared" 
        }
      ]
    },
    {
      date: "8月11日（月）",
      day: "帰国日",
      activities: [
        { 
          time: "09:00", 
          activity: "💉 Shinebeam美容クリニック",
          details: "美容施術の予約\nリジュラン・スキンボトックス・水光注射など",
          duration: "所要時間: 約2時間",
          type: "person-y" 
        },
        { 
          time: "12:00", 
          activity: "🏨 ホテルチェックアウト",
          details: "チェックアウト手続き\n空港へ向けて準備",
          type: "shared" 
        },
        { 
          time: "13:00", 
          activity: "🚆 ソウル駅→仁川空港移動",
          details: "空港鉄道A'REXまたはリムジンバスで移動\n※16:05のフライトに間に合うよう余裕を持って",
          duration: "移動時間: 43分〜90分",
          type: "shared",
          activityType: "transfer"
        },
        { 
          time: "14:30", 
          activity: "✈️ 仁川空港到着・チェックイン",
          details: "Jeju Air カウンターでチェックイン\n出国審査・免税店",
          duration: "所要時間: 約1時間30分",
          type: "shared" 
        },
        { 
          time: "16:05", 
          activity: "✈️ ICN → NRT フライト",
          details: "Jeju Air 7C1121便\nソウル（仁川）→ 東京（成田）\n予約番号: D6KN4C",
          flightInfo: "フライト時間: 2時間25分\n機内サービス: エコノミークラス",
          duration: "飛行時間: 2時間25分",
          type: "shared",
          activityType: "flight"
        },
        { 
          time: "18:30", 
          activity: "🛬 成田空港到着・入国審査",
          details: "入国審査・税関・荷物受取\n※日本時間",
          duration: "所要時間: 約30-45分",
          type: "shared",
          activityType: "immigration"
        },
        { 
          time: "19:30", 
          activity: "🏠 帰宅",
          details: "成田空港から自宅へ",
          type: "shared" 
        }
      ]
    }
  ],
};

function App() {
  const [itinerary] = useState<TravelItinerary>(initialData);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for scrolling to sections
  const scheduleRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const souvenirRef = useRef<HTMLDivElement>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={styles.mainContainer}>
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      
      <div ref={scheduleRef} className={styles.scheduleContainer}>
        <h1>🇰🇷 韓国旅行日程表 🇯🇵</h1>
        <Schedule schedule={itinerary.schedule} />
      </div>

      <div ref={wishlistRef}>
        <WishlistSupabase onError={handleError} />
      </div>
      
      <div ref={souvenirRef}>
        <SouvenirList onError={handleError} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={styles.bottomNav}>
        <button 
          className={styles.navButton}
          onClick={() => scrollToSection(scheduleRef)}
        >
          <div className={styles.navIcon}>📅</div>
          <div className={styles.navLabel}>日程</div>
        </button>
        <button 
          className={styles.navButton}
          onClick={() => scrollToSection(wishlistRef)}
        >
          <div className={styles.navIcon}>✨</div>
          <div className={styles.navLabel}>やること</div>
        </button>
        <button 
          className={styles.navButton}
          onClick={() => scrollToSection(souvenirRef)}
        >
          <div className={styles.navIcon}>🎁</div>
          <div className={styles.navLabel}>買う物</div>
        </button>
      </div>
    </div>
  );
}

export default App
