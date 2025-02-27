import { useState, useRef, useEffect } from 'react';
import './App.css'

import AuthModalContext from './context/AuthModalContext.tsx';
import AuthContext from './context/AuthContext.tsx';

// import Header from "./components/Header.tsx"
// import PostInput from './components/PostInput.tsx';
import PageNotFound from './components/PageNotFound.tsx';
import SideBar from './components/SideBar.tsx';
import UserList from './components/UserList.tsx'
import UserDetail from './components/UserDetail.tsx';
import PostDetail from './components/PostDetail.tsx';
import HomePagePosts from './components/HomePagePosts.tsx';
import AuthModal from './components/AuthModal.tsx';
import { Route, Routes } from 'react-router';
import { CSSProperties } from "react";

function App() {
  const modalRef = useRef<null | HTMLDialogElement>(null);
  const [uuid, setUUID] = useState<string | null>(localStorage.getItem("uuid"));

  function loginSignupCallback() {
    modalRef.current?.showModal();
  }

  useEffect(() => {
    console.log(uuid);
  });

  return (
    <AuthModalContext value={modalRef as React.RefObject<HTMLDialogElement>}>
      <AuthContext value={{ uuid, setUUID }}>
        <div style={styles.container}>
          <AuthModal />
          <SideBar loginSignupCallback={loginSignupCallback} />
          <Routes>
            <Route path="/" element={<HomePagePosts />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:uuid" element={<UserDetail />} />
            <Route path="/posts/:uuid" element={<PostDetail />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </div>
      </AuthContext>
    </AuthModalContext>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "row",
  }
}

export default App

// TODO: Login button & auth flow
// TODO: Post input & create a post from UI
// TODO: PageNotFound component should have a timer before it procs
// TODO: find icons (share, post, delete, options)
// TODO: Maybe work on types and/or zod schemas?
// TODO: figure out why you have a JWT in frontend
// TODO: configure proxy pathing for development (frontend and backend should both point to 5173)
// TODO: sidebar should be static/absolute
