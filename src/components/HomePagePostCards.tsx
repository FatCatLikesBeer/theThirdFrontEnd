import avatarFormatter from "../library/avatarFormatter";

import dateFormatter from "../library/dateFormatter";

export default function HomePagePostCards(props: any) {
  props.userUUID;
  props.userHandle;
  props.userAvatar;
  props.userDisplayName;
  props.postUUID;
  props.postTime;
  props.postContent;
  props.likeCount;
  props.commentCount;

  const avatar = avatarFormatter(props.userAvatar);
  const date = dateFormatter(props.postTime);

  return (
    <div>
      <img className="user-avatar avatar-list" src={avatar} />
      <p>{props.userHandle}</p>
      <p>{date}</p>
      <p>{props.postContent}</p>
      <p>likes: {props.likeCount}</p>
      <p>comments: {props.commentCount}</p>
    </div>
  );
}


