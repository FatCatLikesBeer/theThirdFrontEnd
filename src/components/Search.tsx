import { useState, useContext, useEffect } from "react";

import { useSearchParams } from "react-router";

import PostsListCard from "./PostCardsList";

import ToastContext from "../context/ToastContext";

const apiURL = String(import.meta.env.VITE_API_URL);

export default function Search() {
  const [emptyResultsPlaceholder, setEmptyResultPlaceholder] = useState("Search For Something");
  const [textInput, setTextInput] = useState("");
  const [queries, setQueries] = useSearchParams();
  const [radio, setRadio] = useState("search");
  const [searchResults, setSearchResults] = useState<PostListData[] | null>(null);
  const toastRef = useContext(ToastContext);

  useEffect(() => {
    // q => search
    // user => user
    let value: string | null = null;
    let query: string | null = null;
    const q = queries.get("q");
    const user = queries.get("user");
    if (q) { query = "search", value = q } else if (user) { query = "user", value = user };
    if (query) {
      try {
        (async function() {
          setTextInput(value as string);
          const results = await fetch(`${apiURL}/api/posts?${query}=${value}`, { credentials: "include" });
          const json: APIResponse<PostListData[]> = await results.json();
          if (!results.ok) { throw new Error("Could not load posts") }
          if (!json.success) { throw new Error(json.message) }
          setSearchResults([...json.data as PostListData[]]);
        })();
      } catch (err: any) {
        toastRef?.current?.showToast(err.message, false);
      } finally {
        setEmptyResultPlaceholder("No Results Found");
      }
    }
  }, []);

  async function handleSearch() {
    try {
      const newQuery: { q?: string, user?: string, } = {}
      if ("search" === radio) { newQuery.q = textInput }
      else { newQuery.user = textInput }
      setQueries({ ...newQuery });

      const results = await fetch(`${apiURL}/api/posts?${radio}=${textInput}`, { credentials: "include" });
      const json: APIResponse<PostListData[]> = await results.json();
      if (!results.ok) { throw new Error("Could not load posts") }
      if (!json.success) { throw new Error(json.message) }
      setSearchResults([...json.data as PostListData[]]);
    } catch (err: any) {
      toastRef?.current?.showToast(err.message, false);
    } finally {
      setEmptyResultPlaceholder("No Results Found");
    }
    console.log(searchResults);
  }

  return (
    <div>
      <h1 className="page-title">Search</h1>
      <div>
        <input className="search-input" type="text" value={textInput} onChange={(e) => { setTextInput(e.target.value) }} />
        <button type="button" onClick={handleSearch} className="search-button">Search</button>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem", margin: "10px 0px" }}>
          <label><input
            type="radio"
            name="posts"
            value="search"
            checked={radio === "search"}
            onChange={(e) => { setRadio(e.target.value) }}
          />Posts</label>
          <label><input
            type="radio"
            name="user"
            value="user"
            checked={radio === "user"}
            onChange={(e) => { setRadio(e.target.value) }}
          />Users</label>
        </div>
      </div>
      <div>
        {searchResults && searchResults.length > 0
          ?
          searchResults.map((elem: PostListData) => {
            return (
              <PostsListCard
                key={crypto.randomUUID()}
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
          <h2>{emptyResultsPlaceholder}</h2>
        }
      </div>
    </div>
  );
}

