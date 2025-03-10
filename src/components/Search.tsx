import { useState, useRef, useContext } from "react";

import PostsListCard from "./PostCardsList";

import ToastContext from "../context/ToastContext";

export default function Search() {
  const [searchResults, setSearchResults] = useState<PostListData[] | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const toastRef = useContext(ToastContext);

  async function handleSearch() {
    try {
      const query = searchRef?.current?.value;
      const results = await fetch(`http://localhost:3000/api/posts?search=${query}`, { credentials: "include" });
      if (!results.ok) throw new Error("Request Error");
      const json: APIResponse<PostListData[]> = await results.json();
      if (!json.success) throw new Error(json.message);
      setSearchResults([...json.data as PostListData[]]);
    } catch (err: any) {
      toastRef?.current?.showToast(err.message, false);
    }
  }

  return (
    <div>
      <h1 className="page-title">Search</h1>
      <div>
        <input ref={searchRef} className="search-input" type="text" />
        <button type="button" onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div>
        {searchResults
          ?
          searchResults.map((elem: PostListData) => {
            return (
              <PostsListCard
                userHandle={elem.handle}
                userAvatar={elem.avatar}
                userUUID={elem.user_uuid}
                postUUID={elem.post_uuid}
                postContent={elem.content}
                postTime={elem.created_at}
                likeCount={elem.like_count}
                commentCount={elem.comment_count}
                handleDelete={() => { }}
                setStateFunction={setSearchResults}
                postLiked={elem.post_liked}
              />
            );
          })
          :
          <p>No Posts</p>
        }
      </div>
    </div>
  );
}

