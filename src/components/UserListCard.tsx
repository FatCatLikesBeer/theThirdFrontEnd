import { CSSProperties } from "react";
import { Link } from "react-router";

import dateFormatter from "../library/dateFormatter";

export default function UserListCard(props: any) {
  const handle = props.handle;
  const avatar = props.avatar;
  const uuid = props.uuid;
  const friend = props.friend;
  const createdAt = props.createdAt;

  const displayDate = dateFormatter(createdAt);

  return (
    <Link to={`/users/${uuid}`}>
      <div className="user-card-list-container">
        <div style={paddingContainer}>
          <img className="user-avatar avatar-list" src={avatar} />
          <div style={textContainer}>
            <p style={text}>{handle}</p>
            <p style={text}>{friend ? "Friend" : "User"} Since: {displayDate}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

const text: CSSProperties = {
  margin: "0",
}

const textContainer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  marginLeft: "8px",
}

const paddingContainer: CSSProperties = {
  padding: "8px",
  display: "flex",
  flexDirection: "row",
  alignContent: "center",
}
