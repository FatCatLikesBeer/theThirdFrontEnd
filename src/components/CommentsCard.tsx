import { CSSProperties } from "react";

export default function CommentsCard() {
  return (
    <p style={{ margin: "0" }}>Comment Here</p>
  );
}

const borderPost: CSSProperties = {
  border: "solid grey 1px",
  borderTop: "none",
}

const borderPostLast: CSSProperties = {
  border: "solid grey 1px",
  borderTop: "none",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
}
