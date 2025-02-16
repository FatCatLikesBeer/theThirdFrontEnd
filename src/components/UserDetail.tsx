import { useState, useEffect } from "react";
import { useParams } from "react-router";

import dateFormatter from "../library/dateFormatter";
import avatarFormatter from "../library/avatarFormatter";
import PostsListCard from "./PostCardsList";
import UserNotFound from "./UserNotFound";

export default function UserDetail() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [posts, setPosts] = useState<PostListData[] | null>(null);
  const params = useParams();

  useEffect(() => {
    // Get user
    fetch(`http://localhost:3000/api/users/${params.uuid}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then((json) => {
        console.log("user", json);
        if (json.success) {
          const newUser = { ...json.data }
          newUser.avatar = avatarFormatter(newUser.avatar);
          newUser.created_at = dateFormatter(newUser.created_at);
          setUser({ ...newUser });
        } else {
          console.error(json.message);
        }
      });

    // get posts
    fetch(`http://localhost:3000/api/posts?user=${params.uuid}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then((json) => {
        console.log("posts", json);
        if (json.success) {
          setPosts([...json.data]);
        } else {
          console.error(json.response.message);
        }
      });
  }, []);

  return (
    <>
      {user
        ?
        <div className="user-detail-container">
          <div className="user-detail-card">
            <img className="user-avatar avatar-detail" src={user.avatar} />
            <div>
              <p>Handle: @{user.handle}</p>
              <p>User since: {user.created_at}</p>
              <p>Display name: {user.display_name}</p>
              <p>Location: {user.location}</p>
            </div>
          </div>
          <div className="user-posts">
            {posts
              ?
              posts.map((elem: PostListData) => {
                return (
                  <PostsListCard
                    key={Math.floor(Math.random() * 1000000)}
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
              ""
            }
          </div>
        </div>
        :
        <UserNotFound />
      }
    </>
  );
}


