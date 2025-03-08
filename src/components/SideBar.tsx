import { useContext, useState, useEffect } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";
import AuthModalContext from "../context/AuthModalContext";

const apiURL = String(import.meta.env.VITE_API_URL) + "/api";

export default function SideBar() {
  const [useDarkTheme, setUseDarkTheme] = useState(localStorage.getItem("useDarkTheme"));
  const authModalRef = useContext(AuthModalContext);
  const { uuid } = useContext(AuthContext);

  function logoutCallback() {
    localStorage.removeItem("uuid");
    fetch(apiURL + "/auth/logout", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          window.location.href = "/";
        }
      });
  }

  useEffect(() => {
    // set localStorage value
    if (null === localStorage.getItem("useDarkTheme")) {
      localStorage.setItem("useDarkTheme", "false");
    }
    if ("true" === useDarkTheme) {
      document.documentElement.style.setProperty("--background-color", "#181a1b");
      document.documentElement.style.setProperty("--text-color", "seashell");
    } else {
      document.documentElement.style.setProperty("--background-color", "white");
      document.documentElement.style.setProperty("--text-color", "black");
    }
  }, [useDarkTheme]);

  function toggleTheme() {
    setUseDarkTheme((prevValue) => {
      const newValue = "true" === prevValue ? "false" : "true";
      localStorage.setItem("useDarkTheme", newValue);
      return newValue;
    });
  }

  function loginSignupCallback() { authModalRef?.current?.showModal() }

  return (
    <div className="sidebar-container">
      <Link to="/"><h1 className="app-title sidebar-element">App</h1></Link>
      <p className="app-tagline">Another Platform for Posting</p>
      <button className="sidebar-create-post-button">Create Post</button>
      <Link to="/users"><p className="sidebar-element">Users</p></Link>
      <Link to="/search"><p className="sidebar-element">Search</p></Link>
      {uuid
        ?
        <>
          <Link to="/friends"><p className="sidebar-element">Friends</p></Link>
          <Link to="/mystuff"><p className="sidebar-element">My Stuff</p></Link>
          <Link to="/settings"><p className="sidebar-element">Settings</p></Link>
          <p className="pointer"><a onClick={logoutCallback}>Logout</a></p>
        </>
        :
        <p className="pointer"><a onClick={loginSignupCallback}>Login/Signup</a></p>
      }
      <p className="pointer"><a onClick={toggleTheme}>Use {"true" === useDarkTheme ? "Light" : "Dark"} Theme</a></p>
    </div>
  );
}
