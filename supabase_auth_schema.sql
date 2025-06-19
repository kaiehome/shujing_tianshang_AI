-- 用户登录与账户管理数据库表结构

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100) NOT NULL,
    avatar TEXT,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('phone', 'wechat', 'alipay', 'email')),
    openid VARCHAR(100), -- 第三方平台用户唯一标识
    unionid VARCHAR(100), -- 微信UnionID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(50),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
    birthday DATE,
    location VARCHAR(100),
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 短信验证码表
CREATE TABLE IF NOT EXISTS sms_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('login', 'register', 'reset_password', 'bind_phone')),
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

-- 认证会话表
CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    device_info JSONB DEFAULT '{}'
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_sms_verifications_phone ON sms_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_type ON sms_verifications(type);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_is_used ON sms_verifications(is_used);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_expires_at ON sms_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_created_at ON sms_verifications(created_at);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_access_token ON auth_sessions(access_token);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_token ON auth_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);

-- RLS (Row Level Security) 策略

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 用户资料表策略
CREATE POLICY "Users can view own user_profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own user_profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own user_profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 短信验证码表策略（服务端操作，不需要RLS限制）
CREATE POLICY "Allow service operations on sms_verifications" ON sms_verifications
    FOR ALL USING (true);

-- 认证会话表策略
CREATE POLICY "Users can view own sessions" ON auth_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" ON auth_sessions
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 数据库函数

-- 增加短信验证尝试次数
CREATE OR REPLACE FUNCTION increment_sms_attempts(verification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE sms_verifications 
    SET attempts = attempts + 1 
    WHERE id = verification_id;
END;
$$ LANGUAGE plpgsql;

-- 清理过期的短信验证码
CREATE OR REPLACE FUNCTION cleanup_expired_sms_codes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sms_verifications 
    WHERE expires_at < NOW() OR is_used = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 清理过期的认证会话
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth_sessions 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 获取用户统计信息
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
    total_images INTEGER,
    favorite_images INTEGER,
    total_tags INTEGER,
    profile_completion NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE((SELECT COUNT(*)::INTEGER FROM generated_images WHERE user_id = user_uuid), 0) as total_images,
        COALESCE((SELECT COUNT(*)::INTEGER FROM favorite_images WHERE user_id = user_uuid), 0) as favorite_images,
        COALESCE((SELECT COUNT(*)::INTEGER FROM image_tags WHERE user_id = user_uuid), 0) as total_tags,
        CASE 
            WHEN up.nickname IS NOT NULL AND up.bio IS NOT NULL THEN 100.0
            WHEN up.nickname IS NOT NULL OR up.bio IS NOT NULL THEN 50.0
            ELSE 0.0
        END as profile_completion
    FROM user_profiles up 
    WHERE up.user_id = user_uuid
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 更新用户最后登录时间的触发器
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET last_login = NOW() WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_login
    AFTER INSERT ON auth_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_login();

-- 自动更新 updated_at 字段的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 定时清理任务（需要通过pg_cron扩展或外部调度器执行）
-- 每小时清理过期的短信验证码和会话
-- SELECT cron.schedule('cleanup-expired-data', '0 * * * *', 'SELECT cleanup_expired_sms_codes(); SELECT cleanup_expired_sessions();');

-- 插入默认数据

-- 创建默认的用户偏好设置
INSERT INTO user_profiles (id, user_id, preferences) VALUES 
    (uuid_generate_v4(), uuid_generate_v4(), '{
        "language": "zh-CN",
        "theme": "auto",
        "notifications": {
            "email": false,
            "sms": true,
            "push": true
        },
        "privacy": {
            "profile_public": false,
            "works_public": true
        }
    }')
ON CONFLICT DO NOTHING;

-- 授予必要的权限
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated; 