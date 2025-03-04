import { useState, useEffect, useRef } from "react";

import HomePageInput from "./HomePageInput";
import PostsListCard from "./PostCardsList";
import TrashModal from './TrashModal.tsx';

import PostListDataContext from "../context/PostListDataContext";
import TrashModalContext from '../context/TrashModalContext.ts';

export default function HomePagePosts() {
  const [posts, setPosts] = useState<PostListData[] | null>(null);
  const trashModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
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

  return (
    <PostListDataContext value={setPosts}>
      <TrashModalContext value={trashModalRef as React.RefObject<HTMLDialogElement>}>
        <div className="home-page-posts">
          <TrashModal />
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
                  userDisplayName={elem.display_name}
                  postUUID={elem.post_uuid}
                  postTime={elem.created_at}
                  postContent={elem.content}
                  likeCount={elem.like_count}
                  commentCount={elem.comment_count}
                />
              );
            })
            :
            <p>no posts</p>
          }
        </div>
      </TrashModalContext>
    </PostListDataContext>
  );
}
