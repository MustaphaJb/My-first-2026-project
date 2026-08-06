import React, { useState, useRef } from 'react';
import { ImageBanner, User } from '../types';
import { storageService } from '../services/storageService';
import {
  Upload,
  Image as ImageIcon,
  Edit3,
  RotateCcw,
  Eye,
  X,
  Check,
  Sparkles,
  Shield,
  Camera,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
} from 'lucide-react';

interface CentralBannerSectionProps {
  user: User;
  onBannersUpdated?: () => void;
}

export const CentralBannerSection: React.FC<CentralBannerSectionProps> = ({
  user,
  onBannersUpdated,
}) => {
  const [banners, setBanners] = useState<ImageBanner[]>(() => storageService.getBanners());
  const [activeEditingBanner, setActiveEditingBanner] = useState<ImageBanner | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  // Form states for modal
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editBadgeText, setEditBadgeText] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const reloadBanners = () => {
    const fresh = storageService.getBanners();
    setBanners(fresh);
    if (onBannersUpdated) onBannersUpdated();
  };

  const handleFileUpload = (banner: ImageBanner, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }

    // Limit size check (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size is too large. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const updated: ImageBanner = {
          ...banner,
          imageUrl: dataUrl,
          updatedAt: new Date().toISOString(),
          updatedBy: user.name,
        };
        const newBanners = storageService.saveBanner(updated);
        setBanners(newBanners);
        showNotification(`Banner uploaded successfully for ${banner.slotName}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => {
      setSaveSuccess(null);
    }, 3500);
  };

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, banner: ImageBanner) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(banner, e.dataTransfer.files[0]);
    }
  };

  const openEditModal = (banner: ImageBanner) => {
    setActiveEditingBanner(banner);
    setEditTitle(banner.title);
    setEditSubtitle(banner.subtitle);
    setEditBadgeText(banner.badgeText || '');
    setEditImageUrl(banner.imageUrl);
    setIsUrlInput(false);
  };

  const saveModalChanges = () => {
    if (!activeEditingBanner) return;
    const updated: ImageBanner = {
      ...activeEditingBanner,
      title: editTitle || activeEditingBanner.title,
      subtitle: editSubtitle || activeEditingBanner.subtitle,
      badgeText: editBadgeText || activeEditingBanner.badgeText,
      imageUrl: editImageUrl || activeEditingBanner.imageUrl,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name,
    };
    const newBanners = storageService.saveBanner(updated);
    setBanners(newBanners);
    setActiveEditingBanner(null);
    showNotification('Banner settings & image updated successfully!');
  };

  const handleResetBanner = (bannerId: string) => {
    if (window.confirm('Reset this banner to default regiment theme?')) {
      const newBanners = storageService.resetBanner(bannerId);
      setBanners(newBanners);
      showNotification('Banner reset to default theme.');
    }
  };

  const handleRemoveBannerImage = (banner: ImageBanner) => {
    if (window.confirm(`Remove custom image for ${banner.slotName}?`)) {
      const defaultUrl = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80';
      const updated: ImageBanner = {
        ...banner,
        imageUrl: defaultUrl,
        updatedAt: new Date().toISOString(),
        updatedBy: user.name,
      };
      const newBanners = storageService.saveBanner(updated);
      setBanners(newBanners);
      showNotification(`Image removed for Banner Place ${banner.id === 'banner_slot_1' ? '1' : '2'}.`);
    }
  };

  // Sample quick military wallpapers
  const presetBanners = [
    {
      label: 'Command Officers Parade',
      url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80',
    },
    {
      label: 'Field Heavy Machinery',
      url: 'https://images.unsplash.com/photo-1579912437766-7892db633929?auto=format&fit=crop&w=1600&q=80',
    },
    {
      label: 'Tactical Operation Center',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    },
    {
      label: 'Engineering Construction',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  return (
    <div className="space-y-4 my-2">
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-amber-500 text-emerald-950 px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-amber-300 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Center Banners Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 font-sans flex items-center gap-2">
              Regiment Command Banners
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                2 Upload Slots Available
              </span>
            </h3>
            <p className="text-[11px] text-emerald-300/80">
              Upload custom image banners below. Changes persist across sessions immediately after login.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs for Direct Banner Uploads */}
      <input
        type="file"
        ref={fileInputRef1}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && banners[0]) {
            handleFileUpload(banners[0], e.target.files[0]);
          }
        }}
      />
      <input
        type="file"
        ref={fileInputRef2}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && banners[1]) {
            handleFileUpload(banners[1], e.target.files[0]);
          }
        }}
      />

      {/* 2 CENTER IMAGE BANNER CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {banners.slice(0, 2).map((banner, index) => {
          const isSlot1 = index === 0;
          const refInput = isSlot1 ? fileInputRef1 : fileInputRef2;
          const isDragging = dragOverSlot === banner.id;

          return (
            <div
              key={banner.id}
              onDragOver={(e) => handleDragOver(e, banner.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, banner)}
              className={`relative group rounded-2xl overflow-hidden border-2 transition-all shadow-xl bg-emerald-950 ${
                isDragging
                  ? 'border-amber-400 ring-4 ring-amber-500/30 scale-[1.01]'
                  : 'border-amber-500/30 hover:border-amber-400/80'
              }`}
            >
              {/* Image Container with Responsive Aspect Ratio */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  onError={(e) => {
                    // Fallback thumbnail if image breaks
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80';
                  }}
                />

                {/* Dark Gradient Overlay for High Contrast Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-black/40" />

                {/* Top Slot Header Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-widest border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 shadow">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Banner Place {index + 1}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-black/70 text-emerald-200 text-[10px] font-mono border border-emerald-700/50 backdrop-blur-md">
                    {banner.badgeText || (isSlot1 ? 'COMMAND CENTER' : 'TACTICAL OPS')}
                  </span>
                </div>

                {/* Center Content Text Overlay */}
                <div className="absolute bottom-3 left-4 right-4 z-10 text-white space-y-1">
                  <h4 className="text-base sm:text-lg font-black uppercase tracking-wide text-white drop-shadow-md leading-snug font-sans">
                    {banner.title}
                  </h4>
                  <p className="text-xs text-emerald-200/90 font-medium leading-relaxed drop-shadow line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400/70 font-mono">
                    <span>Updated by: {banner.updatedBy || 'Command'}</span>
                  </div>
                </div>

                {/* Hover / Direct Drag Overlay Banner Upload Prompt */}
                {isDragging && (
                  <div className="absolute inset-0 z-20 bg-amber-500/90 text-emerald-950 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-pulse">
                    <Upload className="w-12 h-12 stroke-[2.5] mb-2" />
                    <span className="text-base font-black uppercase tracking-wider">
                      Drop Image Here to Upload
                    </span>
                    <span className="text-xs font-semibold">Banner Place {index + 1}</span>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action Controls Bar */}
              <div className="p-3 bg-emerald-950 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    id={`btn-change-banner-${index + 1}`}
                    onClick={() => refInput.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase shadow active:scale-95 transition-all min-h-[38px]"
                    title={`Change Image for Banner Place ${index + 1}`}
                  >
                    <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                    <span>Change Image {index + 1}</span>
                  </button>

                  <button
                    id={`btn-remove-banner-${index + 1}`}
                    onClick={() => handleRemoveBannerImage(banner)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-bold uppercase shadow active:scale-95 transition-all min-h-[38px]"
                    title={`Remove Image from Banner Place ${index + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">Remove Image</span>
                  </button>

                  <button
                    id={`btn-edit-banner-${index + 1}`}
                    onClick={() => openEditModal(banner)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-semibold uppercase active:scale-95 transition-all min-h-[38px]"
                    title="Edit Banner Title & Image Details"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Edit Details</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-preview-banner-${index + 1}`}
                    onClick={() => setPreviewImage(banner.imageUrl)}
                    className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="View Fullsize Banner Image"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-reset-banner-${index + 1}`}
                    onClick={() => handleResetBanner(banner.id)}
                    className="p-2 rounded-lg bg-emerald-900/60 hover:bg-red-950/80 text-emerald-400 hover:text-red-300 border border-emerald-700/60 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="Reset to Default Theme Banner"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: EDIT / UPLOAD BANNER DETAILS MODAL */}
      {activeEditingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border-2 border-amber-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-5">
            <button
              onClick={() => setActiveEditingBanner(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-300 min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-amber-400" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold tracking-widest">
                <ImageIcon className="w-4 h-4" />
                <span>Configure {activeEditingBanner.slotName}</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Upload & Customise Image Banner
              </h3>
            </div>

            {/* Banner Image Preview Box */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-amber-500/30 bg-black">
              <img
                src={editImageUrl || activeEditingBanner.imageUrl}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <p className="font-extrabold text-sm truncate">{editTitle || 'Banner Title'}</p>
                <p className="text-xs text-emerald-300 truncate">{editSubtitle || 'Subtitle'}</p>
              </div>
            </div>

            {/* Upload Selector Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>BANNER IMAGE SOURCE</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUrlInput(false)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      !isUrlInput
                        ? 'bg-amber-500 text-emerald-950 font-bold'
                        : 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUrlInput(true)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      isUrlInput
                        ? 'bg-amber-500 text-emerald-950 font-bold'
                        : 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {!isUrlInput ? (
                <div>
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            setEditImageUrl(evt.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-emerald-900/40 hover:bg-emerald-900/80 text-amber-300 font-bold text-xs uppercase flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span>Click to Browse Computer / Phone Gallery Image</span>
                    <span className="text-[10px] text-emerald-300 font-normal">
                      Supports PNG, JPG, WEBP, GIF (Up to 10MB)
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-300">Image Direct Web URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="https://example.com/banner-image.jpg"
                      className="w-full px-3 py-2 pl-9 bg-emerald-900/80 border border-emerald-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <LinkIcon className="w-4 h-4 text-emerald-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              )}

              {/* Quick Preset Wallpapers */}
              <div>
                <span className="text-[11px] font-bold text-emerald-400 block mb-1.5">
                  Or Select Regimental Preset Banner:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {presetBanners.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditImageUrl(preset.url)}
                      className="text-left p-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700/50 flex items-center gap-2 group transition-colors"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-10 h-7 object-cover rounded border border-emerald-600"
                      />
                      <span className="text-[11px] font-medium text-emerald-200 group-hover:text-amber-300 truncate">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle Inputs */}
              <div className="space-y-3 pt-2 border-t border-emerald-900">
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-emerald-900/80 border border-emerald-700 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">
                    Banner Subtitle / Directive
                  </label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-emerald-900/80 border border-emerald-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-1">Tag / Badge Label</label>
                  <input
                    type="text"
                    value={editBadgeText}
                    onChange={(e) => setEditBadgeText(e.target.value)}
                    placeholder="e.g. COMMAND HEADQUARTERS"
                    className="w-full px-3 py-2 bg-emerald-900/80 border border-emerald-700 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-900">
              <button
                type="button"
                onClick={() => setActiveEditingBanner(null)}
                className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-300 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModalChanges}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold uppercase shadow flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Banner Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL-SIZE IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-amber-500 text-emerald-950 font-bold hover:bg-amber-400 shadow-xl"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
            <img
              src={previewImage}
              alt="Regiment Full Banner Preview"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl border-2 border-amber-500/50 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
