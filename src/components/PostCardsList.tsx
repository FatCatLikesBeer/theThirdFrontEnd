import { Link } from 'react-router';

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";

import ReactionPanel from './icons/ReactionPanel';

const contentLengthLimit = 150;

export default function PostsListCard({
  userUUID,
  userHandle,
  userAvatar,
  userDisplayName,
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
  const avatar = avatarFormatter(userAvatar);
  const date = dateFormatter(postTime);
  function handleComment() { window.open(`/posts/${postUUID}`, "_self") }
  function handleLike() {
    // requires auth
  }

  function contentAsBlip(content: string): boolean {
    return contentLengthLimit >= content.length;
  }

  return (
    <div className="post-card-list-container">
      <div className="post-card-list-padding">
        <div className="user-header-detail">
          <img className="user-avatar avatar-list" src={avatar} alt={`Avatar for user ${userHandle}`} />
          <div className="user-header-names">
            <p><Link to={`/users/${userUUID}`}>{userHandle}</Link></p>
            <p>{date}</p>
          </div>
        </div>
        <div className="post-content">
          <p className={contentAsBlip(postContent) ? "blip" : ""} >{postContent}</p>
        </div>
        <ReactionPanel
          size={20}
          likeCount={likeCount}
          commentCount={commentCount}
          likeFill={false}
          likeCallback={(): any => { console.log("Like as been pressed") }}
          commentCallback={handleComment}
        />
      </div>
    </div>
  );
}
