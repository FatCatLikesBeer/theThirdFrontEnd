import { Link } from "react-router";

export default function SideBar() {
  return (
    <div className="sidebar-margin-border-padding">
      <Link to="/"><h1>App Name</h1></Link>
      <button>Create Post</button>
      <Link to="/users"><p>Users</p></Link>
      <p>Search</p>
      <p>Friends</p>
      <p>Your Stuff</p>
      <p>Settings</p>
    </div>
  );
}
