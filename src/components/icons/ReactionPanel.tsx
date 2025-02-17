import { useRef, useEffect } from "react";

import ThumbsUp from "./ThumbsUp";
import ChatIcon from "./ChatIcon";

/**
 * ReactionPanel component
 * Displays likes & comment count
 * @prop {number} size - size of like & comment icons, default 16
 * @prop {number | undefined | null} likeCount
 * @prop {number | undefined | null} commentCount
 * @prop {boolean} likeFill - fill thumbs up, default false
 * @prop {callback} likeCallback - action when like section is pressed
 * @prop {callback} commentCallback - action when comment section is pressed
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
  likeCount: number | undefined | null;
  commentCount: number | undefined | null;
  likeFill?: boolean;
  likeCallback: () => void;
  commentCallback: () => void;
}) {
  const likeRef = useRef<HTMLDivElement | null>(null);
  const commentRef = useRef<HTMLDivElement | null>(null);
  likeCount = likeCount || 0;
  commentCount = commentCount || 0;

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
