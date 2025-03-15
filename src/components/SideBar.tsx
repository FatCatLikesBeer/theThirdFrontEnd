import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router";

import AuthContext from "../context/AuthContext";
import AuthModalContext from "../context/AuthModalContext";

import HamburgerMenuIcon from "./icons/HamburgerMenuIcon";

import apiURLFetcher from "../library/apiURL";

const apiURL = apiURLFetcher() + "/api";

export default function SideBar({
  appContentRef,
}: {
  appContentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [useDarkTheme, setUseDarkTheme] = useState(localStorage.getItem("useDarkTheme"));
  const authModalRef = useContext(AuthModalContext);
  const sideBarRef = useRef<HTMLDivElement | null>(null);
  const { uuid } = useContext(AuthContext);

  // Themeing stuff
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

  // Window resize
  useEffect(() => {
    function handleResize() {
      setShowSidebar(window.innerWidth >= 700);
      setShowMobileMenu(window.innerWidth < 700);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  // Auto close sidebar
  useEffect(() => {
    function closeSidebar() {
      setShowSidebar(false);
    }

    appContentRef?.current?.addEventListener("click", closeSidebar);
    appContentRef?.current?.addEventListener("scroll", closeSidebar);
    appContentRef?.current?.addEventListener("touchstart", closeSidebar);
  }, []);

  function toggleTheme() {
    setUseDarkTheme((prevValue) => {
      const newValue = "true" === prevValue ? "false" : "true";
      localStorage.setItem("useDarkTheme", newValue);
      return newValue;
    });
  }

  function logoutCallback() {
    localStorage.removeItem("uuid");
    fetch(apiURL + "/auth/logout", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          window.location.href = "/";
        }
      });
  }

  function loginSignupCallback() { authModalRef?.current?.showModal() }

  function MobileMenuComponent({
    setShowSidebar,
  }: {
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
    return (
      <div className="mobile-menu-component-outside">
        <div className="mobile-menu-component-inside">
          <HamburgerMenuIcon size={32} callBack={() => { setShowSidebar(p => !p) }} />
        </div>
      </div>
    );
  }

  return (
    <>
      {showMobileMenu && <MobileMenuComponent setShowSidebar={setShowSidebar} />}
      {(showSidebar || window.innerWidth > 700) &&
        <div className="sidebar-container" ref={sideBarRef}>
          <Link to="/"><h1 className="app-title sidebar-element">App</h1></Link>
          <p className="app-tagline">Another Platform for Posting</p>
          <button className="sidebar-create-post-button">Create Post</button>
          <Link to="/"><p className="sidebar-element">Home</p></Link>
          <p className="pointer"><a onClick={toggleTheme}>{"true" === useDarkTheme ? "Light" : "Dark"} Theme</a></p>
          <Link to="/users"><p className="sidebar-element">Users</p></Link>
          <Link to="/search"><p className="sidebar-element">Search</p></Link>
          {uuid
            ?
            <>
              <Link to="/friends"><p className="sidebar-element">Friends</p></Link>
              <Link to="/mystuff"><p className="sidebar-element">My Stuff</p></Link>
              <Link to="/settings"><p className="sidebar-element">Settings</p></Link>
              <Link to="/about"><p className="sidebar-element">About</p></Link>
              <p className="pointer"><a onClick={logoutCallback}>Logout</a></p>
            </>
            :
            <>
              <Link to="/about"><p className="sidebar-element">About</p></Link>
              <p className="pointer"><a onClick={loginSignupCallback}>Login/Signup</a></p>
            </>
          }
        </div>
      }
    </>
  );
}
