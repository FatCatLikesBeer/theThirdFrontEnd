import './App.css'

// import Header from "./components/Header.tsx"
// import PostInput from './components/PostInput.tsx';
import PageNotFound from './components/PageNotFound.tsx';
import SideBar from './components/SideBar.tsx';
import UserList from './components/UserList.tsx'
import UserDetail from './components/UserDetail.tsx';
import PostDetail from './components/PostDetail.tsx';
import { Route, Routes } from 'react-router';
import { CSSProperties } from "react";
import HomePagePosts from './components/HomePagePosts.tsx';

function App() {
  return (
    <>
      <div style={styles.container}>
        <SideBar />
        <Routes>
          <Route path="/" element={<HomePagePosts />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:uuid" element={<UserDetail />} />
          <Route path="/posts/:uuid" element={<PostDetail />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  )
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
