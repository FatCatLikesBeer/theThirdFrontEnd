import { useState, useEffect } from "react";

import avatarFormatter from "../library/avatarFormatter";
import UserListCard from "./UserListCard";

export default function UserList() {
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(x => x.json())
      .then((users) => { if (users.success) { return users.data } })
      .then((listOfUsers) => { setUserList(listOfUsers) });
  }, []);

  return (
    <div>
      {userList.toReversed().map((elem) => {

        let avatar = avatarFormatter(elem.avatar);

        return (
          <UserListCard handle={elem.handle}
            avatar={avatar}
            displayName={elem.display_name}
            uuid={elem.uuid}
            key={crypto.randomUUID()}
            createdAt={elem.created_at}
          />
        );
      })}
    </div>
  );
}
