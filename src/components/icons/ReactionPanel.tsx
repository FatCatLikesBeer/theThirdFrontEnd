import { useRef, useEffect } from "react";

import ThumbsUp from "./ThumbsUp";
import ChatIcon from "./ChatIcon";

/**
 * ReactionPanel component
 * @prop {number} size - size of like & comment icons, default 16
 * @prop {number} likeCount
 * @prop {number} commentCount
 * @prop {boolean} likeFill - fill thumbs up, default false
 */
export default function ReactionPanel({
  size = 16,
  likeCount,
  commentCount,
  likeFill = false,
  likeCallback,
  commentCallback,
}: {
  size?: number;
  likeCount: number;
  commentCount: number;
  likeFill?: boolean;
  likeCallback: () => void;
  commentCallback: () => void;
}) {
  const likeRef = useRef<HTMLDivElement | null>(null);
  const commentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    likeRef.current?.addEventListener("click", likeCallback);
    commentRef.current?.addEventListener("click", commentCallback);
    return (() => {
      likeRef.current?.removeEventListener("click", likeCallback);
      commentRef.current?.removeEventListener("click", commentCallback);
    });
  }, []);

  return (
    <div className="reaction-panel">
      <div ref={likeRef} className="reaction-likes">
        <div className="panel-icon-like"><ThumbsUp size={size} fill={likeFill} /></div>
        <div className="panel-number">{likeCount}</div>
      </div>
      <div ref={commentRef} className="reaction-comments">
        <div className="panel-icon-comment"><ChatIcon size={size} /></div>
        <div className="panel-number">{commentCount}</div>
      </div>
    </div>
  );
}
