'use client'

import { useState } from 'react'

interface User {
  id: string
  name: string
  phone: string
  provider: string
}

export default function TestAuthPage() {
  const [phone, setPhone] = useState('13800138000')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const sendCode = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          type: 'login'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ 验证码发送成功！请查看服务器控制台获取验证码')
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setMessage(`❌ 发送失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/login/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ 登录成功！')
        setUser(data.data.user)
        setCode('')
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setMessage(`❌ 登录失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ 获取用户信息成功！')
        setUser(data.data.user)
      } else {
        setMessage(`❌ ${data.error}`)
        setUser(null)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setMessage(`❌ 获取失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ 登出成功！')
        setUser(null)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setMessage(`❌ 登出失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            认证功能测试
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            开发模式 - 验证码会在服务器控制台显示
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* 用户状态显示 */}
          {user && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-800">当前用户</h3>
              <div className="mt-2 text-sm text-green-700">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>姓名:</strong> {user.name}</p>
                <p><strong>手机:</strong> {user.phone}</p>
                <p><strong>登录方式:</strong> {user.provider}</p>
              </div>
            </div>
          )}

          {/* 手机号输入 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              手机号
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="请输入手机号"
            />
          </div>

          {/* 验证码输入 */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              验证码
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="请输入验证码"
            />
          </div>

          {/* 按钮组 */}
          <div className="space-y-3">
            <button
              onClick={sendCode}
              disabled={loading || !phone}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? '发送中...' : '发送验证码'}
            </button>

            <button
              onClick={login}
              disabled={loading || !phone || !code}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? '登录中...' : '登录'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={getCurrentUser}
                disabled={loading}
                className="relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                获取用户信息
              </button>

              <button
                onClick={logout}
                disabled={loading || !user}
                className="relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
              >
                登出
              </button>
            </div>
          </div>

          {/* 消息显示 */}
          {message && (
            <div className={`mt-4 p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* 开发提示 */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800">开发模式提示</h4>
            <ul className="mt-2 text-xs text-blue-700 space-y-1">
              <li>• 验证码会在服务器控制台输出</li>
              <li>• 数据存储在内存中，重启后丢失</li>
              <li>• 测试手机号: 13800138000</li>
              <li>• 无需真实短信服务</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 