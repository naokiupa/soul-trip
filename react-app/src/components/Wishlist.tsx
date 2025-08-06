import type { WishItem } from '../types';
import styles from '../App.module.css';

interface WishlistProps {
  items: WishItem[];
  onToggle: (id: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ items, onToggle }) => {
  const naokiItems = [
    { id: "naoki1", text: "💉 ポテンツァ（ジュベリック）", checked: false },
    { id: "naoki2", text: "💉 トライフィルプロ（リジュラン）", checked: false }
  ];

  const mahiroItems = items.filter(item => 
    item.text.includes('ロンドンベーグル') || 
    item.text.includes('塩パン') || 
    item.text.includes('屋台') ||
    item.text.includes('リジュラン') ||
    item.text.includes('スキンボトックス') ||
    item.text.includes('水光注射') ||
    item.text.includes('タッカン')
  );

  const commonItems = items.filter(item => 
    !mahiroItems.some(mahiro => mahiro.id === item.id) &&
    !item.text.includes('ポテンツァ') &&
    !item.text.includes('トライフィルプロ')
  );

  return (
    <div className={styles.wishlistContainer}>
      <h2>✨ やりたいことリスト ✨</h2>
      
      <div className={styles.wishlistSection}>
        <div className={styles.wishlistHeader}>
          <span className={`${styles.personBadge} ${styles.naokiBadge}`}>なおき</span>
        </div>
        <ul className={styles.wishlistItems}>
          {naokiItems.map((item) => (
            <li key={item.id} className={styles.wishlistItem} onClick={() => onToggle(item.id)}>
              <div className={`${styles.itemCheckbox} ${item.checked ? styles.checked : ''}`}></div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.wishlistSection}>
        <div className={styles.wishlistHeader}>
          <span className={`${styles.personBadge} ${styles.mahiroBadge}`}>まひろ</span>
        </div>
        <ul className={styles.wishlistItems}>
          {mahiroItems.map((item) => (
            <li key={item.id} className={styles.wishlistItem} onClick={() => onToggle(item.id)}>
              <div className={`${styles.itemCheckbox} ${item.checked ? styles.checked : ''}`}></div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.wishlistSection}>
        <div className={styles.wishlistHeader}>
          <span className={`${styles.personBadge} ${styles.commonBadge}`}>共通</span>
        </div>
        <ul className={styles.wishlistItems}>
          {commonItems.map((item) => (
            <li key={item.id} className={styles.wishlistItem} onClick={() => onToggle(item.id)}>
              <div className={`${styles.itemCheckbox} ${item.checked ? styles.checked : ''}`}></div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};