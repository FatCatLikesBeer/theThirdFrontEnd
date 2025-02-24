import { useState, useEffect } from "react";

import PostsListCard from "./PostCardsList";
import HomePageInput from "./HomePageInput";

export default function HomePagePosts() {
  const [posts, setPosts] = useState<PostListData[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        console.log(json);
        if (json.success) {
          setPosts([...json.data]);
        }
      });
  }, []);

  return (
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
  );
}
