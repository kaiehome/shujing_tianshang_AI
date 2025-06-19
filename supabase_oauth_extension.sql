-- ===========================================
-- AI图片生成器 - 第三方登录扩展表结构
-- ===========================================

-- 第三方账户绑定表
CREATE TABLE IF NOT EXISTS user_oauth_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL, -- 'wechat', 'alipay', 'google', 'github' 等
    provider_user_id VARCHAR(100) NOT NULL, -- 第三方平台的用户ID
    provider_username VARCHAR(100), -- 第三方平台的用户名
    provider_email VARCHAR(255), -- 第三方平台的邮箱
    provider_avatar VARCHAR(500), -- 第三方平台的头像URL
    access_token TEXT, -- 访问令牌
    refresh_token TEXT, -- 刷新令牌
    token_expires_at TIMESTAMP WITH TIME ZONE, -- 令牌过期时间
    provider_data JSONB DEFAULT '{}', -- 第三方平台返回的完整用户数据
    is_verified BOOLEAN DEFAULT false, -- 是否已验证
    is_primary BOOLEAN DEFAULT false, -- 是否为主要登录方式
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 确保同一用户在同一平台只能绑定一个账户
    UNIQUE(user_id, provider),
    -- 确保同一平台的用户ID只能绑定一个用户
    UNIQUE(provider, provider_user_id)
);

-- OAuth状态表（用于防止CSRF攻击）
CREATE TABLE IF NOT EXISTS oauth_states (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(20) NOT NULL,
    nonce VARCHAR(255),
    redirect_uri TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 用户登录历史表
CREATE TABLE IF NOT EXISTS user_login_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_method VARCHAR(20) NOT NULL, -- 'phone', 'wechat', 'alipay' 等
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    location_info JSONB DEFAULT '{}', -- 地理位置信息
    is_successful BOOLEAN DEFAULT true,
    failure_reason TEXT, -- 失败原因
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 创建索引
-- ===========================================

-- OAuth账户索引
CREATE INDEX IF NOT EXISTS idx_user_oauth_accounts_user_id ON user_oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_oauth_accounts_provider ON user_oauth_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_user_oauth_accounts_provider_user_id ON user_oauth_accounts(provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_user_oauth_accounts_is_primary ON user_oauth_accounts(user_id, is_primary);

-- OAuth状态索引
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- 登录历史索引
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id ON user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_history_created_at ON user_login_history(created_at);
CREATE INDEX IF NOT EXISTS idx_user_login_history_login_method ON user_login_history(login_method);

-- ===========================================
-- 创建触发器
-- ===========================================

-- 为OAuth账户表添加更新时间触发器
CREATE TRIGGER update_user_oauth_accounts_updated_at BEFORE UPDATE ON user_oauth_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 创建RLS策略
-- ===========================================

-- 启用行级安全
ALTER TABLE user_oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;

-- OAuth账户访问策略
CREATE POLICY "Users can view own oauth accounts" ON user_oauth_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own oauth accounts" ON user_oauth_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own oauth accounts" ON user_oauth_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own oauth accounts" ON user_oauth_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- OAuth状态表（匿名用户可访问，用于登录流程）
CREATE POLICY "Allow anonymous access to oauth states" ON oauth_states
    FOR ALL USING (true);

-- 登录历史访问策略
CREATE POLICY "Users can view own login history" ON user_login_history
    FOR SELECT USING (auth.uid() = user_id);

-- ===========================================
-- 插入默认数据
-- ===========================================

-- 清理过期的OAuth状态记录的函数
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_states()
RETURNS void AS $$
BEGIN
    DELETE FROM oauth_states WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 创建定时清理任务（如果支持cron扩展）
-- SELECT cron.schedule('cleanup-oauth-states', '0 * * * *', 'SELECT cleanup_expired_oauth_states();');

-- ===========================================
-- 视图和统计
-- ===========================================

-- 用户OAuth绑定统计视图
CREATE OR REPLACE VIEW user_oauth_summary AS
SELECT 
    u.id as user_id,
    u.phone,
    u.email,
    u.nickname,
    array_agg(DISTINCT oa.provider) FILTER (WHERE oa.provider IS NOT NULL) as bound_providers,
    COUNT(DISTINCT oa.provider) as provider_count,
    u.created_at as user_created_at,
    MAX(oa.updated_at) as last_oauth_update
FROM users u
LEFT JOIN user_oauth_accounts oa ON u.id = oa.user_id
GROUP BY u.id, u.phone, u.email, u.nickname, u.created_at;

-- 登录方式统计视图
CREATE OR REPLACE VIEW login_method_stats AS
SELECT 
    login_method,
    COUNT(*) as total_logins,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE is_successful = true) as successful_logins,
    COUNT(*) FILTER (WHERE is_successful = false) as failed_logins,
    ROUND(
        COUNT(*) FILTER (WHERE is_successful = true) * 100.0 / COUNT(*), 
        2
    ) as success_rate
FROM user_login_history
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY login_method
ORDER BY total_logins DESC;

-- ===========================================
-- 辅助函数
-- ===========================================

-- 获取用户的主要OAuth账户
CREATE OR REPLACE FUNCTION get_user_primary_oauth(user_id_param UUID)
RETURNS TABLE(
    provider VARCHAR(20),
    provider_user_id VARCHAR(100),
    provider_username VARCHAR(100),
    provider_avatar VARCHAR(500)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oa.provider,
        oa.provider_user_id,
        oa.provider_username,
        oa.provider_avatar
    FROM user_oauth_accounts oa
    WHERE oa.user_id = user_id_param 
      AND oa.is_primary = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql; 