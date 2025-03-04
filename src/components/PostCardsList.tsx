import { useContext } from "react";
import { Link } from 'react-router';

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";

import ReactionPanel from './icons/ReactionPanel';
import Trash from './icons/Trash';

import TrashModalContext from '../context/TrashModalContext';

const apiURL = String(import.meta.env.VITE_API_URL) + "/api/posts"
const contentLengthLimit = 150;
const localUUID = String(localStorage.getItem('uuid'));

export default function PostsListCard({
  userUUID,
  userHandle,
  userAvatar,
  postUUID,
  postTime,
  postContent,
  likeCount,
  commentCount,
}: {
  userUUID: string;
  userHandle: string;
  userAvatar: string;
  userDisplayName: string;
  postUUID: string;
  postTime: string;
  postContent: string;
  likeCount: number;
  commentCount: number;
}) {
  const trashModalRef = useContext(TrashModalContext) as React.RefObject<HTMLDialogElement>;
  const avatar = avatarFormatter(userAvatar);
  const date = dateFormatter(postTime);
  function handleComment() { window.open(`/posts/${postUUID}`, "_self") }

  function handleLike() {
    // handle the link
  }

  function handleDelete() {
    trashModalRef.current.returnValue = apiURL + `/${postUUID}`;
    trashModalRef.current.showModal();
  }

  function contentAsBlip(content: string): boolean {
    return contentLengthLimit >= content.length;
  }

  return (
    <div className="post-card-list-container">
      <div className="post-card-list-padding">
        <div className="flex-space-between">
          <div className="user-header-detail">
            <img className="user-avatar avatar-list" src={avatar} alt={`Avatar for user ${userHandle}`} />
            <div className="user-header-names">
              <p><Link to={`/users/${userUUID}`}>{userHandle}</Link></p>
              <p>{date}</p>
            </div>
          </div>
          {localUUID === userUUID ? <Trash callBack={handleDelete} /> : null}
        </div>
        <div className="post-content">
          <p className={contentAsBlip(postContent) ? "blip" : ""} >{postContent}</p>
        </div>
        <ReactionPanel
          size={20}
          likeCount={likeCount}
          commentCount={commentCount}
          likeFill={false}
          likeCallback={handleLike}
          commentCallback={handleComment}
        />
      </div>
    </div>
  );
}
