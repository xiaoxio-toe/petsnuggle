/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginScreen } from './LoginScreen';
import { PublishPostScreen } from './PublishPostScreen';
import {
  Search,
  Bell,
  Map as MapIcon,
  Heart,
  User,
  PawPrint,
  Filter,
  Navigation,
  Plus,
  MessageCircle,
  X,
  MoreHorizontal,
  Share2,
  Camera,
  CalendarCheck,
  Edit3,
  Footprints,
  Compass,
  ChevronRight,
  Star,
  MapPin,
  Settings,
  LogOut,
  UserPlus
} from 'lucide-react';

// --- Types ---
type Screen = 'home' | 'map' | 'match' | 'profile' | 'chat' | 'chatDetail' | 'otherProfile' | 'checkIn' | 'postDetail' | 'publishPost';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread?: number;
}

// --- Components ---

const TopBar = ({
                  onSearch,
                  onSettings,
                  onCheckIn,
                  currentScreen
                }: {
  onSearch: () => void,
  onSettings: () => void,
  onCheckIn: () => void,
  currentScreen: Screen
}) => (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm shadow-primary/5 flex justify-between items-center px-6 py-4">
      <button
          onClick={onSearch}
          className="text-stone-400 hover:bg-primary/10 p-2 rounded-full transition-all active:scale-90"
      >
        <Search size={20} />
      </button>
      <h1 className="text-2xl font-black text-primary italic font-headline tracking-tight">PetSnuggle</h1>
      <div className="flex items-center gap-1">
        {currentScreen === 'profile' ? (
            <button
                onClick={onSettings}
                className="text-stone-400 hover:bg-primary/10 p-2 rounded-full transition-all active:scale-90"
            >
              <Settings size={20} />
            </button>
        ) : (
            <>
              <button
                  onClick={onCheckIn}
                  className="text-stone-400 hover:bg-primary/10 p-2 rounded-full transition-all active:scale-90"
              >
                <CalendarCheck size={20} />
              </button>
              <button className="text-stone-400 hover:bg-primary/10 p-2 rounded-full transition-all active:scale-90">
                <Bell size={20} />
              </button>
            </>
        )}
      </div>
    </header>
);

