import { useState, useRef, ChangeEvent, useEffect, useContext } from "react";

import ToastContext from "../context/ToastContext";

import writingPrompt from "../library/writingPrompt";

const textLimit = 400;

const postUrl = String(import.meta.env.VITE_API_URL);

export default function HomePageInput({
  setPosts
}: {
  setPosts: React.Dispatch<React.SetStateAction<PostListData[] | null>>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [prompt] = useState(writingPrompt());
  const divRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const textLimitRef = useRef<null | HTMLParagraphElement>(null);
  const toastRef = useContext(ToastContext);

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value)
  }

  function handleClick() {
    const fetchDestination = `${postUrl}/api/posts?post=${inputValue}`;
    fetch(fetchDestination, {
      method: "POST",
      credentials: "include"
    })
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("");
        }
      })
      .then((j: APIResponse<PostListData>) => {
        if (j.success) {
          console.log(j);
          setInputValue("");
          setPosts((prevValue) => {
            if (null != prevValue) {
              const newValue = [...prevValue];
              newValue.unshift({ ...j.data as PostListData });
              return newValue;
            } else {
              const newValue: PostListData[] = [];
              newValue.push({ ...j.data as PostListData });
              return newValue
            }
          });
        } else {
          throw new Error(j.message);
        }
      })
      .catch((err: Error) => {
        toastRef?.current?.showToast(err.message, false);
      });
  }

  useEffect(() => {
    const textWarning = textLimit - 50;
    const textAlert = textLimit - 10;
    if ((inputValue.length >= textWarning) && (inputValue.length < textAlert)) {
      textLimitRef.current?.classList.add("yellow");
    } else if (inputValue.length >= textAlert) {
      textLimitRef.current?.classList.remove("yellow");
      textLimitRef.current?.classList.add("red");
    } else {
      textLimitRef.current?.classList.remove("yellow");
      textLimitRef.current?.classList.remove("red");
    }
  }, [inputValue]);

  return (
    <div ref={divRef} className="create-post-container">
      <p className="create-post-title">Share Something Cool!</p>
      <div className="create-post-input-container">
        <textarea
          className="create-post-textarea-element"
          ref={inputRef}
          onChange={handleInput}
          value={inputValue}
          placeholder={prompt}
        />
        <p className="characters-remaining" ref={textLimitRef}>{inputValue.length} / {textLimit}</p>
        <button
          className="create-post-submit-button"
          onClick={handleClick}
          type="button"
          disabled={textLimit <= inputValue.length}
        >Post</button>
      </div>
    </div>
  );
}
