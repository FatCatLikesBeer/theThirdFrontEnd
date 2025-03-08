import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";

import dateFormatter from "../library/dateFormatter";
import avatarFormatter from "../library/avatarFormatter";
import PostsListCard from "./PostCardsList";
import UserNotFound from "./UserNotFound";

import TwitterIcon from "./icons/TwitterIcon";
import InstagramIcon from "./icons/InstagramIcon";
import BlueSkyIcon from "./icons/BlueSkyIcon";
import GenericLinkIcon from "./icons/GenericLinkIcon";

import TrashModalContext from "../context/TrashModalContext";

const apiURL = String(import.meta.env.VITE_API_URL) + "/api/posts/";

export default function UserDetail() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [posts, setPosts] = useState<PostListData[] | null>(null);
  const trashModalRef = useContext(TrashModalContext) as React.RefObject<HTMLDialogElement>;
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
        if (json.success) {
          setPosts([...json.data]);
        } else {
          console.error(json.response.message);
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

  return (
    <>
      {user
        ?
        <div className="user-detail-container">
          <div className="user-detail-card">
            <h1 className="user-detail-user-name">{user.handle}</h1>
            {user.location && <p className="location">{user.location}</p>}
            <img className="user-avatar avatar-detail" src={user.avatar} style={{ margin: "auto" }} />
            <div className="user-detail-interactions">
              <div>
                <p>Posts</p>
                <p>{user.post_count || 0}</p>
              </div>
              <div>
                <p>Likes</p>
                <p>{user.like_count || 0}</p>
              </div>
              <div>
                <p>Friends</p>
                <p>{user.friend_count || 0}</p>
              </div>
            </div>
            <p>User since: {user.created_at}</p>
            <p>{user.about}</p>
            <div className="user-detail-link-panel">
              {user.blue_sky ? <a href={user.blue_sky} target="_blank"><BlueSkyIcon /></a> : null}
              {user.twitter ? <a href={user.twitter} target="_blank"><TwitterIcon /></a> : null}
              {user.instagram ? <a href={user.instagram} target="_blank"><InstagramIcon /></a> : null}
              {user.url_1 ? <a href={user.url_1} target="_blank"><GenericLinkIcon /></a> : null}
              {user.url_2 ? <a href={user.url_2} target="_blank"><GenericLinkIcon /></a> : null}
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
                    postUUID={elem.post_uuid}
                    postTime={elem.created_at}
                    postContent={elem.content}
                    likeCount={elem.like_count}
                    commentCount={elem.comment_count}
                    handleDelete={handleDelete(elem.post_uuid)}
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


