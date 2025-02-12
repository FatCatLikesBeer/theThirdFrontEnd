import { useState, useEffect } from "react";

import { UserListCard } from "./UserListCard";

const avatarDefault = "http://my-bucket.mooo.com:9000/the-third/avatar.jpg";
const avatarTemplate = "http://my-bucket.mooo.com:9000/the-third/";

export const UserList = () => {
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(x => x.json())
      .then((users) => { if (users.success) { return users.data } })
      .then((listOfUsers) => { setUserList(listOfUsers) });
  }, []);

  return (
    <div>
      {userList.map((elem) => {

        let avatarLocation = avatarDefault;

        if (elem.avatar) {
          avatarLocation = `${avatarTemplate}${elem.avatar}.jpg`;
        }

        return (
          <UserListCard handle={elem.handle}
            avatar={avatarLocation}
            displayName={elem.display_name}
            uuid={elem.uuid}
            key={Math.floor(Math.random() * 10000000)} />
        );
      })}
    </div>
  );
}
