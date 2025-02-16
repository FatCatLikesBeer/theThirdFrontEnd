import { useState, useEffect } from "react";

import PostsListCard from "./PostCardsList";

export default function HomePagePosts() {
  const [posts, setPosts] = useState<any[]>([null]);

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
      <div className="home-post-input">
        <p>Post input should go here</p>
      </div>
      {posts[0]
        ?
        posts.map((elem: PostListData) => {
          return (
            <>
              <PostsListCard
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
            </>
          );
        })
        :
        <p>no posts</p>
      }
    </div>
  );
}
