'use client';

import { useState } from 'react';
import { Camera, Plus, X, Heart, UploadCloud, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface CommunityPhoto {
  id: string;
  url: string;
  caption: string;
  uploader: string;
  tag: string;
  date: string;
  likes: number;
}

const INITIAL_PHOTOS: CommunityPhoto[] = [
  {
    id: 'p-1',
    url: '/images/venue/living-room.jpg',
    caption: 'Birthday bash with 18 friends! The neon sign and fairy lights created the best photo vibe.',
    uploader: 'Aman & Ritika',
    tag: 'Birthday Party',
    date: 'August 2026',
    likes: 42,
  },
  {
    id: 'p-2',
    url: '/images/venue/karaoke-stage.jpg',
    caption: 'Karaoke tournament was the absolute highlight. Sound tower was super loud and clear!',
    uploader: 'Kunal S.',
    tag: 'College Reunion',
    date: 'August 2026',
    likes: 38,
  },
  {
    id: 'p-3',
    url: '/images/venue/cinema-projector.jpg',
    caption: 'Hosted our movie night on the 100-inch projector. Floor cushions and popcorn setup was perfect.',
    uploader: 'Simran & Gang',
    tag: 'Movie Night',
    date: 'July 2026',
    likes: 56,
  },
  {
    id: 'p-4',
    url: '/images/addons/buffet-warmers.jpg',
    caption: 'Added the chafing warmers add-on for our dinner party. Food stayed piping hot till 2 AM!',
    uploader: 'Varun M.',
    tag: 'Dinner Party',
    date: 'August 2026',
    likes: 29,
  },
  {
    id: 'p-5',
    url: '/images/addons/cocktail-bar.jpg',
    caption: 'The cocktail bar station was a hit. Fresh mint, ice, mixers and crystal glassware ready to go.',
    uploader: 'Pooja T.',
    tag: 'Cocktail Night',
    date: 'July 2026',
    likes: 49,
  },
  {
    id: 'p-6',
    url: '/images/addons/party-decor.jpg',
    caption: 'Pre-ordered the birthday balloon arch and neon setup. Walked in and everything was already styled!',
    uploader: 'Tanmay & Friends',
    tag: 'Celebration',
    date: 'August 2026',
    likes: 64,
  },
];

export function GuestPhotoWall() {
  const [photos, setPhotos] = useState<CommunityPhoto[]>(INITIAL_PHOTOS);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Upload Form State
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('Birthday Party');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const tags = ['All', 'Birthday Party', 'College Reunion', 'Movie Night', 'Dinner Party', 'Celebration'];

  const filteredPhotos = selectedTag === 'All'
    ? photos
    : photos.filter((p) => p.tag === selectedTag);

  const MOBILE_PREVIEW = 3;
  const visiblePhotos = showAllPhotos ? filteredPhotos : filteredPhotos.slice(0, MOBILE_PREVIEW);

  const handleLike = (id: string) => {
    if (likedPhotos.includes(id)) {
      setLikedPhotos(likedPhotos.filter((x) => x !== id));
      setPhotos(photos.map((p) => p.id === id ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPhotos([...likedPhotos, id]);
      setPhotos(photos.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const handleCustomPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage) return;

    const newPhoto: CommunityPhoto = {
      id: `p-${Date.now()}`,
      url: previewImage,
      caption: caption || 'Unforgettable celebration at Rent-A-Vibe 2BHK flat!',
      uploader: uploaderName || 'Party Guest',
      tag: tag || 'Celebration',
      date: 'Just now',
      likes: 1,
    };

    setPhotos([newPhoto, ...photos]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadOpen(false);
      setPreviewImage(null);
      setCaption('');
      setUploaderName('');
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header with Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1.5">
          <span className="text-purple-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-purple-600" /> Guest Photo Wall
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Party Vibe Gallery
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl font-medium">
            Real photos from recent celebrations. Share yours!
          </p>
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="btn-primary flex items-center gap-2 text-xs sm:text-sm px-4 py-2.5 cursor-pointer shrink-0 active:scale-95 touch-manipulation self-start sm:self-auto font-bold"
        >
          <Plus className="w-4 h-4" /> <span>Add Photo</span>
        </button>
      </div>

      {/* Filter Tabs — horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setSelectedTag(t); setShowAllPhotos(false); }}
            className={`text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer touch-manipulation shrink-0 font-bold ${
              selectedTag === t
                ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visiblePhotos.map((photo) => {
          const isLiked = likedPhotos.includes(photo.id);
          return (
            <div
              key={photo.id}
              className="glass-card overflow-hidden group hover:border-purple-400 transition-all flex flex-col justify-between border border-slate-200 bg-white shadow-sm"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="badge absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold border border-slate-200 shadow-sm">
                    {photo.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLike(photo.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer active:scale-90 touch-manipulation shadow-sm ${
                      isLiked ? 'bg-pink-600 text-white' : 'bg-white/90 text-slate-700 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                  </button>
                </div>

                <div className="p-3 sm:p-4 space-y-1.5">
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2 font-medium">
                    "{photo.caption}"
                  </p>
                </div>
              </div>

              <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 flex items-center justify-between border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                <span className="font-bold text-purple-700">{photo.uploader}</span>
                <span>{photo.likes} Likes · {photo.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Toggle */}
      {filteredPhotos.length > MOBILE_PREVIEW && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-purple-400 transition-all shadow-sm active:scale-95"
          >
            {showAllPhotos ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> View all {filteredPhotos.length} photos</>
            )}
          </button>
        </div>
      )}

      {/* Interactive Photo Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-7 border border-purple-200 shadow-2xl relative space-y-5 bg-white rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setIsUploadOpen(false);
                setPreviewImage(null);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-2 cursor-pointer touch-manipulation rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="badge bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 font-bold">
                Community Upload
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">Add Your Party Photo</h3>
              <p className="text-xs text-slate-600 font-medium">
                Upload a real moment from your gathering at Rent-A-Vibe 2BHK flat.
              </p>
            </div>

            {uploadSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Photo Added to Gallery!</h4>
                <p className="text-xs text-slate-600 font-medium">Your celebration snapshot is now featured on the wall.</p>
              </div>
            ) : (
              <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Photo (JPEG, PNG)
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-all text-center">
                    {previewImage ? (
                      <div className="w-full h-36 rounded-xl overflow-hidden relative border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-purple-600 mb-2" />
                        <span className="text-xs font-bold text-slate-900">Click to browse or drop party photo</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Living room, karaoke, or group selfie</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomPhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Name & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name / Group
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul & Squad"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      className="input-field text-xs border-slate-200 text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Occasion Tag
                    </label>
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="input-field text-xs border-slate-200 text-slate-900 bg-white"
                    >
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="College Reunion">College Reunion</option>
                      <option value="Movie Night">Movie Night</option>
                      <option value="Dinner Party">Dinner Party</option>
                      <option value="Celebration">Celebration</option>
                    </select>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Story / Caption
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us what made your night special..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="input-field text-xs border-slate-200 text-slate-900"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!previewImage}
                  className="btn-primary w-full py-3 text-sm font-extrabold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Publish Photo to Wall
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
