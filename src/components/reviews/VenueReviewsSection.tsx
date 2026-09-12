'use client';

import { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, Plus, X, Sparkles, ShieldCheck } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  avatarText: string;
  rating: number;
  date: string;
  occasion: string;
  comment: string;
  verified: boolean;
  hostReply?: string;
  helpfulCount: number;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aakash Mehra',
    avatarText: 'AM',
    rating: 5,
    date: 'August 28, 2026',
    occasion: '25th Birthday Party (18 Guests)',
    comment:
      'Hands down the smoothest party experience in Delhi NCR. The karaoke setup with dual wireless mics worked right out of the box with zero delay. We plugged in the 160W sound tower and didn’t have to worry about neighbours because the acoustic flat design kept everything contained indoors. Will definitely book again!',
    verified: true,
    hostReply:
      'Thanks Aakash! Thrilled that your 25th birthday went seamlessly. You and your friends left the flat in great condition.',
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    name: 'Sneha & Priya',
    avatarText: 'SP',
    rating: 5,
    date: 'August 19, 2026',
    occasion: 'Overnight Bachelorette Stay (14 Guests)',
    comment:
      'The neon lounge lighting and the golden fairy lights made our photos look straight out of Pinterest! Both master bedrooms were spotless with crisp clean duvets and cold AC. We added the Cocktail Bar pack and having pre-stocked mixers and ice ready saved us a ton of hassle.',
    verified: true,
    hostReply:
      'Congratulations on the celebration Sneha & Priya! So glad the cocktail setup and overnight stay were comfortable.',
    helpfulCount: 31,
  },
  {
    id: 'rev-3',
    name: 'Rohan Verma',
    avatarText: 'RV',
    rating: 5,
    date: 'August 12, 2026',
    occasion: 'India Match Screening & Squad Chill',
    comment:
      'The 100-inch smart projector on the big living room wall with floor cushions felt like our own private VIP cinema club. Super close to Dwarka Sector 19 metro so all my college friends reached easily. Security deposit was refunded to my UPI the next morning within 2 hours.',
    verified: true,
    helpfulCount: 19,
  },
  {
    id: 'rev-4',
    name: 'Divya Sharma',
    avatarText: 'DS',
    rating: 5,
    date: 'August 3, 2026',
    occasion: 'Surprise Anniversary Party (16 Guests)',
    comment:
      'We opted for the Buffet Chafing Warmer Add-on and BYOF dinner was a huge hit! The food stayed hot for hours in the stainless chafing dishes. The host coordinated everything professionally. 10/10 recommended over expensive restaurant halls.',
    verified: true,
    hostReply:
      'Happy Anniversary Divya! It was an absolute pleasure hosting your family and friends.',
    helpfulCount: 16,
  },
];

