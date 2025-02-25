import { useContext } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";

export default function SideBar(
  {
    handleShowModal,
  }: {
    handleShowModal: () => void;
  }
) {
  const { auth } = useContext(AuthContext);

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
        <p>Logout</p>
        :
        <p><a onClick={handleShowModal}>Login/Signup</a></p>
      }
    </div>
  );
}
