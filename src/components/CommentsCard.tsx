import { useContext, CSSProperties } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";

import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";

import Trash from "./icons/Trash";

export default function CommentsCard({
  commentObject,
  handleDelete,
}: {
  commentObject: PostComments;
  handleDelete: () => void;
}) {
  const { uuid } = useContext(AuthContext);
  return (
    <>
      {commentObject?.content
        ?
        <div style={{ padding: "8px" }}>
          <div style={{ display: "flex", flexDirection: "row", margin: "0 0 8px 0", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Link to={`/users/${commentObject.user_uuid}`}>
                <img className="user-avatar avatar-list" src={avatarFormatter(commentObject.avatar)} />
              </Link>
              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "space-around",
                margin: "0 0 0 8px"
              }}>
                <p style={contentStyle}><Link to={`/users/${commentObject.user_uuid}`}>{commentObject?.handle}</Link></p>
                <p style={contentStyle}>{dateFormatter(commentObject.created_at)}</p>
              </div>
            </div>
            <div>
              {uuid === commentObject?.user_uuid ?
                <Trash callBack={handleDelete} />
                :
                null
              }
            </div>
          </div>
          <p style={contentStyle}>{commentObject?.content}</p>
        </div>
        :
        null
      }
    </>
  );
}

const contentStyle: CSSProperties = {
  margin: "0",
  fontSize: "small",
}
