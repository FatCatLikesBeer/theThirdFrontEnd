import './App.css'

// import Header from "./components/Header.tsx"
// import PostInput from './components/PostInput.tsx';
import SideBar from './components/SideBar.tsx';
import UserList from './components/UserList.tsx'
import UserDetail from './components/UserDetail.tsx';
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

// TODO: Maybe work on types and/or zod schemas?
// TODO: figure out why you have a JWT in frontend
// TODO: configure proxy pathing for development (frontend and backend should both point to 5173)
// TODO: sidebar should be static/absolute
// TODO: find icons (likes, comments, share, post, delete, options)
