-- ===========================================
-- AI图片生成器 - 简化的数据库表结构
-- 分步执行，便于调试
-- ===========================================

-- 第一步：启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 第二步：创建用户表
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

-- 第三步：创建短信验证码表
CREATE TABLE IF NOT EXISTS sms_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) DEFAULT 'login',
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 第四步：创建生成图片表
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    batch_id UUID,
    url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    style VARCHAR(100),
    parameters JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 第五步：创建基础索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_phone ON sms_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);

-- 验证表是否创建成功
SELECT 
    'users' as table_name, 
    COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
    'sms_verifications' as table_name, 
    COUNT(*) as record_count 
FROM sms_verifications
UNION ALL
SELECT 
    'generated_images' as table_name, 
    COUNT(*) as record_count 
FROM generated_images; 