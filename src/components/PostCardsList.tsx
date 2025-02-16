import { Link } from 'react-router';

import avatarFormatter from "../library/avatarFormatter";

import dateFormatter from "../library/dateFormatter";

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
      <p>likes: {likeCount}</p>
      <p>comments: {commentCount}</p>
    </div>
  );
}
