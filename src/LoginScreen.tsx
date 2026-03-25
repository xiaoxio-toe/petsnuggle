import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, User, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const demoAccounts = [
    { username: 'doudu_dad', password: '123456', nickname: '豆豆爹' },
    { username: 'mimi_mom', password: '123456', nickname: '咪咪妈' },
    { username: 'wangcai', password: '123456', nickname: '旺财主人' }
  ];

  const handleLogin = () => {
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    const account = demoAccounts.find(
      a => a.username === username && a.password === password
    );

    if (account) {
      localStorage.setItem('currentUser', JSON.stringify({
        id: demoAccounts.indexOf(account) + 1,
        username: account.username,
        nickname: account.nickname,
        avatar: `https://picsum.photos/seed/user${demoAccounts.indexOf(account) + 1}/200`
      }));
      onLogin(username);
    } else {
      setError('用户名或密码错误');
    }
  };

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    localStorage.setItem('currentUser', JSON.stringify({
      id: demoAccounts.indexOf(account) + 1,
      username: account.username,
      nickname: account.nickname,
      avatar: `https://picsum.photos/seed/user${demoAccounts.indexOf(account) + 1}/200`
    }));
    onLogin(account.username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-container to-secondary-container flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black font-headline text-primary tracking-tight">
              PetSnuggle
            </h1>
            <p className="text-on-surface-variant">宠物社交应用</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant">用户名</label>
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <User size={20} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="输入用户名"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="flex-1 bg-transparent outline-none text-on-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant">密码</label>
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <Lock size={20} className="text-stone-400" />
                <input
                  type="password"
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="flex-1 bg-transparent outline-none text-on-background"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full bg-primary text-white py-4 rounded-full font-headline font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            登录
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-on-surface-variant">快速登录</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {demoAccounts.map((account, idx) => (
              <motion.button
                key={account.username}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickLogin(account)}
                className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-2xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary-container overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/user${idx + 1}/100`}
                    alt={account.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-on-background text-center">
                  {account.nickname}
                </span>
              </motion.button>
            ))}
          </div>

          <p className="text-center text-xs text-on-surface-variant">
            演示账号密码均为 <span className="font-bold">123456</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
