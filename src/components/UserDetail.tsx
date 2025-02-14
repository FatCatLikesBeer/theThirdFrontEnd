import { useState, useEffect } from "react";
import { useParams } from "react-router";

import UserNotFound from "./UserNotFound";
import avatarFormatter from "../library/avatarFormatter";

export default function UserDetail() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const params = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${params.uuid}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then((json) => {
        if (json.response.success) {
          const newUser = { ...json.response.data }
          newUser.avatar = avatarFormatter(newUser.avatar);
          const date = new Date(newUser.created_at);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          newUser.created_at = formattedDate;
          setUser({ ...newUser });
        }
      });
  }, []);

  return (
    <>
      {user
        ?
        <div className="user-detail-card">
          <img className="user-avatar avatar-detail" src={user.avatar} />
          <div>
            <p>Handle: @{user.handle}</p>
            <p>User since: {user.created_at}</p>
            <p>Display name: {user.display_name}</p>
            <p>Location: {user.location}</p>
          </div>
        </div>
        :
        <UserNotFound />
      }
    </>
  );
}
