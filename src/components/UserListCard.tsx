import { useRef, useEffect } from "react";

export const UserListCard = (props: any) => {
  const refDiv = useRef<HTMLDivElement>(null);
  const handle = props.handle;
  const avatar = props.avatar;
  const uuid = props.uuid;
  const displayName = props.displayName;

  function handleClick() {
    console.log(`${handle} has been clicked!`);
  }

  useEffect(() => {
    refDiv.current?.addEventListener("click", handleClick);
    return () => {
      refDiv.current?.removeEventListener("click", handleClick);
    }
  }, []);

  return (
    <div ref={refDiv}>
      <img src={avatar} />
      <p>{uuid}</p>
      <p>{displayName}</p>
      <p>{handle}</p>
    </div>
  );
}
