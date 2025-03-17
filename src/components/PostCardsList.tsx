import { useContext, useState, CSSProperties } from 'react'
import { Link } from 'react-router';

import CommentsCard from './CommentsCard';
import CommentsInput from './CommentsInput';

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";
import apiURLFetcher from '../library/apiURL';

import ReactionPanel from './icons/ReactionPanel';
import Trash from './icons/Trash';

import ToastContext from '../context/ToastContext';

const contentLengthLimit = 150;
const localUUID = String(localStorage.getItem('uuid'));
const apiURL = apiURLFetcher();

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
  showCommentsOnLoad = false,
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
  showCommentsOnLoad?: boolean;
}) {
  const avatar = avatarFormatter(userAvatar);
  const date = dateFormatter(postTime);
  const toastRef = useContext(ToastContext);
  const [liked, setLiked] = useState(postLiked);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(likeCount || 0);
  const [commentsList, setCommentsList] = useState<PostComments[]>([]);
  const [numberOfComments, setNumberOfComments] = useState<number>(commentCount || 0);
  const [showComments, setShowComments] = useState(showCommentsOnLoad);

  async function handleLike() {
    const likesEndpoint = `${apiURL}/api/posts/${postUUID}/likes`;
    try {
      setLiked((prev) => {
        if (prev) {
          fetch(likesEndpoint, { method: "DELETE", credentials: "include" })
            .then(async (result) => {
              const json: APIResponse<null> = await result.json();
              if (!result.ok) { throw new Error("Could not delete like [001]") }
              if (!json.success) { throw new Error(json.message) }
              setNumberOfLikes((prev) => { return prev - 1 });
            })
            .catch((err: unknown) => {
              if (err instanceof Error) {
                toastRef?.current?.showToast(err.message, false);
              } else {
                toastRef?.current?.showToast("Could not delete like [002]", false);
              }
            });
        } else {
          fetch(likesEndpoint, { method: "POST", credentials: "include" })
            .then(async (result) => {
              const json: APIResponse<null> = await result.json();
              if (!result.ok) { throw new Error("Could not like post [001]") }
              if (!json.success) { throw new Error(json.message) }
              setNumberOfLikes((prev) => { return prev + 1 });
            })
            .catch((err: unknown) => {
              if (err instanceof Error) {
                toastRef?.current?.showToast(err.message, false);
              } else {
                toastRef?.current?.showToast("Could not like post [002]", false);
              }
            });
        }
        return !prev;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toastRef?.current?.showToast(err.message, false);
      } else {
        toastRef?.current?.showToast("Could not like post [003]", false);
      }
    }
  }

  function contentAsBlip(content: string): boolean {
    return contentLengthLimit >= content.length;
  }

  async function handleComment() {
    setShowComments((prev) => { return !prev });
    if (comments.length <= 0) {
      const fetchCommentsAPI = `${apiURL}/api/posts/${postUUID}/comments`;
      try {
        const response = await fetch(fetchCommentsAPI, { credentials: "include" });
        const json: APIResponse<PostComments[]> = await response.json();
        if (!response.ok) { throw new Error("Request error [001]") }
        if (!json.success) { throw new Error(json.message) }
        setCommentsList([...json.data?.reverse() as PostComments[]]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toastRef?.current?.showToast(err.message, false);
        } else {
          toastRef?.current?.showToast("Request error [002]", false);
        }
      }
    }
  }

  function handleCommentDelete(commentUUID: string): () => void {
    return function() {
      const method = "DELETE"
      const apiEndoint = `${apiURL}/api/posts/${postUUID}/comments/${commentUUID}`;
      fetch(apiEndoint, { credentials: "include", method: method })
        .then((r) => {
          if (r.ok) { return r.json() }
          else { throw new Error("Unable to delete comment [001]") }
        })
        .then((j: APIResponse<undefined>) => {
          if (j.success) {
            setNumberOfComments(prev => prev - 1);
            setCommentsList((prev) => {
              const newValue = prev.map((elem => {
                return elem.comment_uuid === commentUUID ? null : elem;
              })).filter((elem) => {
                return elem != null;
              });
              return newValue;
            });
            toastRef?.current?.showToast("Comment Deleted", true);
          }
          else { throw new Error(j.message) }
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            toastRef?.current?.showToast(err.message, false);
          } else {
            toastRef?.current?.showToast("Unable to delete comment [002]", false);
          }
        });
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
              likeCount={numberOfLikes}
              commentCount={numberOfComments}
              likeFill={liked}
              likeCallback={handleLike}
              commentCallback={handleComment}
              shareUUID={postUUID}
            />
          </div>
        </div>
        {showComments
          ?
          <div style={commentContainer}>
            <CommentsInput
              setCommentsList={setCommentsList}
              setNumberOfComments={setNumberOfComments}
              postUUID={postUUID}
            />
            {
              commentsList?.map((comment) => {
                return (
                  <CommentsCard
                    commentObject={comment}
                    key={crypto.randomUUID()}
                    handleDelete={handleCommentDelete(comment.comment_uuid)}
                  />
                )
              })
            }
          </div>
          :
          null
        }
      </div>
    </>
  );
}

const commentContainer: CSSProperties = {
  borderLeft: "solid 1px var(--accent-color)",
  borderRight: "solid 1px var(--accent-color)",
  borderBottom: "solid 1px var(--accent-color)",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
  margin: "0 auto",
  padding: "8px",
  maxWidth: "90%",
  // minWidth: "80%",
}
