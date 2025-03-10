import { CSSProperties } from "react";
import { Link } from "react-router";

import dateFormatter from "../library/dateFormatter";

export default function UserListCard(props: any) {
  const handle = props.handle;
  const avatar = props.avatar;
  const uuid = props.uuid;
  const displayName = props.displayName;
  const friend = props.friend;
  const createdAt = props.createdAt;

  const displayDate = dateFormatter(createdAt);

  return (
    <Link to={`/users/${uuid}`}>
      <div style={styles.cardContainer}>
        <div>
          <img className="user-avatar avatar-list" src={avatar} />
        </div>
        <div>
          <p>{handle}</p>
          <p>{displayName}</p>
          {friend
            ?
            <p>Friend Since: {displayDate}</p>
            :
            <p>User Since: {displayDate}</p>
          }
        </div>
      </div>
    </Link>
  );
}

const styles: Record<string, CSSProperties> = {
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    borderRadius: "0.6rem",
    border: "red 2px solid"
  }
}
