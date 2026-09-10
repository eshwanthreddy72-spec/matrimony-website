import React, { useState } from 'react';
import { X, Heart, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Profile } from '../types.ts';

interface SendInterestModalProps {
  isOpen: boolean;
  targetProfile: Profile | null;
  onClose: () => void;
  onSubmit: (profileId: string, message: string) => Promise<void>;
}

const TEMPLATES = [
  'Namaste. I went through your profile and found our backgrounds, values, and educational interests very aligned. I would be delighted to take this forward.',
  'Hello! We appreciate your family orientation and career achievements. We would like to initiate matrimonial discussions if you are interested.',
  'Hi, I was genuinely impressed by your aspirations and lifestyle preferences. I would love to connect and get to know you better.',
  'Namaste. Seeking an opportunity to introduce myself and explore potential lifelong companionship.'
];

export const SendInterestModal: React.FC<SendInterestModalProps> = ({
  isOpen,
  targetProfile,
  onClose,
  onSubmit
}) => {
  const [message, setMessage] = useState(TEMPLATES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !targetProfile) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await onSubmit(targetProfile._id, message);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send interest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#faf7f2]">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Express Interest in {targetProfile.fullName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-5">
          {/* Target Profile Mini Card */}
          <div className="flex items-center space-x-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
            <img
              src={targetProfile.profilePhoto}
              alt={targetProfile.fullName}
              className="w-14 h-14 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-xs truncate">
                {targetProfile.fullName}, {targetProfile.age}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {targetProfile.occupation} • {targetProfile.city}
              </p>
              <p className="text-[10px] text-rose-700 font-semibold">
                {targetProfile.religion} • {targetProfile.maritalStatus}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Message Templates */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Choose a Thoughtful Intro Template:</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(tmpl)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    message === tmpl
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="line-clamp-2">"{tmpl}"</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Edit Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personalized Message
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
              placeholder="Write a warm note to accompany your expression of interest..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-200 flex items-center space-x-1.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending Request...' : 'Send Matrimonial Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
