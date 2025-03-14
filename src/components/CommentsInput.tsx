import { useState, useRef, useContext, CSSProperties } from "react";

import Send from "./icons/Send";

import ToastContext from "../context/ToastContext";

const textLimit = 200;

const apiURL = String(import.meta.env.VITE_API_URL);

export default function CommentsInput({
  postUUID,
  setCommentsList,
  setNumberOfComments,
}: {
  postUUID: string;
  setCommentsList: React.Dispatch<React.SetStateAction<PostComments[]>>;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const toast = useContext(ToastContext);
  const percentage = Math.min((text.length / textLimit) * 100, 100);
  const circumfrence = 2 * Math.PI * 16;
  const strokeDashOffset = circumfrence - (percentage / 100) * circumfrence;

  function handleClick() {
    const apiEndpoint = `${apiURL}/api/posts/${postUUID}/comments?content=${text}`;
    const method = "POST";
    setCommentsList((prevState) => {
      const newState = [...prevState];
      fetch(apiEndpoint, { method: method, credentials: "include" })
        .then(r => {
          if (r.ok) { return r.json() }
          else { throw new Error("Request Error") }
        })
        .then((j: APIResponse<PostComments>) => {
          console.log(j);
          if (j.success) {
            newState.reverse().push(j.data as PostComments);
            newState.reverse();
            setNumberOfComments(prev => prev + 1);
            setText("");
          } else { throw new Error(j.message) }
        })
        .catch((err: Error) => {
          toast?.current?.showToast(err.message, false);
        });
      return newState;
    });
  }

  const limitColor = percentage < 90 ? percentage < 80 ? "lightgrey" : "orange" : "red";

  return (
    <div style={containerStyle}>
      <textarea
        ref={textAreaRef}
        style={inputStyle}
        value={text}
        maxLength={textLimit}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={sidePanelContaner}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 40 40"
          style={circleBox}
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="0"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke={limitColor}
            strokeWidth="4"
            strokeDasharray={circumfrence}
            strokeDashoffset={strokeDashOffset}
            strokeLinecap="round"
            transform="rotate(-90 20 20 )"
          />
        </svg>
        <Send callBack={handleClick} />
      </div>
    </div>
  );
}

const sidePanelContaner: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}

const circleBox: CSSProperties = {
  margin: "12px 4px 0px 8px",
  transform: "translateY(-50%)",
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}

const inputStyle: CSSProperties = {
  border: "solid 1px var(--accent-color)",
  borderRadius: "8px",
  backgroundColor: "var(--background-color)",
  marginBottom: "8px",
  color: "var(--text-color)",
  padding: "8px",
  height: "3rem",
  width: "95%",
}