export function VenueReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [helpfulList, setHelpfulList] = useState<string[]>([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // New Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [occasion, setOccasion] = useState('Birthday Party');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filterOptions = ['All', '5 Stars', 'Birthday Party', 'Overnight Stay', 'Match Screening'];

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === '5 Stars') return r.rating === 5;
    if (selectedFilter === 'Birthday Party') return r.occasion.toLowerCase().includes('birthday');
    if (selectedFilter === 'Overnight Stay') return r.occasion.toLowerCase().includes('stay') || r.occasion.toLowerCase().includes('bachelorette');
    if (selectedFilter === 'Match Screening') return r.occasion.toLowerCase().includes('screening') || r.occasion.toLowerCase().includes('cinema');
    return true;
  });

  const handleHelpful = (id: string) => {
    if (helpfulList.includes(id)) {
      setHelpfulList(helpfulList.filter((x) => x !== id));
      setReviews(reviews.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount - 1 } : r)));
    } else {
      setHelpfulList([...helpfulList, id]);
      setReviews(reviews.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)));
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !comment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: reviewerName,
      avatarText: reviewerName.slice(0, 2).toUpperCase(),
      rating,
      date: 'Just now',
      occasion: `${occasion} (Verified Guest)`,
      comment,
      verified: true,
      helpfulCount: 1,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsWriteReviewOpen(false);
      setReviewerName('');
      setComment('');
      setRating(5);
    }, 1200);
  };

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-amber-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> Real Guest Feedback · 180+ Events Hosted
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            What Celebrators Say About Us
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl font-medium">
            Read transparent reviews from past birthday organizers, reunion hosts, and stay guests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteReviewOpen(true)}
          className="btn-ghost border border-slate-200 text-slate-700 text-sm px-5 py-3 flex items-center gap-2 hover:border-purple-400 hover:text-purple-700 cursor-pointer shrink-0 active:scale-95 touch-manipulation font-semibold"
        >
          <MessageSquare className="w-4 h-4 text-purple-600" /> Write a Review
        </button>
      </div>

      {/* Ratings Overview Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-sm">
        {/* Left Rating Number */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6 space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-5xl font-black text-slate-900 font-heading">4.94</span>
            <div className="space-y-0.5 text-left">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">189 Verified Party Bookings</p>
            </div>
          </div>
          <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center md:justify-start gap-1 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Verified Guest Stays
          </p>
        </div>

        {/* Right Categories Rating Breakdown */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500 font-semibold">Sound & Karaoke</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5 font-heading">4.98</p>
            <p className="text-[10px] text-emerald-700 font-bold">Top Rated</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500 font-semibold">Cleanliness</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5 font-heading">4.96</p>
            <p className="text-[10px] text-slate-500 font-medium">Sanitized</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500 font-semibold">Lighting & Decor</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5 font-heading">4.95</p>
            <p className="text-[10px] text-slate-500 font-medium">Neon Vibe</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500 font-semibold">Deposit Refund</p>
            <p className="text-lg font-extrabold text-emerald-700 mt-0.5 font-heading">100%</p>
            <p className="text-[10px] text-emerald-700 font-bold">&lt; 12 Hours</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setSelectedFilter(opt)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 font-bold ${
              selectedFilter === opt
                ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => {
          const isHelpful = helpfulList.includes(rev.id);
          return (
            <div
              key={rev.id}
              className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                {/* Header: User & Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 text-purple-700 font-extrabold text-xs flex items-center justify-center shadow-sm">
                      {rev.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm font-heading">{rev.name}</h4>
                        {rev.verified && (
                          <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] px-1.5 py-0.2 font-bold">
                            Verified Guest
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{rev.occasion}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500 shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>

                {/* Host Response if any */}
                {rev.hostReply && (
                  <div className="p-3 rounded-xl bg-purple-50 border-l-2 border-purple-600 text-xs space-y-1">
                    <p className="text-[10px] font-bold text-purple-800">Host Response (Rent-A-Vibe Team):</p>
                    <p className="text-[11px] text-slate-600 font-medium">{rev.hostReply}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{rev.date}</span>
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer active:scale-95 touch-manipulation font-semibold ${
                    isHelpful
                      ? 'bg-purple-100 border-purple-300 text-purple-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" /> Helpful ({rev.helpfulCount})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-7 border border-purple-200 shadow-2xl relative space-y-5 bg-white rounded-2xl">
            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-2 cursor-pointer touch-manipulation rounded-xl hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="badge bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 font-bold">
                Verified Feedback
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">Share Your Party Experience</h3>
              <p className="text-xs text-slate-600 font-medium">
                Help future party hosts know what to expect at Rent-A-Vibe 2BHK flat.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Thank You For Your Review!</h4>
                <p className="text-xs text-slate-600 font-medium">Your feedback has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aryan Kapoor"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="input-field text-xs border-slate-200 text-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= rating ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Occasion</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="input-field text-xs border-slate-200 text-slate-900 bg-white"
                    >
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="College Reunion">College Reunion</option>
                      <option value="Movie Night">Movie Night</option>
                      <option value="Bachelorette / Stay">Bachelorette / Stay</option>
                      <option value="Celebration">Celebration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    placeholder="How was the karaoke, cinema projector, bedrooms, and overall vibe?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field text-xs border-slate-200 text-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-sm font-extrabold cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
