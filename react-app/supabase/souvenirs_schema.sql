-- Create souvenirs table
CREATE TABLE IF NOT EXISTS souvenirs (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    owner VARCHAR(20) NOT NULL CHECK (owner IN ('なおき', 'まひろ')),
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_souvenirs_owner_sort ON souvenirs (owner, sort_order);

-- Enable Row Level Security
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Enable all operations for souvenirs" ON souvenirs
    FOR ALL USING (true);

-- Insert seed data
INSERT INTO souvenirs (text, is_checked, owner, sort_order) VALUES 
    ('🧴 韓国コスメ（CNP・イニスフリー）', FALSE, 'なおき', 1),
    ('🍯 蜂蜜バター・アーモンド', FALSE, 'なおき', 2),
    ('🍪 Market O ブラウニー', FALSE, 'なおき', 3),
    ('☕ 韓国インスタントコーヒー', FALSE, 'なおき', 4),
    ('💄 3CE・ROMAND コスメ', FALSE, 'まひろ', 1),
    ('🧴 メディヒール・ドクタージャルト', FALSE, 'まひろ', 2),
    ('🧸 LINE FRIENDS グッズ', FALSE, 'まひろ', 3),
    ('🍫 チョコパイ・ハニーバター', FALSE, 'まひろ', 4),
    ('👕 韓国ファッション小物', FALSE, 'まひろ', 5)
ON CONFLICT DO NOTHING;