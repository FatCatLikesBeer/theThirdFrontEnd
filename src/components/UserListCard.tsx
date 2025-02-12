export const UserListCard = (props: any) => {
  const handle = props.handle;
  const avatar = props.avatar;
  const uuid = props.uuid;
  const displayName = props.displayName;

  return (
    <div>
      <img src={avatar} />
      <p>{uuid}</p>
      <p>{displayName}</p>
      <p>{handle}</p>
    </div>
  );
}
