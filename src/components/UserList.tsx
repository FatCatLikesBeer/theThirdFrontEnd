import { useState, useEffect } from "react";

import apiURLFetcher from "../library/apiURL";
import avatarFormatter from "../library/avatarFormatter";
import UserListCard from "./UserListCard";

const apiURL = apiURLFetcher();

export default function UserList() {
  const [userList, setUserList] = useState<APIUserData[]>([]);

  useEffect(() => {
    fetch(`${apiURL}/api/users`)
      .then(x => x.json())
      .then((users) => { if (users.success) { return users.data } })
      .then((listOfUsers) => { setUserList(listOfUsers) });
  }, []);

  return (
    <div>
      {userList.toReversed().map((elem: APIUserData) => {

        const avatar = avatarFormatter(elem.avatar);

        return (
          <UserListCard
            key={crypto.randomUUID()}
            handle={elem.handle}
            avatar={avatar}
            uuid={elem.uuid}
            friend={false}
            created_at={elem.created_at}
          />
        );
      })}
    </div>
  );
}
