import { useState, useEffect, useContext } from "react";

import HomePageInput from "./HomePageInput";
import PostsListCard from "./PostCardsList";

import PostListDataContext from "../context/PostListDataContext";
import TrashModalContext from "../context/TrashModalContext";
import ToastContext from "../context/ToastContext";

import apiURLFetcher from "../library/apiURL";

const apiURL = apiURLFetcher() + "/api/posts";

export default function HomePagePosts() {
  const [posts, setPosts] = useState<PostListData[] | null>(null);
  const trashModalRef = useContext(TrashModalContext) as React.RefObject<HTMLDialogElement>;
  const toast = useContext(ToastContext);

  useEffect(() => {
    (async function() {
      try {
        console.log("First Fetch: [91736]");
        const r = await fetch(apiURL, { credentials: "include" });
        const j: APIResponse<PostListData[]> = await r.json();
        if (!r.ok) {
          console.error("Failed at request: [01638]");
          throw new Error("Request Error: Could not request for posts: [16392]");
        }
        if (!j.success) {
          console.error("Failed at json: [01008]");
          throw new Error(j.message + ": [01862]")
        }
        setPosts([...j.data as PostListData[]]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          toast?.current?.showToast(err.message, false);
        }
      }
    })();
  }, []);

  function handleDelete(postUUID: string) {
    return () => {
      const returnValueJSON = {
        apiURL: apiURL + "/" + postUUID,
        postUUID: postUUID,
      }
      trashModalRef.current.returnValue = JSON.stringify(returnValueJSON);
      trashModalRef.current.showModal();
    }
  }

  useEffect(() => {
    function handleTrashModalClose() {
      if ("canceled" != trashModalRef.current.returnValue) {
        setPosts((prevValue) => {
          if (prevValue != null) {
            const newValue: PostListData[] = [];
            prevValue.forEach((elem) => {
              if (elem.post_uuid != trashModalRef.current.returnValue) {
                newValue.push(elem);
              }
            });
            return newValue;
          } else {
            return prevValue;
          }
        });
      }
    }
    trashModalRef.current.addEventListener("close", handleTrashModalClose);
  }, []);

  return (
    <PostListDataContext value={setPosts}>
      <div className="home-page-posts">
        <div id="create-post" />
        <HomePageInput />
        {posts
          ?
          posts.map((elem: PostListData) => {
            return (
              <PostsListCard
                key={Math.floor(Math.random() * 10000000)}
                userUUID={elem.user_uuid}
                userHandle={elem.handle}
                userAvatar={elem.avatar}
                postUUID={elem.post_uuid}
                postTime={elem.created_at}
                postContent={elem.content}
                likeCount={elem.like_count}
                commentCount={elem.comment_count}
                handleDelete={handleDelete(elem.post_uuid)}
                comments={elem.comments}
                postLiked={elem.post_liked}
              />
            );
          })
          :
          <p>no posts</p>
        }
      </div>
    </PostListDataContext>
  );
}
