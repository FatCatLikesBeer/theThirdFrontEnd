import { CSSProperties } from "react";
import { Link } from "react-router";

export default function UserListCard(props: any) {
  const handle = props.handle;
  const avatar = props.avatar;
  const uuid = props.uuid;
  const displayName = props.displayName;

  return (
    <Link to={`/users/${uuid}`}>
      <div style={styles.cardContainer}>
        <div>
          <img className="user-avatar avatar-list" src={avatar} />
        </div>
        <div>
          <p>@{handle}</p>
          <p>{displayName}</p>
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
