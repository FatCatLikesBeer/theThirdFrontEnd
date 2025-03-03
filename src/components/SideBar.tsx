import { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";

export default function SideBar({ loginSignupCallback }: { loginSignupCallback: () => void }) {
  const [useDarkTheme, setUseDarkTheme] = useState(localStorage.getItem("useDarkTheme"));
  const divRef = useRef<HTMLHeadingElement | null>(null);
  const appTitleRef = useRef<HTMLHeadingElement | null>(null);
  const usersRef = useRef<HTMLParagraphElement | null>(null);
  const searchRef = useRef<HTMLParagraphElement | null>(null);
  const friendsRef = useRef<HTMLParagraphElement | null>(null);
  const myStuffRef = useRef<HTMLParagraphElement | null>(null);
  const settingsRef = useRef<HTMLParagraphElement | null>(null);
  const { uuid } = useContext(AuthContext);

  function logoutCallback() {
    localStorage.removeItem("uuid");
    window.location.href = "/";
  }


  useEffect(() => {
    // set localStorage value
    if (null === localStorage.getItem("useDarkTheme")) {
      localStorage.setItem("useDarkTheme", "false");
    }
    console.log(useDarkTheme);
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

  return (
    <div className="sidebar-container" ref={divRef}>
      <Link to="/"><h1 className="app-title sidebar-element" ref={appTitleRef}>App</h1></Link>
      <p className="app-tagline">Another Platform for Posting</p>
      <button className="sidebar-create-post-button">Create Post</button>
      <Link to="/users"><p className="sidebar-element" ref={usersRef}>Users</p></Link>
      <Link to="/search"><p className="sidebar-element" ref={searchRef}>Search</p></Link>
      {uuid
        ?
        <>
          <Link to="/friends"><p className="sidebar-element" ref={friendsRef}>Friends</p></Link>
          <Link to="/mystuff"><p className="sidebar-element" ref={myStuffRef}>My Stuff</p></Link>
          <Link to="/settings"><p className="sidebar-element" ref={settingsRef}>Settings</p></Link>
          <p className="pointer"><a onClick={logoutCallback}>Logout</a></p>
        </>
        :
        <p className="pointer"><a onClick={loginSignupCallback}>Login/Signup</a></p>
      }
      <p className="pointer"><a onClick={toggleTheme}>Use {"true" === useDarkTheme ? "Light" : "Dark"} Theme</a></p>
    </div>
  );
}
