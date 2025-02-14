import { useRef, useEffect } from "react";
import { CSSProperties } from "react";

export default function UserListCard(props: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handle = props.handle;
  const avatar = props.avatar;
  const uuid = props.uuid;
  const displayName = props.displayName;

  function handleClick() {
    window.location.href = `/users/${uuid}`;
  }

  useEffect(() => {
    cardRef.current?.addEventListener("click", handleClick);
    return () => {
      cardRef.current?.removeEventListener("click", handleClick);
    }
  }, []);

  return (
    <div style={styles.cardContainer} ref={cardRef}>
      <div>
        <img className="user-avatar avatar-list" src={avatar} />
      </div>
      <div>
        <p>@{handle}</p>
        <p>{displayName}</p>
      </div>
    </div>
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
