import { useContext } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";

export default function SideBar({ loginSignupCallback }: { loginSignupCallback: () => void }) {
  const { uuid } = useContext(AuthContext);

  function logoutCallback() {
    localStorage.removeItem("uuid");
    window.location.href = "/";
  }

  return (
    <div className="sidebar-margin-border-padding">
      <Link to="/"><h1 className="app-title">App</h1></Link>
      <p className="app-tagline">Another Platform for Posting</p>
      <button className="sidebar-create-post-button">Create Post</button>
      <Link to="/users"><p>Users</p></Link>
      <p>Search</p>
      {uuid
        ?
        <>
          <p>Friends</p>
          <p>My Stuff</p>
          <Link to="/settings"><p>Settings</p></Link>
          <p><a onClick={logoutCallback}>Logout</a></p>
        </>
        :
        <p><a onClick={loginSignupCallback}>Login/Signup</a></p>
      }
    </div>
  );
}
