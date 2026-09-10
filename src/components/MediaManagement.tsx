import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  AlertCircle,
  Check,
  Star
} from 'lucide-react';
import { Profile, MediaPhoto } from '../types.ts';
import { api } from '../services/api.ts';

interface MediaManagementProps {
  profile: Profile | null;
  onProfileUpdated: (updated: Profile) => void;
}

export const MediaManagement: React.FC<MediaManagementProps> = ({
  profile,
  onProfileUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const photos = profile.photos || [];

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      await submitUpload({ base64Data });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const submitUpload = async (payload: { url?: string; base64Data?: string }) => {
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      const res = await api.uploadMedia({
        ...payload,
        caption: caption.trim() || undefined,
        isProfilePhoto: photos.length === 0
      });

      setSuccess('Photo submitted! It will appear after admin review.');
      setCaption('');
      setImageUrlInput('');
      onProfileUpdated(res.profile);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      setLoading(true);
      const res = await api.setPrimaryPhoto(photoId);
      onProfileUpdated({
        ...profile,
        profilePhoto: res.profilePhoto,
        photos: res.photos
      });
      setSuccess('Primary profile picture updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to set profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photograph?')) return;
    try {
      setLoading(true);
      const res = await api.deleteMedia(photoId);
      onProfileUpdated({
        ...profile,
        photos: res.photos,
        profilePhoto: res.profilePhoto
      });
      setSuccess('Photo deleted successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
          My Photo Gallery & Media
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload clear, recent photographs. To maintain safety, all uploads undergo automated and administrative moderation.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h2 className="font-bold text-sm text-slate-800">Add New Photograph</h2>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-rose-500 bg-rose-50/50'
              : 'border-slate-300 hover:border-rose-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="w-12 h-12 mx-auto rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            Drag & drop your photograph here, or <span className="text-rose-600 underline">browse files</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports JPG, PNG, WEBP • Max 10MB
          </p>
        </div>

        {/* Or URL Input */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or paste direct Image URL (e.g. Unsplash or Cloudinary)
            </label>
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Caption (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Traditional family celebration"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={loading || !imageUrlInput.trim()}
              onClick={() => submitUpload({ url: imageUrlInput.trim() })}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add URL
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">
            Uploaded Photos ({photos.length})
          </h2>
          <span className="text-xs text-slate-500">
            ★ Profile photo is shown as your primary avatar
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No photographs uploaded yet. Add photos to boost your match inquiries!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {photos.map((photo) => {
              const isPrimary = photo.url === profile.profilePhoto || photo.isProfilePhoto;

              return (
                <div
                  key={photo.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isPrimary ? 'ring-2 ring-rose-500 border-rose-300' : 'border-slate-200'
                  }`}
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Profile photo'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      {photo.status === 'approved' && (
                        <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {photo.status === 'pending' && (
                        <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                          <Clock className="w-3 h-3" />
                          <span>In Review</span>
                        </span>
                      )}
                      {photo.status === 'rejected' && (
                        <span className="bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </div>

                    {isPrimary && (
                      <div className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Primary</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      {photo.caption && (
                        <p className="text-xs text-slate-700 italic truncate">
                          "{photo.caption}"
                        </p>
                      )}
                      {photo.status === 'rejected' && photo.rejectedReason && (
                        <p className="text-[11px] text-rose-600 font-medium mt-1">
                          Reason: {photo.rejectedReason}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">
                        Uploaded {photo.uploadedAt ? photo.uploadedAt.slice(0, 10) : 'Recently'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {!isPrimary && photo.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(photo.id)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 py-1"
                        >
                          Make Primary
                        </button>
                      )}
                      {isPrimary && (
                        <span className="text-[11px] font-bold text-slate-400">
                          Primary Avatar
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-auto"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
