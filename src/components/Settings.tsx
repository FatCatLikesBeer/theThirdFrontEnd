import { useEffect, useState } from "react";
import { z } from "zod";

import EditIcon from './icons/EditIcon';

import avatarFormatter from '../library/avatarFormatter';
import dateFormatter from '../library/dateFormatter';

const apiURL = String(import.meta.env.VITE_API_URL);

export default function Settings() {
  const [userData, setUserData] = useState<UserDetailData | null>(null);

  useEffect(() => {
    const formattedAPIURL = apiURLFormatter();
    fetch(formattedAPIURL, {
      credentials: "include",
    })
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

  // Onboarding
  useEffect(() => {
    if (!Boolean(Number(localStorage.getItem("onboarding")))) {
      // open Settings edit modal
      // you still need to create the modal, copy what you did with the auth modal
    }
  });

  return (
    <>
      {userData
        ?
        <div>
          <h1 className="page-title">Settings</h1>
          <img src={avatarFormatter(userData.avatar || null)} className='user-avatar avatar-detail' />
          <p>Handle: @{userData?.handle} <EditIcon /> </p>
          {userData?.display_name ? <p>Display Name: {userData?.display_name} <EditIcon /></p> : ""}
          <p>Member since: {dateFormatter(userData?.created_at)}</p>
          <p>About: {userData?.about} <EditIcon /></p>
          <p>Email: {userData?.email}</p>
          <p>Location: {userData?.location} <EditIcon /></p>
        </div>
        :
        ""
      }
    </>
  );
}

/**
  * apiURLFormatter
  */
function apiURLFormatter(): string {
  const param = `/api/users/self`;
  return encodeURI(`${apiURL}${param}`);
}
