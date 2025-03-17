import { useRef, useEffect, useContext } from "react";

import ToastContext from "../../context/ToastContext";

import ThumbsUp from "./ThumbsUp";
import ChatIcon from "./ChatIcon";
import Share from "./Share";

/**
 * ReactionPanel component
 * Displays likes & comment count
 * @prop {number} size - size of like & comment icons, default 16
 * @prop {number | undefined | null} likeCount
 * @prop {number | undefined | null} commentCount
 * @prop {boolean} likeFill - fill thumbs up, default false
 * @prop {callback} likeCallback - action when like section is pressed
 * @prop {callback} commentCallback - action when comment section is pressed
 * @prop {string} shareUUID - Key of the resource your're sharing
 */
export default function ReactionPanel({
  size = 16,
  likeCount,
  commentCount,
  likeFill = false,
  likeCallback,
  commentCallback,
  shareUUID,
}: {
  size?: number;
  likeCount: number | undefined | null;
  commentCount: number | undefined | null;
  likeFill?: boolean;
  likeCallback: () => void;
  commentCallback: () => void;
  shareUUID: string;
}) {
  const likeRef = useRef<HTMLDivElement | null>(null);
  const commentRef = useRef<HTMLDivElement | null>(null);
  const toast = useContext(ToastContext);
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

  function shareCallBackGenerator(shareUUID: string) {
    return async function() {
      const target = `${window.location.origin}/posts/${shareUUID}`;
      try {
        await navigator.clipboard.writeText(target);
        toast?.current?.showToast("Link Coppied", true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast?.current?.showToast(err.message, false);
        }
      }
    }
  }

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
      <div className="reaction-share">
        <div className="panel-icon-comment"><Share callBack={shareCallBackGenerator(shareUUID)} /></div>
      </div>
    </div>
  );
}
