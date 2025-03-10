import { useState, useRef } from "react";
import "./App.css"

import AuthContext from "./context/AuthContext.tsx";
import AuthModalContext from "./context/AuthModalContext.tsx";
import ToastContext from "./context/ToastContext.tsx";
import EditAvatarModalContext from "./context/EditAvatarModalContext.ts";
import TrashModalContext from "./context/TrashModalContext.ts";

import PageNotFound from "./components/PageNotFound.tsx";
import SideBar from "./components/SideBar.tsx";
import UserList from "./components/UserList.tsx"
import UserDetail from "./components/UserDetail.tsx";
import PostDetail from "./components/PostDetail.tsx";
import HomePagePosts from "./components/HomePagePosts.tsx";
import Settings from "./components/Settings.tsx";
import MyStuff from "./components/MyStuff.tsx";
import Toast from "./components/Toast.tsx";
import Search from "./components/Search.tsx";
import Friends from "./components/Friends.tsx";
import { Route, Routes } from "react-router";

import AuthModal from "./components/AuthModal.tsx";
import SettingsModal from "./components/SettingsModal.tsx";
import TrashModal from "./components/TrashModal.tsx";

import type { ToastHandle } from "./components/Toast.tsx";

function App() {
  const trashModalRef = useRef<HTMLDialogElement | null>(null);
  const authModalRef = useRef<HTMLDialogElement | null>(null);
  const settingsModalRef = useRef<HTMLDialogElement | null>(null);
  const toastRef = useRef<ToastHandle | null>(null);
  const appContentRef = useRef<HTMLDivElement | null>(null);
  const [uuid, setUUID] = useState<string | null>(localStorage.getItem("uuid"));

  return (
    <AuthModalContext value={authModalRef}>
      <TrashModalContext value={trashModalRef}>
        <EditAvatarModalContext value={settingsModalRef}>
          <AuthContext value={{ uuid, setUUID }}>
            <ToastContext value={toastRef}>
              <div className="app-full-page">
                <AuthModal />
                <SettingsModal />
                <TrashModal />
                <Toast />
                <SideBar appContentRef={appContentRef} />
                <div ref={appContentRef} className="app-content-column">
                  <Routes>
                    <Route path="/" element={<HomePagePosts />} />
                    <Route path="/mystuff" element={<MyStuff />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/users/:uuid" element={<UserDetail />} />
                    <Route path="/posts/:uuid" element={<PostDetail />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/*" element={<PageNotFound />} />
                  </Routes>
                </div>
              </div>
            </ToastContext>
          </AuthContext>
        </EditAvatarModalContext>
      </TrashModalContext>
    </AuthModalContext>
  );
}

export default App;

// TODO: Friends page: make top selector look nice
// TODO: User list component: make it look good, get rid of underlines, add location
// TODO: Commenting on posts should happen from home page
// TODO: PageNotFound component should have a timer before it procs
// TODO: figure out why you have a JWT in frontend // What the fuck does this mean?
//
// TODO: Swap R2 Bucket URL
