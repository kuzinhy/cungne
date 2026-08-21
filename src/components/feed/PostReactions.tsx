import React, { useState } from "react";
import { Heart, ThumbsUp, Flame, Laugh, Eye } from "lucide-react";
import { ReactionType } from "../../types";

interface PostReactionsProps {
  currentReaction?: ReactionType | null;
  likesCount: number;
  reactions?: Record<string, number>;
  onReact: (type: ReactionType) => void;
}

const REACTIONS_MAP: { type: ReactionType; label: string; icon: string; color: string }[] = [
  { type: "love", label: "Yêu thích", icon: "❤️", color: "text-rose-500" },
  { type: "fire", label: "Cháy", icon: "🔥", color: "text-amber-500" },
  { type: "like", label: "Thích", icon: "👍", color: "text-blue-500" },
  { type: "haha", label: "Haha", icon: "😂", color: "text-yellow-500" },
  { type: "wow", label: "Wow", icon: "😮", color: "text-purple-500" },
];

export const PostReactions: React.FC<PostReactionsProps> = ({
  currentReaction,
  likesCount,
  reactions,
  onReact
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const activeReactionObj = REACTIONS_MAP.find((r) => r.type === currentReaction);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowPicker(true)}
      onMouseLeave={() => setShowPicker(false)}
    >
      {/* Floating Reaction Bar on Hover */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 z-30 animate-in fade-in zoom-in-90 duration-150">
          {REACTIONS_MAP.map((r) => (
            <button
              key={r.type}
              onClick={(e) => {
                e.stopPropagation();
                onReact(r.type);
                setShowPicker(false);
              }}
              className="p-1.5 hover:scale-130 transition-transform text-lg leading-none rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              title={r.label}
            >
              {r.icon}
            </button>
          ))}
        </div>
      )}

      {/* Main reaction toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReact(currentReaction ? currentReaction : "love");
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          currentReaction
            ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        {activeReactionObj ? (
          <span className="text-base leading-none">{activeReactionObj.icon}</span>
        ) : (
          <Heart className="w-4 h-4" />
        )}
        <span>{likesCount > 0 ? likesCount : "Thích"}</span>
      </button>
    </div>
  );
};
