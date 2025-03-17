import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";

import PostsListCard from "./PostCardsList";
import PageNotFound from "./PageNotFound";

import ToastContext from "../context/ToastContext";

import dateFormatter from "../library/dateFormatter";
import apiURLFetcher from "../library/apiURL";

export default function PostDetail() {
  const [post, setPost] = useState<PostDetailData | null>(null);
  const postUUID = useParams().uuid;
  const toast = useContext(ToastContext);
  const url = apiURLFetcher() + `/api/posts/${postUUID}`;

  useEffect(() => {
    // Fetch data and format it
    fetch(url, { credentials: "include" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then((json) => {
        if (json.success) {
          const newPost: PostDetailData = { ...json.data }
          newPost.created_at = dateFormatter(newPost.created_at);

          newPost.comments = newPost.comments.map(elem => {
            elem.created_at = dateFormatter(elem.avatar);
            return elem;
          });

          setPost({ ...newPost });
        } else {
          console.error(json);
        }
      });
  }, []);

  async function handleDelete() {
    const method = "DELETE";
    try {
      const p = await fetch(url, { method, credentials: "include" });
      const j: APIResponse<undefined> = await p.json();
      if (!p.ok) { throw new Error("Request Error") }
      if (!j.success) { throw new Error(j.message) }
      toast?.current?.showToast("Post Deleted! Redirecting in 3 seconds...", true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) { toast?.current?.showToast(err.message, false) }
    }
  }

  return (
    <>
      {post
        ?
        <PostsListCard
          userUUID={post.user_uuid}
          userHandle={post.handle}
          userAvatar={post.avatar}
          postUUID={post.post_uuid}
          postTime={post.created_at}
          postContent={post.content}
          likeCount={post.like_count}
          commentCount={post.comment_count}
          handleDelete={handleDelete}
          postLiked={post.post_liked}
          comments={post.comments}
          showCommentsOnLoad={true}
        />
        :
        <PageNotFound />
      }
    </>
  )
}
