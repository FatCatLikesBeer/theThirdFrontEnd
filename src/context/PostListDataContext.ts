import { createContext } from "react";

const PostListDataContext = createContext<null | React.Dispatch<React.SetStateAction<PostListData[] | null>>>(null);

export default PostListDataContext;
