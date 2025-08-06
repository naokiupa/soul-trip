-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    owner VARCHAR(20) NOT NULL CHECK (owner IN ('なおき', 'まひろ', '共通')),
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on wishlist" ON wishlist
    FOR ALL USING (true) WITH CHECK (true);

-- Insert seed data
INSERT INTO wishlist (text, is_checked, owner, sort_order) VALUES
-- なおき
('💉 ポテンツァ（ジュベリック）', FALSE, 'なおき', 1),
('💉 トライフィルプロ（リジュラン）', FALSE, 'なおき', 2),

-- まひろ
('🥯 ロンドンベーグル', FALSE, 'まひろ', 1),
('🥐 塩パン', FALSE, 'まひろ', 2),
('🍢 屋台', FALSE, 'まひろ', 3),
('💉 リジュラン（リズネ）', FALSE, 'まひろ', 4),
('💉 スキンボトックス', FALSE, 'まひろ', 5),
('💉 水光注射', FALSE, 'まひろ', 6),
('🍗 タッカンマリ', FALSE, 'まひろ', 7),

-- 共通
('🛍️ 明洞でショッピング', FALSE, '共通', 1),
('🏪 東大門市場', FALSE, '共通', 2),
('☕ おしゃれカフェ', FALSE, '共通', 3),
('🥩 焼肉', FALSE, '共通', 4),
('🍜 袋麺レストラン', FALSE, '共通', 5),
('🌃 夜景見る', FALSE, '共通', 6),
('🕺 梨泰院のクラブ', FALSE, '共通', 7),
('Nソウルタワー', FALSE, '共通', 8),
('漢江公園', FALSE, '共通', 9),
('弘大エリア', FALSE, '共通', 10),
('梨泰院', FALSE, '共通', 11),
('COEX Mall', FALSE, '共通', 12),
('清渓川', FALSE, '共通', 13),
('南山韓屋村', FALSE, '共通', 14),
('広蔵市場', FALSE, '共通', 15);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wishlist_updated_at 
    BEFORE UPDATE ON wishlist 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();