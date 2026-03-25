import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Image as ImageIcon, MapPin, Send } from 'lucide-react';

interface PublishPostScreenProps {
  onBack: () => void;
  onPublish: (content: string, location: string, image: string) => void;
}

export const PublishPostScreen: React.FC<PublishPostScreenProps> = ({ onBack, onPublish }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!content.trim()) {
      alert('请输入动态内容');
      return;
    }

    setIsPublishing(true);
    try {
      onPublish(content, location, selectedImage || '');
      alert('发布成功！🎉');
      onBack();
    } catch (error) {
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSelectImage = () => {
    const images = [
      'https://picsum.photos/seed/post1/400/300',
      'https://picsum.photos/seed/post2/400/300',
      'https://picsum.photos/seed/post3/400/300',
      'https://picsum.photos/seed/post4/400/300',
    ];
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);
  };

  return (
    <div className="fixed inset-0 z-[160] bg-surface flex flex-col">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-primary/5">
        <h2 className="text-xl font-black font-headline text-on-background">发布动态</h2>
        <button onClick={onBack} className="text-stone-400 p-2 hover:bg-primary/5 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {/* Content Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">说点什么吧...</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你和宠物的故事..."
            className="w-full bg-surface-container-low rounded-2xl px-4 py-4 text-on-background outline-none focus:ring-2 ring-primary/20 transition-all resize-none"
            rows={6}
          />
          <p className="text-xs text-on-surface-variant">{content.length}/500</p>
        </div>

        {/* Image Selection */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">添加图片</label>
          {selectedImage ? (
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-primary/5">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSelectImage}
              className="w-full border-2 border-dashed border-primary/30 rounded-2xl py-8 flex flex-col items-center gap-2 text-primary hover:bg-primary/5 transition-colors"
            >
              <ImageIcon size={32} />
              <span className="font-bold">点击选择图片</span>
            </button>
          )}
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">位置</label>
          <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
            <MapPin size={20} className="text-stone-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="添加位置信息"
              className="flex-1 bg-transparent outline-none text-on-background"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">标签</label>
          <div className="flex flex-wrap gap-2">
            {['#日常', '#可爱', '#打卡', '#分享'].map((tag) => (
              <button
                key={tag}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/20 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-primary/5 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-surface-container-low text-on-background py-4 rounded-full font-headline font-bold active:scale-95 transition-all"
        >
          取消
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex-1 bg-primary text-white py-4 rounded-full font-headline font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={20} />
          {isPublishing ? '发布中...' : '发布'}
        </motion.button>
      </div>
    </div>
  );
};