const SettingsOverlay = ({
                           isOpen,
                           onClose,
                           profile,
                           setProfile,
                           achievements,
                           setAchievements
                         }: {
  isOpen: boolean,
  onClose: () => void,
  profile: any,
  setProfile: any,
  achievements: any[],
  setAchievements: any
}) => {
  const handleEditAchievement = (id: number) => {
    const currentName = achievements.find(a => a.id === id)?.name;
    const newName = prompt('请输入新的成就名称：', currentName);
    if (newName && newName.trim()) {
      setAchievements(achievements.map(a => a.id === id ? { ...a, name: newName.trim() } : a));
    }
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('currentUser');
      window.location.reload();
    }
  };

  const handleSwitchAccount = () => {
    const accounts = [
      { username: 'doudu_dad', nickname: '豆豆爹', id: 1 },
      { username: 'mimi_mom', nickname: '咪咪妈', id: 2 },
      { username: 'wangcai', nickname: '旺财主人', id: 3 }
    ];
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentIndex = accounts.findIndex(a => a.username === currentUser.username);
    const nextIndex = (currentIndex + 1) % accounts.length;
    const nextAccount = accounts[nextIndex];
    
    localStorage.setItem('currentUser', JSON.stringify({
      id: nextAccount.id,
      username: nextAccount.username,
      nickname: nextAccount.nickname,
      avatar: `https://picsum.photos/seed/user${nextAccount.id}/200`
    }));
    window.location.reload();
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[150] bg-surface flex flex-col"
            >
              <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-primary/5">
                <h2 className="text-xl font-black font-headline text-on-background">设置</h2>
                <button onClick={onClose} className="text-stone-400 p-2 hover:bg-primary/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {/* Profile Edit Section */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">个人信息修改</h3>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 space-y-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group">
                        <div className="w-24 h-24 organic-shape bg-primary-container overflow-hidden">
                          <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform">
                          <Camera size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-stone-400">点击更换头像</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-400 ml-1">昵称</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-400 ml-1">个性签名</label>
                        <textarea
                            rows={3}
                            value={profile.signature}
                            onChange={(e) => setProfile({...profile, signature: e.target.value})}
                            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Achievements Section */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">成就管理</h3>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/5 divide-y divide-primary/5">
                    {achievements.map((badge) => (
                        <div key={badge.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Star size={16} fill="currentColor" />
                            </div>
                            <span className="text-sm font-bold text-on-background">{badge.name}</span>
                          </div>
                          <button
                              onClick={() => handleEditAchievement(badge.id)}
                              className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full active:scale-90 transition-transform"
                          >
                            修改
                          </button>
                        </div>
                    ))}
                  </div>
                </section>

                {/* Account Section */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">账号管理</h3>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5">
                    <button
                        onClick={handleSwitchAccount}
                        className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors text-on-background"
                    >
                      <UserPlus size={20} className="text-stone-400" />
                      <span className="text-sm font-bold">切换账号</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors text-red-500 border-t border-primary/5"
                    >
                      <LogOut size={20} />
                      <span className="text-sm font-bold">退出登录</span>
                    </button>
                  </div>
                </section>
              </div>

              <div className="p-6 bg-white border-t border-primary/5">
                <button
                    onClick={() => {
                      alert('设置已保存');
                      onClose();
                    }}
                    className="w-full bg-primary text-white py-4 rounded-full font-headline font-black tracking-wide shadow-lg active:scale-95 transition-all"
                >
                  保存修改
                </button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

const SearchOverlay = ({ isOpen, onClose, setScreen, setSelectedOtherPet }: { isOpen: boolean, onClose: () => void, setScreen: (s: Screen) => void, setSelectedOtherPet: (p: any) => void }) => {
  const [query, setQuery] = useState('');
  const results = [
    { id: 1, name: '金毛豆豆', type: '狗狗', dist: '200m', pet: { id: 1, name: '豆豆', age: '1岁', breed: '柯基', img: 'https://picsum.photos/seed/pet1/200/200', bio: '虽然腿短，但我跑得快！' } },
    { id: 2, name: '大橘为重', type: '猫咪', dist: '500m', pet: { id: 2, name: '大橘', age: '2岁', breed: '橘猫', img: 'https://picsum.photos/seed/cat1/200/200', bio: '我是大橘，为橘猫代言！' } },
    { id: 3, name: '静安雕塑公园', type: '地点', dist: '1.2km' },
  ].filter(r => r.name.includes(query));

  const handleResultClick = (result: any) => {
    if (result.type === '地点') {
      setScreen('map');
    } else {
      setSelectedOtherPet(result.pet);
      setScreen('otherProfile');
    }
    onClose();
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-[100] bg-white p-6 pt-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 bg-surface-container-low rounded-full px-4 py-3 flex items-center gap-3">
                  <Search size={20} className="text-stone-400" />
                  <input
                      autoFocus
                      placeholder="搜索宠物、地点或好友..."
                      className="bg-transparent border-none outline-none flex-1 text-on-background font-medium"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button onClick={onClose} className="text-primary font-bold">取消</button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">搜索结果</h3>
                <div className="space-y-4">
                  {results.map(r => (
                      <button
                          key={r.id}
                          onClick={() => handleResultClick(r)}
                          className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-container/20 rounded-full flex items-center justify-center text-primary">
                            {r.type === '地点' ? <MapPin size={20} /> : <PawPrint size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-on-background">{r.name}</p>
                            <p className="text-xs text-stone-400">{r.type} · {r.dist}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-stone-300" />
                      </button>
                  ))}
                  {query && results.length === 0 && (
                      <p className="text-center text-stone-400 py-10 italic">没有找到相关结果 🐾</p>
                  )}
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

const ChatList = ({ onSelectChat }: { onSelectChat: (id: number) => void }) => {
  const conversations: Conversation[] = [
    { id: 1, name: '豆豆爹', lastMessage: '明天下午带豆豆去公园吗？', time: '14:20', avatar: 'https://picsum.photos/seed/owner1/100/100', unread: 2 },
    { id: 2, name: '芝麻糊的主人', lastMessage: '哈哈，它真的很爱吃那个罐头', time: '昨天', avatar: 'https://picsum.photos/seed/owner2/100/100' },
    { id: 3, name: '阿黄训练营', lastMessage: '接球训练完成得非常棒！', time: '周一', avatar: 'https://picsum.photos/seed/owner3/100/100' },
  ];

  return (
      <div className="px-4 py-6 space-y-6">
        <h2 className="text-2xl font-black font-headline text-on-background">消息列表</h2>
        <div className="space-y-2">
          {conversations.map(c => (
              <button
                  key={c.id}
                  onClick={() => onSelectChat(c.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 rounded-2xl transition-all active:scale-[0.98]"
              >
                <div className="relative">
                  <div className="w-14 h-14 organic-shape bg-primary-container overflow-hidden">
                    <img src={c.avatar} className="w-full h-full object-cover" alt={c.name} referrerPolicy="no-referrer" />
                  </div>
                  {c.unread && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {c.unread}
                      </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-on-background">{c.name}</h3>
                    <span className="text-[10px] text-stone-400 font-medium">{c.time}</span>
                  </div>
                  <p className="text-sm text-stone-400 truncate">{c.lastMessage}</p>
                </div>
              </button>
          ))}
        </div>
      </div>
  );
};

const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const navItems: { id: Screen, icon: any, label: string }[] = [
    { id: 'home', icon: PawPrint, label: 'Home' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'match', icon: Heart, label: 'Match' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-white/80 backdrop-blur-2xl rounded-t-[40px] border-t border-primary/10 shadow-[0_-8px_32px_rgba(145,71,9,0.06)]">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const Icon = item.icon;
          return (
              <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`flex flex-col items-center justify-center transition-all duration-300 ${
                      isActive
                          ? 'bg-primary-container/20 text-primary rounded-[24px] px-5 py-2 scale-110 animate-bounce-short'
                          : 'text-stone-400 px-4 py-2 hover:text-primary'
                  }`}
              >
                <Icon size={24} fill={isActive ? "currentColor" : "none"} />
                <span className="font-body text-[11px] font-semibold uppercase tracking-widest mt-1">{item.label}</span>
              </button>
          );
        })}
      </nav>
  );
};

// --- Screens ---

const HomeScreen = ({ onChat, setScreen, setSelectedOtherPet, setSelectedPost }: { onChat: () => void, setScreen: (s: Screen) => void, setSelectedOtherPet: (p: any) => void, setSelectedPost: (p: any) => void }) => {
  const stories = [
    { id: 1, name: '大橘', img: 'https://picsum.photos/seed/cat1/200/200', breed: '橘猫', age: '2岁', bio: '我是大橘，为橘猫代言！' },
    { id: 2, name: '豆豆', img: 'https://picsum.photos/seed/dog1/200/200', breed: '柯基', age: '1岁', bio: '虽然腿短，但我跑得快！' },
    { id: 3, name: '阿黄', img: 'https://picsum.photos/seed/dog2/200/200', breed: '中华田园犬', age: '3岁', bio: '我很乖，也很听话。' },
    { id: 4, name: '球球', img: 'https://picsum.photos/seed/dog3/200/200', breed: '博美', age: '2岁', bio: '我是球球，最爱玩球！' },
    { id: 5, name: '咪咪', img: 'https://picsum.photos/seed/cat2/200/200', breed: '美短', age: '1岁', bio: '喵喵喵～' },
  ];

  const posts = [
    {
      id: 1,
      owner: '芝麻糊的主人',
      ownerAvatar: 'https://picsum.photos/seed/owner1/100/100',
      location: '在静安公园打卡',
      img: 'https://picsum.photos/seed/catpost/800/600',
      tags: ['#猫咪日常', '#午睡时光'],
      likes: 128,
      pet: {
        name: '芝麻糊',
        age: '2岁',
        breed: '英短',
        img: 'https://picsum.photos/seed/catpost/800/600',
        bio: '我是一只爱睡觉的芝麻糊。'
      }
    },
    {
      id: 2,
      owner: '豆豆爹',
      ownerAvatar: 'https://picsum.photos/seed/owner2/100/100',
      location: '在宠物咖啡厅',
      img: 'https://picsum.photos/seed/dogpost/800/600',
      tags: ['#柯基', '#可爱'],
      likes: 95,
      pet: {
        name: '豆豆',
        age: '1岁',
        breed: '柯基',
        img: 'https://picsum.photos/seed/dogpost/800/600',
        bio: '虽然腿短，但我跑得快！'
      }
    },
    {
      id: 3,
      owner: '阿黄主子',
      ownerAvatar: 'https://picsum.photos/seed/owner3/100/100',
      location: '在草坪上',
      img: 'https://picsum.photos/seed/dogpost2/800/600',
      tags: ['#阿黄', '#阳光'],
      likes: 72,
      pet: {
        name: '阿黄',
        age: '3岁',
        breed: '中华田园犬',
        img: 'https://picsum.photos/seed/dogpost2/800/600',
        bio: '我很乖，也很听话。'
      }
    },
    {
      id: 4,
      owner: '球球妈',
      ownerAvatar: 'https://picsum.photos/seed/owner4/100/100',
      location: '在家里',
      img: 'https://picsum.photos/seed/dogpost3/800/600',
      tags: ['#博美', '#球球'],
      likes: 110,
      pet: {
        name: '球球',
        age: '2岁',
        breed: '博美',
        img: 'https://picsum.photos/seed/dogpost3/800/600',
        bio: '我是球球，最爱玩球！'
      }
    }
  ];

  const handleStoryClick = (s: any) => {
    setSelectedOtherPet(s);
    setScreen('otherProfile');
  };

  const handleCameraClick = () => {
    // Simulate opening camera/upload
    alert('正在打开相机... 📸');
  };

  return (
      <div className="space-y-8 pb-20">
        {/* Stories */}
        <section className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-4">
          {stories.map(s => (
              <motion.div
                  whileTap={{ scale: 0.9 }}
                  key={s.id}
                  className="flex-none text-center space-y-2 cursor-pointer"
                  onClick={() => handleStoryClick(s)}
              >
                <div className="w-20 h-20 bg-primary-container p-1 shadow-md" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                  <img src={s.img} className="w-full h-full object-cover" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} alt={s.name} referrerPolicy="no-referrer" />
                </div>
                <span className="text-[10px] font-bold font-headline text-on-surface-variant">{s.name}</span>
              </motion.div>
          ))}
          <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex-none text-center space-y-2 cursor-pointer"
              onClick={() => setScreen('checkIn')}
          >
            <div className="w-20 h-20 bg-surface-container-high flex items-center justify-center shadow-sm" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
              <Plus size={30} className="text-primary" />
            </div>
            <span className="text-[10px] font-bold font-headline text-on-surface-variant">我的日常</span>
          </motion.div>
        </section>

        {/* Feed - 2 Column Grid */}
        <section className="grid grid-cols-2 gap-4 px-4">
          {posts.map(post => (
              <motion.article
                  key={post.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-primary/5 cursor-pointer flex flex-col"
                  onClick={() => {
                    setSelectedPost(post);
                    setScreen('postDetail');
                  }}
              >
                <div className="p-3 flex items-center gap-2">
                  <div
                      className="w-8 h-8 organic-shape bg-primary-container overflow-hidden shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOtherPet(post.pet);
                        setScreen('otherProfile');
                      }}
                  >
                    <img src={post.ownerAvatar} className="w-full h-full object-cover" alt="Owner" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] font-headline font-bold text-on-background truncate">{post.owner}</h3>
                    <p className="text-[8px] text-on-surface-variant flex items-center gap-0.5 truncate">
                      <MapPin size={8} /> {post.location}
                    </p>
                  </div>
                </div>
                <div className="relative aspect-square">
                  <img src={post.img} className="w-full h-full object-cover" alt="Post" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {post.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="bg-black/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[8px] font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary">
                    <PawPrint size={14} fill="currentColor" />
                    <span className="text-[10px] font-bold">{post.likes}</span>
                  </div>
                  <button className="text-stone-400"><MoreHorizontal size={14} /></button>
                </div>
              </motion.article>
          ))}
        </section>

        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCameraClick}
            className="fixed right-6 bottom-28 w-16 h-16 bg-primary-container text-white rounded-full shadow-lg flex items-center justify-center z-40 animate-bounce-short"
        >
          <Camera size={30} />
        </motion.button>
      </div>
  );
};

const PostDetailScreen = ({ post, onBack, onChat }: { post: any, onBack: () => void, onChat: () => void }) => {
  const [liked, setLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const comments = [
    { id: 1, user: '豆豆爹', avatar: 'https://picsum.photos/seed/commenter/50/50', text: '今天的大橘看起来格外有精神呢！是不是偷吃了罐头？✨', time: '10分钟前' },
    { id: 2, user: '球球妈', avatar: 'https://picsum.photos/seed/commenter2/50/50', text: '这个公园环境真不错，下次带球球也去打卡！🐾', time: '25分钟前' },
    { id: 3, user: '阿黄主子', avatar: 'https://picsum.photos/seed/commenter3/50/50', text: '芝麻糊的主人，求分享摄影技巧！📸', time: '1小时前' },
  ];

  if (!post) return null;

  return (
      <div className="fixed inset-0 z-[150] bg-surface overflow-y-auto pb-32 no-scrollbar">
        {/* Lightbox Overlay */}
        <AnimatePresence>
          {isZoomed && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsZoomed(false)}
                  className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
              >
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    src={post.img}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    alt="Zoomed Post"
                    referrerPolicy="no-referrer"
                />
              </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-primary/5">
          <button onClick={onBack} className="text-stone-400 p-2"><ChevronRight className="rotate-180" /></button>
          <h3 className="font-bold text-on-background">动态详情</h3>
        </div>

        <div className="pt-20">
          <article className="bg-white">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 organic-shape bg-primary-container overflow-hidden">
                  <img src={post.ownerAvatar} className="w-full h-full object-cover" alt="Owner" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-background">{post.owner}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <MapPin size={12} /> {post.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="cursor-zoom-in" onClick={() => setIsZoomed(true)}>
              <img
                  src={post.img}
                  className="w-full h-auto object-cover"
                  alt="Post"
                  referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                      onClick={() => setLiked(!liked)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all active:scale-90 font-bold ${
                          liked ? 'bg-primary text-white shadow-lg' : 'bg-[#FFF9F0] text-[#D4A373]'
                      }`}
                  >
                    <PawPrint size={18} fill={liked ? "currentColor" : "none"} />
                    <span className="text-sm">{liked ? '已点赞' : '点赞'}</span>
                  </button>
                  <button
                      onClick={onChat}
                      className="bg-[#D4A373] text-white px-8 py-2.5 text-sm font-bold rounded-full flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
                  >
                    <MessageCircle size={18} /> 聊天
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                  <h4 className="font-bold text-on-background">评论 (3)</h4>
                  <button
                      onClick={() => alert('分享成功！✨')}
                      className="text-[#D4A373] hover:bg-[#D4A373]/10 p-2 rounded-full transition-colors"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
                {comments.map(c => (
                    <div key={c.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 organic-shape bg-surface-container-high shrink-0 overflow-hidden">
                        <img src={c.avatar} className="w-full h-full object-cover" alt="User" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-secondary-container/10 p-4 rounded-2xl text-sm leading-relaxed relative">
                          <span className="font-bold block mb-1">{c.user}:</span>
                          {c.text}
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1 block ml-2">{c.time}</span>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl p-4 border-t border-primary/5 flex gap-3 z-[160]">
          <input
              placeholder="说点什么吧..."
              className="flex-1 bg-[#FFF9F0] px-6 py-3 rounded-full text-sm outline-none border border-transparent focus:border-[#D4A373]/20 transition-all text-on-background"
          />
          <button className="bg-[#8B4513] text-white px-8 py-3 rounded-full font-bold text-sm active:scale-95 transition-all shadow-md">发送</button>
        </div>
      </div>
  );
};

const MapScreen = ({ onChat }: { onChat: () => void }) => {
  return (
      <div className="relative h-full w-full overflow-hidden">
        {/* Simulated Map */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface to-secondary-container/20">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-container/20 rounded-full blur-[80px]" />

          {/* Markers */}
          <div className="absolute top-[35%] left-[25%] group cursor-pointer">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg transform group-hover:scale-110 transition-all">
                <img src="https://picsum.photos/seed/pet1/100/100" className="w-full h-full object-cover" alt="Pet" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-2 border-white">
                <PawPrint size={12} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="absolute top-[45%] left-[60%] group cursor-pointer text-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary transform group-hover:-translate-y-2 transition-all">
              <Navigation size={24} fill="currentColor" />
            </div>
            <div className="mt-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold shadow-sm">汪汪公园</div>
          </div>
        </div>

        {/* UI Overlays */}
        <div className="absolute top-4 left-4 right-4 flex gap-2">
          <div className="flex-1 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-full shadow-sm flex items-center gap-3 border border-primary/5">
            <MapPin size={18} className="text-primary" />
            <span className="text-sm font-medium text-on-surface-variant">附近热门：静安雕塑公园</span>
          </div>
          <button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <Filter size={20} />
          </button>
        </div>

        <button className="absolute bottom-32 right-6 bg-primary text-white px-6 py-4 rounded-full flex items-center gap-2 shadow-xl font-headline font-bold active:scale-95 transition-all">
          <MapPin size={20} />
          <span>偶遇打卡</span>
        </button>

        {/* Detail Popup */}
        <div className="absolute bottom-28 left-6 right-6 z-40">
          <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/95 backdrop-blur-2xl rounded-xl p-5 shadow-2xl flex flex-col gap-4 border border-white/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-surface-container-low organic-shape overflow-hidden">
                  <img src="https://picsum.photos/seed/doudou/200/200" className="w-full h-full object-cover" alt="Pet" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-headline font-extrabold text-on-background">豆豆 (2岁)</h2>
                    <span className="bg-tertiary-container text-tertiary text-[10px] px-2 py-0.5 rounded-full font-bold">金毛猎犬</span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                    <Navigation size={14} /> 距离 200m · 刚刚活跃
                  </p>
                </div>
              </div>
              <button className="text-stone-300"><X size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['# 社交达狗', '# 爱玩球', '# 温柔性格'].map(tag => (
                  <span key={tag} className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">{tag}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Heart size={18} fill="currentColor" /> 汪一下
              </button>
              <button onClick={onChat} className="w-14 h-14 bg-secondary-container text-on-background rounded-full flex items-center justify-center shadow-md active:scale-[0.98] transition-all">
                <MessageCircle size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

const MatchScreen = ({ setScreen, setSelectedOtherPet }: { setScreen: (s: Screen) => void, setSelectedOtherPet: (p: any) => void }) => {
  const [selectedPet, setSelectedPet] = useState<any>(null);

  const pets = [
    { id: 1, name: '可乐', age: '2岁', breed: '金毛寻回犬', dist: '2.5km', img: 'https://picsum.photos/seed/pet1/400/500', gender: '♂', tags: ['活泼', '粘人'], bio: '我是一只超级爱笑的大暖男，最喜欢在草地上奔跑接飞盘了。希望能遇到志同道合的小伙伴！', owner: { name: '可乐爸', avatar: 'https://picsum.photos/seed/owner1/100/100' } },
    { id: 2, name: '豆豆', age: '1岁', breed: '柯基', dist: '1.2km', img: 'https://picsum.photos/seed/pet2/400/500', gender: '♀', tags: ['短腿', '贪吃'], bio: '虽然腿短，但我跑得快！最爱吃肉肉，希望能找个一起干饭的小伙伴。', owner: { name: '豆豆爹', avatar: 'https://picsum.photos/seed/owner2/100/100' } },
    { id: 3, name: '球球', age: '3岁', breed: '萨摩耶', dist: '3.8km', img: 'https://picsum.photos/seed/pet3/400/500', gender: '♂', tags: ['微笑天使'], bio: '我是大家的开心果，性格温顺，希望能交到好朋友。', owner: { name: '球球妈', avatar: 'https://picsum.photos/seed/owner3/100/100' } },
    { id: 4, name: '糯米', age: '1.5岁', breed: '比熊', dist: '0.8km', img: 'https://picsum.photos/seed/pet4/400/500', gender: '♀', tags: ['粘人', '爱叫'], bio: '我是一朵小白云，最喜欢主人的抱抱，也喜欢和别的小狗玩。', owner: { name: '糯米酱', avatar: 'https://picsum.photos/seed/owner4/100/100' } },
    { id: 5, name: '大黄', age: '4岁', breed: '中华田园犬', dist: '5.2km', img: 'https://picsum.photos/seed/pet5/400/500', gender: '♂', tags: ['忠诚', '看家'], bio: '我很乖，也很听话，希望能有个家，或者能经常出来玩的小伙伴。', owner: { name: '大黄哥', avatar: 'https://picsum.photos/seed/owner5/100/100' } },
    { id: 6, name: '雪糕', age: '1岁', breed: '哈士奇', dist: '2.1km', img: 'https://picsum.photos/seed/pet6/400/500', gender: '♀', tags: ['拆家', '二哈'], bio: '我是拆迁办主任，你准备好了吗？让我们一起拆...啊不，一起玩！', owner: { name: '雪糕姐', avatar: 'https://picsum.photos/seed/owner6/100/100' } },
  ];

  const handleOwnerClick = (e: React.MouseEvent, pet: any) => {
    e.stopPropagation();
    setSelectedOtherPet(pet);
    setScreen('otherProfile');
  };

  return (
      <div className="h-full bg-surface-container-low overflow-y-auto pb-32 px-4 pt-4 no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {pets.map(pet => (
              <motion.div
                  key={pet.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPet(pet)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={pet.img} className="w-full h-full object-cover" alt={pet.name} referrerPolicy="no-referrer" />
                  <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md p-1.5 rounded-full text-white">
                    <Heart size={14} />
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {pet.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="bg-secondary-container/90 text-[10px] text-on-background px-2 py-0.5 rounded-full font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-bold text-sm text-on-surface truncate">{pet.name}, {pet.age}</h3>
                    <span className={`text-[10px] font-bold ${pet.gender === '♂' ? 'text-blue-500' : 'text-pink-500'}`}>{pet.gender}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium truncate">{pet.breed} · {pet.dist}</p>

                  <div
                      className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-surface-container transition-colors"
                      onClick={(e) => handleOwnerClick(e, pet)}
                  >
                    <img src={pet.owner.avatar} className="w-5 h-5 rounded-full object-cover" alt="Owner" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-on-surface-variant font-bold truncate">{pet.owner.name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-primary/5">
                    <button
                        onClick={(e) => { e.stopPropagation(); alert(`已点赞 ${pet.name}`); }}
                        className="text-primary/60 hover:text-primary transition-colors p-1"
                    >
                      <Heart size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); alert(`已收藏 ${pet.name}`); }}
                        className="text-amber-500/60 hover:text-amber-500 transition-colors p-1"
                    >
                      <Star size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedPet && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                  onClick={() => setSelectedPet(null)}
              >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                  <div className="relative h-[300px]">
                    <img src={selectedPet.img} className="w-full h-full object-cover" alt={selectedPet.name} referrerPolicy="no-referrer" />
                    <button
                        onClick={() => setSelectedPet(null)}
                        className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {selectedPet.tags.map((tag: string) => (
                          <span key={tag} className="bg-secondary-container/90 text-on-background px-3 py-1 rounded-full text-xs font-bold font-headline">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black font-headline text-on-surface">{selectedPet.name}, {selectedPet.age}</h2>
                        <p className="text-on-surface-variant font-medium">{selectedPet.breed} · {selectedPet.dist}</p>
                      </div>
                      <span className={`text-xl font-bold ${selectedPet.gender === '♂' ? 'text-blue-500' : 'text-pink-500'}`}>{selectedPet.gender}</span>
                    </div>
                    <p className="text-on-surface-variant text-sm italic leading-relaxed">“{selectedPet.bio}”</p>
                    <div className="flex gap-4 pt-2">
                      <button
                          onClick={() => alert(`已点赞 ${selectedPet.name}`)}
                          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        <Heart size={18} fill="currentColor" />
                        点赞
                      </button>
                      <button
                          onClick={() => alert(`已特别关注 ${selectedPet.name}`)}
                          className="flex-1 bg-secondary-container text-on-background py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        <Star size={18} fill="currentColor" />
                        特别关注
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

const ProfileScreen = ({ profile, achievements, setScreen }: { profile: any, achievements: any[], setScreen: (s: Screen) => void }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCities, setShowCities] = useState(false);

  const badges = [
    { id: 1, label: achievements[0]?.name || '遛狗达人', icon: Footprints, color: 'bg-primary-container/20', text: 'text-primary', desc: '累计遛狗超过 50 公里' },
    { id: 2, label: achievements[1]?.name || '公园探险家', icon: Compass, color: 'bg-secondary-container/20', text: 'text-secondary', desc: '打卡超过 10 个不同的公园' },
    { id: 3, label: achievements[2]?.name || '拆家小能手', icon: PawPrint, color: 'bg-tertiary-container/20', text: 'text-tertiary', desc: '成功破坏了 5 个以上的玩具' },
  ];

  const dynamics = [
    { id: 1, img: 'https://picsum.photos/seed/dynamic1/600/800', date: '3月20日', content: '今天在公园玩得好开心！☀️', likes: 24 },
    { id: 2, img: 'https://picsum.photos/seed/dynamic2/600/600', date: '3月18日', content: '新买的玩具，不到十分钟就拆了... 😂', likes: 18 },
  ];

  const cities = [
    { name: '上海', count: 12, icon: '🏙️' },
    { name: '杭州', count: 5, icon: '🍵' },
    { name: '苏州', count: 3, icon: '🎋' },
    { name: '南京', count: 2, icon: '🏯' },
    { name: '无锡', count: 1, icon: '🌊' },
  ];

  const handleUpdateDynamic = () => {
    // 这个函数现在由父组件处理
  };

  const handleBadgeClick = (label: string, desc: string) => {
    alert(`【${label}】\n${desc}`);
  };

  const handleMapClick = () => {
    alert('正在加载足迹详情... 🗺️\n你已经走遍了静安区的 5 个公园！');
  };

  const handleViewAllCities = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCities(true);
  };

  return (
      <div className="pb-32 px-4 space-y-8">
        {/* Image Zoom Modal */}
        <AnimatePresence>
          {selectedImage && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedImage(null)}
                  className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
              >
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    src={selectedImage}
                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                    alt="Zoomed"
                    referrerPolicy="no-referrer"
                />
                <button className="absolute top-10 right-10 text-white p-2 bg-white/10 rounded-full backdrop-blur-md">
                  <X size={24} />
                </button>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Cities Visited Modal */}
        <AnimatePresence>
          {showCities && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                  onClick={() => setShowCities(false)}
              >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                      <h3 className="font-headline font-bold text-xl">已点亮城市</h3>
                      <p className="text-xs opacity-80 mt-1">奶酪的足迹遍布了 {cities.length} 个城市</p>
                    </div>
                    <button onClick={() => setShowCities(false)} className="bg-white/20 p-2 rounded-full">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {cities.map((city, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-primary/5">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{city.icon}</span>
                            <div>
                              <p className="font-headline font-bold text-on-surface">{city.name}</p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">打卡 {city.count} 次</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                    ))}
                  </div>
                  <div className="p-6 bg-stone-50 text-center">
                    <p className="text-xs text-on-surface-variant italic">"世界那么大，我想带奶酪去看看 🌍"</p>
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>

        <section className="bg-white p-8 rounded-xl flex flex-col items-center gap-4 relative shadow-sm mt-10">
          <div className="relative -mt-20">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(profile.avatar)}
                className="w-32 h-32 organic-shape bg-primary-container p-1 overflow-hidden shadow-lg transform rotate-3 cursor-pointer"
            >
              <img src={profile.avatar} className="w-full h-full object-cover organic-shape" alt="Profile" referrerPolicy="no-referrer" />
            </motion.div>
            <div className="absolute bottom-0 right-0 bg-secondary-container text-on-background px-3 py-1 rounded-full font-headline font-bold text-xs shadow-md">
              LV.12
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-headline font-extrabold text-3xl text-on-background tracking-tight">{profile.name}</h1>
            <p className="text-on-surface-variant font-medium text-sm mt-1">金毛寻回犬 · 2岁</p>
            <div className="mt-3 inline-flex items-center gap-1 bg-tertiary-container text-tertiary px-4 py-1.5 rounded-full font-headline font-bold text-sm">
              <Star size={14} fill="currentColor" /> 社交达人
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg italic text-on-surface-variant leading-relaxed text-center relative max-w-xs">
            "{profile.signature}"
          </div>
        </section>

        <section>
          <h2 className="font-headline font-bold text-xl px-2 mb-4 flex items-center gap-2">
            成就徽章
            <span className="h-px flex-1 bg-surface-container-highest" />
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {badges.map(badge => (
                <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBadgeClick(badge.label, badge.desc)}
                    key={badge.id}
                    className="flex-shrink-0 bg-white p-4 rounded-lg flex flex-col items-center gap-2 w-32 border border-primary/5 cursor-pointer transition-shadow"
                >
                  <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center`}>
                    <badge.icon size={30} className={badge.text} />
                  </div>
                  <span className="font-headline font-bold text-xs text-on-surface text-center">{badge.label}</span>
                </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <motion.div
              whileHover={{ y: -2 }}
              onClick={handleMapClick}
              className="bg-white p-6 rounded-xl shadow-sm overflow-hidden group border border-primary/5 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline font-bold text-lg flex items-center gap-2">
                <MapPin size={20} className="text-primary" /> 足迹地图
              </h2>
              <span
                  onClick={handleViewAllCities}
                  className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full hover:bg-primary/10 transition-colors cursor-pointer"
              >
              查看全部
            </span>
            </div>
            <div className="w-full h-48 rounded-lg overflow-hidden relative bg-surface-container-low">
              <img src="https://picsum.photos/seed/maptrace/600/400" className="w-full h-full object-cover opacity-50" alt="Map" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
              <div className="absolute top-1/2 left-1/3 bg-primary text-white p-1.5 rounded-full shadow-lg animate-bounce">
                <PawPrint size={14} fill="currentColor" />
              </div>
            </div>
            <div className="mt-4 flex gap-6 items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">累计行走</p>
                <p className="font-headline text-xl font-extrabold text-on-background">42.8 km</p>
              </div>
              <div className="h-8 w-px bg-primary/10" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">打卡地点</p>
                <p className="font-headline text-xl font-extrabold text-on-background">18</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h2 className="font-headline font-bold text-xl px-2 flex items-center gap-2">
              我的动态
              <span className="h-px flex-1 bg-surface-container-highest" />
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {dynamics.map(item => (
                  <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(item.img)}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-primary/5 cursor-pointer"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img src={item.img} className="w-full h-full object-cover" alt="Dynamic" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs text-on-surface-variant font-medium">{item.date}</p>
                      <p className="text-xs text-on-surface line-clamp-1">{item.content}</p>
                      <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                        <Heart size={10} fill="currentColor" /> {item.likes}
                      </div>
                    </div>
                  </motion.div>
              ))}
              <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('publishPost')}
                  className="bg-primary-container/10 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center aspect-[3/4] text-primary gap-2 cursor-pointer"
              >
                <Camera size={32} />
                <span className="font-headline font-bold text-sm">记录新瞬间</span>
              </motion.div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex items-center justify-between border border-primary/5 cursor-pointer hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <Camera size={20} />
              </div>
              <span className="font-headline font-bold text-on-surface">全部影像存档</span>
            </div>
            <ChevronRight size={20} className="text-stone-300" />
          </div>
        </section>

        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('publishPost')}
            className="fixed bottom-32 right-6 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3 transform transition-all z-40 group"
        >
          <Edit3 size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-headline font-extrabold text-sm tracking-wide">更新动态</span>
        </motion.button>
      </div>
  );
};

