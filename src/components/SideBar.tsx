import { useContext } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";

export default function SideBar({ loginSignupCallback }: { loginSignupCallback: () => void }) {
  const { auth } = useContext(AuthContext);

  function logoutCallback() {
    // remove auth from state, local storage, and cookie
    console.log("Logout not yet implemented");
  }

  return (
    <div className="sidebar-margin-border-padding">
      <Link to="/"><h1>App Name</h1></Link>
      <button>Create Post</button>
      <Link to="/users"><p>Users</p></Link>
      <p>Search</p>
      <p>Friends</p>
      <p>Your Stuff</p>
      <p>Settings</p>
      {auth
        ?
        <p><a onClick={logoutCallback}>Logout</a></p>
        :
        <p><a onClick={loginSignupCallback}>Login/Signup</a></p>
      }
    </div>
  );
}
