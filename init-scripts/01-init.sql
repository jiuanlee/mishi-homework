-- 初始化数据库
-- 此脚本在容器首次启动时自动执行

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建密室表
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level INTEGER DEFAULT 1,
    estimated_time INTEGER, -- 分钟
    max_players INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建题目表
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    answer TEXT NOT NULL,
    hint TEXT,
    points INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建游戏记录表
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'playing', -- playing, completed, failed
    score INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建答题记录表
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_rooms_difficulty ON rooms(difficulty_level);
CREATE INDEX idx_questions_room_id ON questions(room_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_answers_session_id ON answers(session_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- 插入示例数据
INSERT INTO rooms (name, description, difficulty_level, estimated_time, max_players) VALUES
('神秘古堡', '探索中世纪古堡，解开古老谜题', 2, 30, 4),
('未来实验室', '高科技实验室中的逃脱挑战', 3, 45, 3),
('古墓探险', '深入古墓，寻找失落宝藏', 4, 60, 5);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为各表添加更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建监控视图
CREATE VIEW v_user_stats AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(DISTINCT gs.id) as total_games,
    COUNT(DISTINCT CASE WHEN gs.status = 'completed' THEN gs.id END) as completed_games,
    COALESCE(SUM(gs.score), 0) as total_score
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
GROUP BY u.id, u.username, u.email;

CREATE VIEW v_room_stats AS
SELECT 
    r.id,
    r.name,
    r.difficulty_level,
    COUNT(DISTINCT gs.id) as total_plays,
    COUNT(DISTINCT CASE WHEN gs.status = 'completed' THEN gs.id END) as completions,
    COALESCE(AVG(gs.score), 0) as avg_score
FROM rooms r
LEFT JOIN game_sessions gs ON r.id = gs.room_id
GROUP BY r.id, r.name, r.difficulty_level;

-- 授予权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mizhi_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mizhi_user;

COMMENT ON DATABASE mizhi_db IS '密室做题家应用数据库';
