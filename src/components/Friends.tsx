import { useState, useContext, useEffect } from "react";

import PostsListCard from "./PostCardsList";
import UserListCard from "./UserListCard";

import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

import avatarFormatter from "../library/avatarFormatter";

import type { ToastHandle } from "./Toast";

const apiURL = String(import.meta.env.VITE_API_URL);

export default function Friends() {
  const { uuid } = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const [selection, setSelection] = useState("friends");
  const [friendsPosts, setFriendsPosts] = useState<PostListData[] | null>(null);
  const [friendsList, setFriendsList] = useState<FriendListData[] | null>(null);

  useEffect(() => {
    (async function() {
      setFriendsPosts(await getFriendsPosts(toast));
      setFriendsList(await getFriendsList(uuid, toast));
    })();
  }, []);

  return (
    <>
      <div style={{ margin: "16px" }}>
        <button type="button" onClick={() => { setSelection("posts"); console.log("posts clicked") }}>Posts</button>
        <button type="button" onClick={() => { setSelection("friends"); console.log("friends clicked") }}>Friends</button>
      </div>
      <div>
        {selection === "posts" ?
          friendsPosts != null ?
            friendsPosts.map((elem: PostListData) => {
              return (
                <PostsListCard
                  key={crypto.randomUUID()}
                  userUUID={elem.user_uuid}
                  userHandle={elem.handle}
                  userAvatar={elem.avatar}
                  postUUID={elem.post_uuid}
                  postTime={elem.created_at}
                  postContent={elem.content}
                  likeCount={elem.like_count}
                  commentCount={elem.comment_count}
                  handleDelete={() => { }}
                  setStateFunction={setFriendsPosts}
                  postLiked={elem.post_liked}
                />
              );
            }) : <p>Nothing to see here</p>

          :
          friendsList != null ?
            friendsList.map((elem: FriendListData) => {
              let avatar = avatarFormatter(elem.avatar);
              return (
                <UserListCard handle={elem.handle}
                  avatar={avatar}
                  uuid={elem.uuid}
                  key={crypto.randomUUID()}
                  friend={true}
                  createdAt={elem.created_at}
                />
              );
            }) : <p>Nothing to see here</p>
        }
      </div>
    </>
  );
}

async function getFriendsList(
  uuid: string,
  toast: React.RefObject<ToastHandle | null> | null
): Promise<FriendListData[] | null> {
  let functionResult = null;
  try {
    const result = await fetch(`${apiURL}/api/friends/${uuid}`);
    const json: APIResponse<FriendListData[]> = await result.json();
    if (!result.ok) { throw new Error("Request error") }
    if (!json.success) { throw new Error(json.message) }
    functionResult = [...json.data as FriendListData[]];
  } catch (err: any) {
    toast?.current?.showToast(err.message, false);
  }
  return functionResult;
}

async function getFriendsPosts(
  toast: React.RefObject<ToastHandle | null> | null
): Promise<PostListData[] | null> {
  let functionResult = null;
  try {
    const result = await fetch(`${apiURL}/api/posts?friends=true`, { credentials: "include" });
    const json: APIResponse<PostListData[]> = await result.json();
    if (!result.ok) { throw new Error("Request error") }
    if (!json.success) { throw new Error(json.message) }
    functionResult = [...json.data as PostListData[]];
  } catch (err: any) {
    toast?.current?.showToast(err.message, false);
  }
  return functionResult;
}
