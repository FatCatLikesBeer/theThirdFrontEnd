import React, { useState, useRef } from 'react';
import './App.css'

import AuthContext from './context/AuthContext.tsx';
import AuthModalContext from './context/AuthModalContext.tsx';
import ToastContext from './context/ToastContext.tsx';

import PageNotFound from './components/PageNotFound.tsx';
import SideBar from './components/SideBar.tsx';
import UserList from './components/UserList.tsx'
import UserDetail from './components/UserDetail.tsx';
import PostDetail from './components/PostDetail.tsx';
import HomePagePosts from './components/HomePagePosts.tsx';
import AuthModal from './components/AuthModal.tsx';
import Settings from './components/Settings.tsx';
import MyStuff from './components/MyStuff.tsx';
import Toast from './components/Toast.tsx';
import { Route, Routes } from 'react-router';

import type { ToastHandle } from './components/Toast.tsx';

function App() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const toastRef = useRef<ToastHandle | null>(null);
  const [uuid, setUUID] = useState<string | null>(localStorage.getItem("uuid"));

  function loginSignupCallback() { modalRef.current?.showModal() }

  return (
    <AuthModalContext value={modalRef as React.RefObject<HTMLDialogElement>}>
      <AuthContext value={{ uuid, setUUID }}>
        <ToastContext value={toastRef}>
          <div className="app-full-page">
            <Toast toastRef={toastRef} />
            <AuthModal />
            <SideBar loginSignupCallback={loginSignupCallback} />
            <div className="app-content-column">
              <Routes>
                <Route path="/" element={<HomePagePosts />} />
                <Route path="/mystuff" element={<MyStuff />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:uuid" element={<UserDetail />} />
                <Route path="/posts/:uuid" element={<PostDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/*" element={<PageNotFound />} />
              </Routes>
            </div>
          </div>
        </ToastContext>
      </AuthContext>
    </AuthModalContext>
  );
}

export default App

// TODO: Post input & create a post from UI
// TODO: PageNotFound component should have a timer before it procs
// TODO: find icons (share, post, delete, options)
// TODO: Maybe work on types and/or zod schemas?
// TODO: figure out why you have a JWT in frontend
// TODO: configure proxy pathing for development (frontend and backend should both point to 5173)
// TODO: sidebar should be static/absolute
//
// TODO: Swap R2 Bucket URL
