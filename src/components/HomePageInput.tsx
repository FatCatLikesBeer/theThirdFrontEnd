import AuthContext from "../context/AuthContext";
import { useState, useEffect, useRef, useContext, ChangeEvent } from "react";

export default function HomePageInput() {
  const { auth, setAuth } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const divRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLTextAreaElement>(null);

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value)
    console.log(event.target.value);
  }

  function handleClick() {
  }

  useEffect(() => {
  }, []);

  return (
    <div ref={divRef} className="create-post-container">
      <p className="create-post-title">Share Something Cool!</p>
      <div className="create-post-input-container">
        <textarea
          className="create-post-input-element"
          ref={inputRef}
          onChange={handleInput}
          value={inputValue}
          placeholder="Text goes here!"
        />
        <button className="create-post-submit-button" onClick={handleClick} type="button">Post</button>
      </div>
    </div>
  );
}