const CheckInScreen = ({ onBack, setScreen }: { onBack: () => void, setScreen: (s: Screen) => void }) => {
  const [checkIns, setCheckIns] = useState([
    { id: 1, pet: '奶酪', location: '静安雕塑公园', time: '10:30', img: 'https://picsum.photos/seed/check1/400/300' },
    { id: 2, pet: '奶酪', location: '汪汪公园', time: '昨天 15:20', img: 'https://picsum.photos/seed/check2/400/300' },
  ]);

  const handleCheckIn = () => {
    const newCheckIn = {
      id: checkIns.length + 1,
      pet: '奶酪',
      location: '新地点',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      img: 'https://picsum.photos/seed/check' + (checkIns.length + 3) + '/400/300'
    };
    setCheckIns([newCheckIn, ...checkIns]);
    alert('打卡成功！🎉');
  };

  return (
      <div className="fixed inset-0 z-[150] bg-surface overflow-y-auto pb-32 no-scrollbar">
        <div className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-primary/5">
          <button onClick={onBack} className="text-stone-400 p-2"><ChevronRight className="rotate-180" /></button>
          <h3 className="font-bold text-on-background">我的打卡</h3>
        </div>

        <div className="pt-24 px-4 space-y-6">
          <div className="bg-primary-container/30 p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-xl text-primary">今天还没打卡哦</h2>
              <p className="text-xs text-on-surface-variant mt-1">带上奶酪去公园转转吧！🐾</p>
            </div>
            <button 
              onClick={handleCheckIn}
              className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <MapPin size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline font-bold text-lg px-2">历史记录</h3>
            {checkIns.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5">
                  <img src={item.img} className="w-full h-40 object-cover" alt="Check-in" referrerPolicy="no-referrer" />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-on-background">{item.location}</h4>
                      <p className="text-[10px] text-on-surface-variant">{item.time}</p>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-primary-container">
                        <img src="https://picsum.photos/seed/cheese/50/50" className="w-full h-full object-cover" alt="Pet" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

const OtherProfileScreen = ({ pet, onBack }: { pet: any, onBack: () => void }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dynamics = [
    { id: 1, img: 'https://picsum.photos/seed/doudou1/600/800', date: '3月21日', content: '今天在公园跑得飞快！💨', likes: 32 },
    { id: 2, img: 'https://picsum.photos/seed/doudou2/600/600', date: '3月19日', content: '新买的球球，真好玩！🎾', likes: 15 },
  ];

  return (
      <div className="fixed inset-0 z-[150] bg-surface overflow-y-auto pb-32 no-scrollbar">
        <div className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-primary/5">
          <button onClick={onBack} className="text-stone-400 p-2"><ChevronRight className="rotate-180" /></button>
          <h3 className="font-bold text-on-background">{pet.name} 的主页</h3>
        </div>

        <div className="pt-24 px-4 space-y-8">
          <section className="bg-white p-8 rounded-xl flex flex-col items-center gap-4 relative shadow-sm mt-10">
            <div className="relative -mt-20">
              <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(pet.img)}
                  className="w-32 h-32 organic-shape bg-primary-container p-1 overflow-hidden shadow-lg transform rotate-3 cursor-pointer"
              >
                <img src={pet.img} className="w-full h-full object-cover organic-shape" alt="Profile" referrerPolicy="no-referrer" />
              </motion.div>
              <div className="absolute bottom-0 right-0 bg-secondary-container text-on-background px-3 py-1 rounded-full font-headline font-bold text-xs shadow-md">
                LV.8
              </div>
            </div>
            <div className="text-center">
              <h1 className="font-headline font-extrabold text-3xl text-on-background tracking-tight">{pet.name}</h1>
              <p className="text-on-surface-variant font-medium text-sm mt-1">{pet.breed} · {pet.age}</p>
              <div className="mt-3 inline-flex items-center gap-1 bg-tertiary-container text-tertiary px-4 py-1.5 rounded-full font-headline font-bold text-sm">
                <Star size={14} fill="currentColor" /> 社交达人
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg italic text-on-surface-variant leading-relaxed text-center relative max-w-xs">
              "{pet.bio}"
            </div>
            <div className="flex gap-4 w-full pt-4">
              <button 
                onClick={() => alert(`已关注 ${pet.name}！`)}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                关注
              </button>
              <button 
                onClick={() => alert(`已发送私信给 ${pet.name}！`)}
                className="flex-1 bg-secondary-container text-on-background py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                私信
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline font-bold text-xl px-2 flex items-center gap-2">
              动态
              <span className="h-px flex-1 bg-surface-container-highest" />
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {dynamics.map(item => (
                  <motion.div
                      whileHover={{ y: -5 }}
                      key={item.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-primary/5 group cursor-pointer"
                      onClick={() => setSelectedImage(item.img)}
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Dynamic" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-bold">
                        {item.date}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{item.content}</p>
                      <div className="flex items-center gap-1 text-primary">
                        <Heart size={12} fill="currentColor" />
                        <span className="text-[10px] font-bold">{item.likes}</span>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </section>
        </div>

        <AnimatePresence>
          {selectedImage && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedImage(null)}
                  className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
              >
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    src={selectedImage}
                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                    alt="Zoomed"
                    referrerPolicy="no-referrer"
                />
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

const ChatDetail = ({ chatId, onBack, setScreen, userProfile, setSelectedOtherPet }: { chatId: number, onBack: () => void, setScreen: (s: Screen) => void, userProfile: any, setSelectedOtherPet: (p: any) => void }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '你好呀！', sender: 'them', time: '14:00' },
    { id: 2, text: '明天下午带豆豆去公园吗？', sender: 'them', time: '14:01' },
    { id: 3, text: '可以呀，大概几点？', sender: 'me', time: '14:05' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
      <div className="fixed inset-0 z-[110] bg-surface flex flex-col pt-20">
        <div className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-primary/5">
          <button onClick={onBack} className="text-stone-400 p-2"><ChevronRight className="rotate-180" /></button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            setSelectedOtherPet({
              name: '豆豆',
              age: '1岁',
              breed: '柯基',
              img: 'https://picsum.photos/seed/pet2/400/500',
              bio: '虽然腿短，但我跑得快！最爱吃肉肉，希望能找个一起干饭的小伙伴。',
              fromChat: true
            });
            setScreen('otherProfile');
          }}>
            <div className="w-10 h-10 organic-shape bg-primary-container overflow-hidden">
              <img src="https://picsum.photos/seed/owner1/100/100" className="w-full h-full object-cover" alt="User" referrerPolicy="no-referrer" />
            </div>
            <h3 className="font-bold text-on-background">豆豆爹</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map(m => (
              <div key={m.id} className={`flex items-end gap-2 ${m.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                    className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 cursor-pointer mb-1 shadow-sm border-2 border-white"
                    onClick={() => {
                      if (m.sender === 'me') {
                        setScreen('profile');
                      } else {
                        setSelectedOtherPet({
                          name: '豆豆',
                          age: '1岁',
                          breed: '柯基',
                          img: 'https://picsum.photos/seed/pet2/400/500',
                          bio: '虽然腿短，但我跑得快！最爱吃肉肉，希望能找个一起干饭的小伙伴。',
                          fromChat: true
                        });
                        setScreen('otherProfile');
                      }
                    }}
                >
                  <img
                      src={m.sender === 'me' ? userProfile.avatar : "https://picsum.photos/seed/owner1/100/100"}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                  />
                </div>
                <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                    m.sender === 'me'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-on-background rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                  <p className={`text-[10px] mt-1 ${m.sender === 'me' ? 'text-white/60' : 'text-stone-400'}`}>{m.time}</p>
                </div>
              </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-primary/5 pb-10">
          <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-4 py-2">
            <input
                placeholder="输入消息..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
                onClick={handleSend}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <Navigation size={18} className="rotate-90" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedOtherPet, setSelectedOtherPet] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const [profile, setProfile] = useState({
    name: '奶酪',
    signature: '今天也是要在草地上疯狂打滚的一天哦！🐾',
    avatar: 'https://picsum.photos/seed/cheese/300/300'
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: '遛狗达人' },
    { id: 2, name: '公园探险家' },
    { id: 3, name: '拆家小能手' }
  ]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setIsLoggedIn(true);
      const user = JSON.parse(currentUser);
      setProfile({
        name: user.nickname,
        signature: '今天也是要在草地上疯狂打滚的一天哦！🐾',
        avatar: user.avatar
      });
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const handleSelectChat = (id: number) => {
    setSelectedChatId(id);
    setScreen('chatDetail');
  };

  return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TopBar
            onSearch={() => setIsSearchOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
            onCheckIn={() => setScreen('checkIn')}
            currentScreen={screen}
        />

        <main className="flex-grow pt-20">
          <AnimatePresence mode="wait">
            <motion.div
                key={screen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
            >
              {screen === 'home' && (
                  <HomeScreen
                      onChat={() => setScreen('chat')}
                      setScreen={setScreen}
                      setSelectedOtherPet={setSelectedOtherPet}
                      setSelectedPost={setSelectedPost}
                  />
              )}
              {screen === 'map' && <MapScreen onChat={() => setScreen('chat')} />}
              {screen === 'match' && <MatchScreen setScreen={setScreen} setSelectedOtherPet={setSelectedOtherPet} />}
              {screen === 'profile' && <ProfileScreen profile={profile} achievements={achievements} setScreen={setScreen} />}
              {screen === 'chat' && <ChatList onSelectChat={handleSelectChat} />}
              {screen === 'chatDetail' && selectedChatId && (
                  <ChatDetail
                      chatId={selectedChatId}
                      onBack={() => setScreen('chat')}
                      setScreen={setScreen}
                      userProfile={profile}
                      setSelectedOtherPet={setSelectedOtherPet}
                  />
              )}
              {screen === 'otherProfile' && selectedOtherPet && (
                  <OtherProfileScreen
                      pet={selectedOtherPet}
                      onBack={() => setScreen(selectedOtherPet.fromChat ? 'chatDetail' : 'home')}
                  />
              )}
              {screen === 'checkIn' && (
                  <CheckInScreen onBack={() => setScreen('home')} setScreen={setScreen} />
              )}
              {screen === 'postDetail' && (
                  <PostDetailScreen
                      post={selectedPost}
                      onBack={() => setScreen('home')}
                      onChat={() => setScreen('chat')}
                  />
              )}
              {screen === 'publishPost' && (
                  <PublishPostScreen
                      onBack={() => setScreen('profile')}
                      onPublish={(content, location, image) => {
                        alert(`已发布动态！\n内容: ${content}\n位置: ${location}`);
                      }}
                  />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setScreen={setScreen} setSelectedOtherPet={setSelectedOtherPet} />
        <SettingsOverlay
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            profile={profile}
            setProfile={setProfile}
            achievements={achievements}
            setAchievements={setAchievements}
        />

        <BottomNav activeScreen={screen === 'chatDetail' ? 'chat' : (screen as Screen)} setScreen={setScreen} />
      </div>
  );
}
