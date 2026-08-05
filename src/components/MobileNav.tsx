import React from 'react';
import { Home, Video, Plus, DollarSign, ShoppingBag, Radio } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: string;
  onOpenUpload: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  lang,
  onOpenUpload,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-md border-t border-white/10 text-white/50 flex items-center justify-around py-2 px-1 md:hidden">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'home' ? 'text-orange-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>{t.home}</span>
      </button>

      <button
        onClick={() => onTabChange('shorts')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'shorts' ? 'text-orange-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Video className="w-5 h-5" />
        <span>Shorts</span>
      </button>

      <button
        onClick={onOpenUpload}
        className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)] -mt-5 border-2 border-[#050505]"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      <button
        onClick={() => onTabChange('cpa')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'cpa' ? 'text-orange-400 font-bold' : 'hover:text-white'
        }`}
      >
        <DollarSign className="w-5 h-5" />
        <span>CPA Earn</span>
      </button>

      <button
        onClick={() => onTabChange('digital-products')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'digital-products' ? 'text-orange-400 font-bold' : 'hover:text-white'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Store</span>
      </button>
    </nav>
  );
};
