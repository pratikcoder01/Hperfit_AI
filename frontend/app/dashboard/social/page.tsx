"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send, Star, Trophy, Sparkles } from "lucide-react";
import type { SocialPost } from "@/types/social";

const MOCK_POSTS: SocialPost[] = [
  {
    id: "post1",
    author: { id: "u1", name: "Sarah Chen", username: "@sarahfits", avatarUrl: "", followersCount: 1200, followingCount: 300, level: 42, isVerified: true },
    content: "Just smashed my PR on Deadlifts! 🏋️‍♀️ The AI form analysis gave me an A grade. Feeling unstoppable today! 🔥",
    likesCount: 342,
    commentsCount: 28,
    isLikedByMe: true,
    isSavedByMe: false,
    createdAt: "2h ago",
    mediaType: "achievement",
    workoutData: {
      exercise: "Deadlift",
      reps: 8,
      duration: "45s",
      formScore: 95
    }
  },
  {
    id: "post2",
    author: { id: "u2", name: "Marcus Rodriguez", username: "@marcus_lifts", avatarUrl: "", followersCount: 850, followingCount: 210, level: 15 },
    content: "Hit a 14-day streak! The consistency challenge is really pushing me. Let's get it team! 💪",
    likesCount: 156,
    commentsCount: 12,
    isLikedByMe: false,
    isSavedByMe: false,
    createdAt: "5h ago",
  }
];

export default function SocialFeedPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: SocialPost = {
      id: `new_${Date.now()}`,
      author: { id: "me", name: "Pratik", username: "@pratik", avatarUrl: "", followersCount: 10, followingCount: 10, level: 12 },
      content: newPost,
      likesCount: 0,
      commentsCount: 0,
      isLikedByMe: false,
      isSavedByMe: false,
      createdAt: "Just now"
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {/* Main Feed */}
      <div className="space-y-6">
        
        {/* Create Post */}
        <motion.div className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2CBF] to-[#00F5D4] flex items-center justify-center font-bold text-[#0B0F19] flex-shrink-0">
              P
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your fitness journey..."
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-[#94A3B8] resize-none h-12"
              />
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg text-[#00F5D4] hover:bg-[#00F5D4]/10 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-colors">
                    <Trophy className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="px-5 py-2 bg-[#7B2CBF] hover:bg-[#6D28AA] text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2">
                  Post <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feed Posts */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                      {post.author.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{post.author.name}</span>
                        {post.author.isVerified && <span className="text-[#00F5D4] text-xs">✓</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                        <span>{post.author.username}</span>
                        <span>·</span>
                        <span>{post.createdAt}</span>
                        <span>·</span>
                        <span className="px-1.5 rounded bg-white/10 text-white font-semibold">Lvl {post.author.level}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[#94A3B8] hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
                </div>

                {/* Content */}
                <p className="text-[#CBD5E1] text-sm mb-4 leading-relaxed">{post.content}</p>

                {/* Workout Attachment */}
                {post.workoutData && (
                  <div className="mb-4 p-4 rounded-xl border border-[#00F5D4]/20 bg-[#00F5D4]/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00F5D4]/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-[#00F5D4]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#00F5D4] text-sm">AI Form Grade: A ({post.workoutData.formScore}%)</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{post.workoutData.exercise} · {post.workoutData.reps} Reps · {post.workoutData.duration}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 border-t border-white/5 pt-3 mt-2">
                  <button className={`flex items-center gap-2 text-sm font-semibold transition-colors ${post.isLikedByMe ? "text-[#EF4444]" : "text-[#94A3B8] hover:text-[#EF4444]"}`}>
                    <Heart className={`w-4 h-4 ${post.isLikedByMe ? "fill-current" : ""}`} />
                    {post.likesCount}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.commentsCount}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors ml-auto">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Sidebar - AI Recommendations */}
      <div className="space-y-4 hidden lg:block">
        <motion.div className="glass-card p-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#7B2CBF]" />
            <h3 className="font-bold text-white text-sm">AI Suggested Friends</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: "Alex Chen", score: "98% Match", lvl: 45 },
              { name: "Jordan Lee", score: "92% Match", lvl: 22 },
            ].map((friend) => (
              <div key={friend.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{friend.name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{friend.name}</p>
                    <p className="text-[10px] text-[#7B2CBF] font-semibold">{friend.score} · Lvl {friend.lvl}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card p-5 border border-[#F59E0B]/20" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="font-bold text-white text-sm">Trending Challenge</h3>
          </div>
          <div className="p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 mb-3">
            <p className="font-bold text-[#F59E0B] text-sm">10k Pushup Month</p>
            <p className="text-xs text-[#F59E0B]/70 mt-1">4,281 Athletes joined</p>
          </div>
          <button className="w-full py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0F19] font-bold text-xs rounded-lg transition-colors">
            Join Challenge
          </button>
        </motion.div>
      </div>
    </div>
  );
}
