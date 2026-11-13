import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-brand-50 border-b border-brand-200/70 text-mauve-deep text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center font-normal tracking-wide">
        <Sparkles className="w-3 h-3 text-brand-500 shrink-0 hidden sm:inline" />
        <span>
          Every stitch holds a little love &bull; Handcrafted in India &bull; Free shipping on orders over ₹1,499 [Preview]
        </span>
        <Heart className="w-3 h-3 text-brand-500 fill-brand-300 shrink-0 hidden sm:inline" />
      </div>
    </div>
  );
};

