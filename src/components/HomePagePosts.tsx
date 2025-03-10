import { useState, useEffect, useContext } from "react";

import HomePageInput from "./HomePageInput";
import PostsListCard from "./PostCardsList";

import PostListDataContext from "../context/PostListDataContext";
import TrashModalContext from "../context/TrashModalContext";

const apiURL = String(import.meta.env.VITE_API_URL) + "/api/posts/";

export default function HomePagePosts() {
  const [posts, setPosts] = useState<PostListData[] | null>(null);
  const trashModalRef = useContext(TrashModalContext) as React.RefObject<HTMLDialogElement>;

  useEffect(() => {
    fetch("http://localhost:3000/api/posts", { credentials: "include" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        if (json.success) {
          setPosts([...json.data]);
        }
      });
  }, []);

  function handleDelete(postUUID: string) {
    return () => {
      const returnValueJSON = {
        apiURL: apiURL + postUUID,
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
                setStateFunction={setPosts}
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
