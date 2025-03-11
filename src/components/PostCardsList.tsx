import { useContext, useState } from 'react';
import { Link } from 'react-router';

import CommentsCard from './CommentsCard';

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";

import ReactionPanel from './icons/ReactionPanel';
import Trash from './icons/Trash';

import ToastContext from '../context/ToastContext';

const contentLengthLimit = 150;
const localUUID = String(localStorage.getItem('uuid'));
const apiURL = String(import.meta.env.VITE_API_URL);

export default function PostsListCard({
  userUUID,
  userHandle,
  userAvatar,
  postUUID,
  postTime,
  postContent,
  likeCount,
  commentCount,
  handleDelete,
  postLiked,
  comments,
  setStateFunction,
}: {
  userUUID: string;
  userHandle: string;
  userAvatar: string;
  postUUID: string;
  postTime: string;
  postContent: string;
  likeCount: number;
  commentCount: number;
  postLiked: boolean;
  handleDelete: () => void;
  comments: PostComments[];
  setStateFunction: React.Dispatch<React.SetStateAction<PostListData[] | null>>;
}) {
  const avatar = avatarFormatter(userAvatar);
  const date = dateFormatter(postTime);
  const toastRef = useContext(ToastContext);
  const [showComments, setShowComments] = useState(true);

  async function handleLike() {
    const likesEndpoint = `${apiURL}/api/posts/${postUUID}/likes`;
    try {
      if (postLiked) {
        const result = await fetch(likesEndpoint, { method: "DELETE", credentials: "include" });
        const json: APIResponse<null> = await result.json();
        if (!result.ok) { throw new Error("Could not delete like") }
        if (!json.success) { throw new Error(json.message) }
        setStateFunction((prevValue) => {
          if (prevValue) {
            const newValue = prevValue.map(elem => {
              return elem.post_uuid === postUUID ?
                { ...elem, post_liked: false, like_count: elem.like_count - 1, }
                : elem;
            });
            return newValue;
          } else {
            return prevValue;
          }
        });
      } else {
        const result = await fetch(likesEndpoint, { method: "POST", credentials: "include" });
        const json: APIResponse<null> = await result.json();
        if (!result.ok) { throw new Error("Could not like post") }
        if (!json.success) { throw new Error(json.message) }
        setStateFunction((prevValue) => {
          if (prevValue) {
            const newValue = prevValue.map(elem => {
              return elem.post_uuid === postUUID ?
                { ...elem, post_liked: true, like_count: elem.like_count + 1, }
                : elem;
            });
            return newValue;
          } else {
            return prevValue;
          }
        });
      }
    } catch (err: any) {
      toastRef?.current?.showToast(err.message, false);
    }
  }

  function contentAsBlip(content: string): boolean {
    return contentLengthLimit >= content.length;
  }

  async function handleComment() {
    if (comments.length <= 0) {
      const fetchCommentsAPI = `${apiURL}/api/posts/${postUUID}/comments`;
      try {
        const response = await fetch(fetchCommentsAPI, { credentials: "include" });
        const json: APIResponse<PostComments[]> = await response.json();
        if (!response.ok) { throw new Error("Request error") }
        if (!json.success) { throw new Error(json.message) }
        setStateFunction((prevValue) => {
          let newValue = [...prevValue as PostListData[]];
          newValue = newValue.map((elem) => {
            return elem.post_uuid === postUUID ? { ...elem, comments: [...json.data as PostComments[]] } : elem;
          });
          return newValue;
        });
      } catch (err: any) {
        toastRef?.current?.showToast(err.message, false);
      }
    } else {
      setShowComments(prev => !prev);
    }
  }

  return (
    <>
      <div className="post-card-list-container">
        <div className="post-card-list-border">
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
              likeFill={postLiked}
              likeCallback={handleLike}
              commentCallback={handleComment}
            />
          </div>
        </div>
        {(comments.length > 0) && showComments
          ?
          <>
            <p>Comment input element goes here</p>
            {
              comments.map(() => {
                return (
                  <CommentsCard
                    key={crypto.randomUUID()}
                  />
                )
              })
            }
          </>
          :
          null
        }
      </div>
    </>
  );
}
