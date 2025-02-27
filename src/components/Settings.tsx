import { useContext, useEffect, useState } from 'react';
import AuthContext from "../context/AuthContext";

import avatarFormatter from '../library/avatarFormatter';
import dateFormatter from '../library/dateFormatter';

const apiURL = String(import.meta.env.VITE_API_URL) + "/api";

export default function Settings() {
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const { uuid } = useContext(AuthContext);

  useEffect(() => {
    const formattedAPIURL = apiURLFormatter(uuid);
    fetch(formattedAPIURL)
      .then(response => {
        if (!response.ok) { throw new Error("Request Error") }
        return response.json();
      })
      .then(json => {
        if (!json.success) { throw new Error(json.message) }
        setUserData({ ...json.data });
        return json.data;
      })
      .catch(err => {
        console.error("Settings page error");
        console.error(err);
      });
  }, []);

  return (
    <>
      {userData
        ?
        <div>
          <h1 className="page-title">Settings</h1>
          <img src={avatarFormatter(userData.avatar || null)} className='user-avatar avatar-detail' />
          <p>Handle: @{userData?.handle}</p>
          {userData?.display_name ? <p>{userData?.display_name}</p> : ""}
          <p>Member since: {dateFormatter(userData?.created_at)}</p>
          <p>About: {userData?.about}</p>
          <p>Email: {userData?.email}</p>
          <p>Location: {userData?.location}</p>
        </div>
        :
        ""
      }
    </>
  );
}

/**
  * apiURLFormatter
  * @argument {string} uuid - email to send to API
  */
function apiURLFormatter(uuid: string): string {
  const param = `/users/${uuid}`;
  return encodeURI(`${apiURL}${param}`);
}
