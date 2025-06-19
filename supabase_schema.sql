-- ===========================================
-- AI图片生成器 - Supabase数据库表结构
-- ===========================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 用户相关表
-- ===========================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    nickname VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_vip BOOLEAN DEFAULT false,
    points INTEGER DEFAULT 0,
    total_generations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    real_name VARCHAR(100),
    gender VARCHAR(10),
    birthday DATE,
    location VARCHAR(200),
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 认证相关表
-- ===========================================

-- 短信验证码表
CREATE TABLE IF NOT EXISTS sms_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) DEFAULT 'login', -- login, register, reset_password, bind_phone
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户会话表
CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 图片生成相关表
-- ===========================================

-- 生成的图片表
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    batch_id UUID, -- 批次ID，同一次生成的图片共享
    url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    style VARCHAR(100),
    parameters JSONB DEFAULT '{}', -- 生成参数
    metadata JSONB DEFAULT '{}', -- 元数据
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 收藏图片表
CREATE TABLE IF NOT EXISTS favorite_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_id UUID REFERENCES generated_images(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, image_id)
);

-- 图片标签表
CREATE TABLE IF NOT EXISTS image_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- 图片标签关联表
CREATE TABLE IF NOT EXISTS image_tag_relations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_id UUID REFERENCES generated_images(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES image_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(image_id, tag_id)
);

-- ===========================================
-- 支付和订阅相关表
-- ===========================================

-- 点数购买记录表
CREATE TABLE IF NOT EXISTS point_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    points INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CNY',
    payment_method VARCHAR(20), -- alipay, wechat, stripe
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_data JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点数使用记录表
CREATE TABLE IF NOT EXISTS point_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- purchase, consume, refund, gift
    amount INTEGER NOT NULL, -- 正数为增加，负数为消费
    description TEXT,
    related_id UUID, -- 关联的订单ID或图片ID
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 创建索引
-- ===========================================

-- 用户相关索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 认证相关索引
CREATE INDEX IF NOT EXISTS idx_sms_verifications_phone ON sms_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_expires_at ON sms_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(session_token);

-- 图片相关索引
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_batch_id ON generated_images(batch_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at);
CREATE INDEX IF NOT EXISTS idx_favorite_images_user_id ON favorite_images(user_id);

-- 支付相关索引
CREATE INDEX IF NOT EXISTS idx_point_purchases_user_id ON point_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_point_purchases_order_id ON point_purchases(order_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);

-- ===========================================
-- 创建更新时间触发器
-- ===========================================

-- 创建更新时间函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_images_updated_at BEFORE UPDATE ON generated_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 创建RLS (Row Level Security) 策略
-- ===========================================

-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own images" ON generated_images
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON favorite_images
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tags" ON image_tags
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tag relations" ON image_tag_relations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM generated_images 
            WHERE id = image_tag_relations.image_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own purchases" ON point_purchases
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON point_transactions
    FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- 插入默认数据
-- ===========================================

-- 插入默认图片标签
INSERT INTO image_tags (id, user_id, name, color) VALUES
    ('00000000-0000-0000-0000-000000000001', NULL, '肖像', '#EF4444'),
    ('00000000-0000-0000-0000-000000000002', NULL, '风景', '#10B981'),
    ('00000000-0000-0000-0000-000000000003', NULL, '动物', '#F59E0B'),
    ('00000000-0000-0000-0000-000000000004', NULL, '建筑', '#3B82F6'),
    ('00000000-0000-0000-0000-000000000005', NULL, '抽象', '#8B5CF6')
ON CONFLICT (user_id, name) DO NOTHING; 