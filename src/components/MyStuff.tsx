import { useContext, useState, useEffect } from "react";

import PostsListCard from "./PostCardsList";

import ToastContext from "../context/ToastContext";
import AuthContext from "../context/AuthContext";

import apiURLFetcher from "../library/apiURL";

const apiURL = apiURLFetcher();

export default function MyStuff() {
  const [posts, setPosts] = useState<null | PostListData[]>(null);
  const toast = useContext(ToastContext);
  const { uuid } = useContext(AuthContext);

  useEffect(() => {
    const apiEndpoint = `${apiURL}/api/posts?user=${uuid}`;
    fetch(apiEndpoint, { credentials: "include" })
      .then(r => {
        if (r.ok) { return r.json() }
        else { throw new Error("Request error") }
      })
      .then((j: APIResponse<PostListData[]>) => {
        if (j.success) {
          setPosts([...j.data as PostListData[]]);
        }
        else { throw new Error(j.message) }
      })
      .catch((err: Error) => {
        toast?.current?.showToast(err.message, false);
      })
  }, []);

  function handleDelete(postUUID: string) {
    const apiEndpoint = `${apiURL}/api/posts/${postUUID}`;
    const method = "DELETE";
    return function() {
      fetch(apiEndpoint, { credentials: "include", method })
        .then(r => {
          if (r.ok) { return r.json() }
          else { throw new Error("Request error") }
        })
        .then((j: APIResponse<undefined>) => {
          if (j.success) {
            setPosts((prev) => {
              const newValue = prev?.map((elem) => {
                return elem.post_uuid != postUUID ? elem : null;
              }).filter((elem) => { return elem != null });
              return newValue || prev;
            });
          } else { throw new Error(j.message) }
        })
        .catch((err: Error) => {
          toast?.current?.showToast(err.message, false);
        })
    }
  }

  return (
    <div>
      <h1 className="page-title">My Stuff</h1>
      {posts
        ?
        posts.map((elem) => {
          return (
            <PostsListCard
              key={crypto.randomUUID()}
              userUUID={elem.user_uuid}
              userHandle={elem.handle}
              userAvatar={elem.avatar}
              postUUID={elem.post_uuid}
              postContent={elem.content}
              postTime={elem.created_at}
              postLiked={elem.post_liked}
              comments={elem.comments}
              commentCount={elem.comment_count}
              likeCount={elem.like_count}
              handleDelete={handleDelete(elem.post_uuid)}
            />
          );
        })
        :
        "No posts to display"
      }
    </div>
  );
}
