import { Link } from 'react-router';

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";

import ReactionPanel from './icons/ReactionPanel';

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
  function handleComment() { window.open(`/posts/${postUUID}`) }


  return (
    <div className="post-card-list-container">
      <img className="user-avatar avatar-list" src={avatar} />
      <Link to={`/users/${userUUID}`}><p>{userHandle}</p></Link>
      {userDisplayName != undefined
        ?
        <p>{userDisplayName}</p>
        :
        ""
      }
      <p>{date}</p>
      <p>{postContent}</p>
      <ReactionPanel
        size={20}
        likeCount={likeCount}
        commentCount={commentCount}
        likeFill={false}
        likeCallback={(): any => { console.log("Like as been pressed") }}
        commentCallback={handleComment}
      />
    </div>
  );
}
