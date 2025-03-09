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
import PersonPlus from "./icons/PersonPlus";
import PersonMinus from "./icons/PersonMinus";

import TrashModalContext from "../context/TrashModalContext";
import AuthContext from "../context/AuthContext";

const apiHost = String(import.meta.env.VITE_API_URL);

export default function UserDetail() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [posts, setPosts] = useState<PostListData[] | null>(null);
  const [friendsList, setFriendsList] = useState<FriendListData[] | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const trashModalRef = useContext(TrashModalContext) as React.RefObject<HTMLDialogElement>;
  const { uuid } = useContext(AuthContext);
  const params = useParams();

  useEffect(() => {
    // Get user details
    const apiUserURL = `${apiHost}/api/users/`;
    fetch(`${apiUserURL}${params.uuid}`)
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
    const apiPostsURL = `${apiHost}/api/posts`
    fetch(`${apiPostsURL}?user=${params.uuid}`)
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

    // Get Your friends list
    const apiFriendsURL = `${apiHost}/api/friends/${uuid}`;
    fetch(apiFriendsURL)
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Request Error");
        }
      })
      .then((j: APIResponse<FriendListData[]>) => {
        if (j.success) {
          const newFriendList = [...j.data as FriendListData[]];
          setFriendsList(newFriendList);
          isFriendParser(params.uuid, newFriendList, setIsFriend);
        } else {
          throw new Error(j.message);
        }
      })
      .catch((err: Error) => {
        setFriendsList(null);
        console.error(err.message);
      });
  }, []);

  function handleDelete(postUUID: string) {
    return () => {
      const returnValueJSON = {
        apiURL: apiHost + "/api/posts/" + postUUID,
        postUUID: postUUID,
      }
      trashModalRef.current.returnValue = JSON.stringify(returnValueJSON);
      trashModalRef.current.showModal();
    }
  }

  function isFriendParser(
    viewUserUUID: string | undefined,
    friendsList: FriendListData[] | null,
    setIsFriend: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    let match = false;
    if (friendsList && viewUserUUID) {
      friendsList.forEach((elem) => {
        if (viewUserUUID === elem.uuid) { match = true }
      });
    }
    setIsFriend(match);
  }

  return (
    <>
      {user
        ?
        <div className="user-detail-container">
          <div className="user-detail-card">
            <div className="user-detail-head-card">
              {uuid != params.uuid && <div className="user-detail-friend-icon" />}
              <h1 className="user-detail-user-name">{user.handle}</h1>
              {friendsList && uuid != params.uuid &&
                <div className="user-detail-friend-icon">
                  {isFriend ? <PersonMinus size={28} /> : <PersonPlus size={28} />}
                </div>
              }
            </div>
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
              {user.blue_sky ? <a href={`https://${user.blue_sky}.bsky.social`} target="_blank"><BlueSkyIcon /></a> : null}
              {user.twitter ? <a href={`https://www.twitter.com/${user.twitter}`} target="_blank"><TwitterIcon /></a> : null}
              {user.instagram ? <a href={`https://www.instagram.com/${user.instagram}`} target="_blank"><InstagramIcon /></a> : null}
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


