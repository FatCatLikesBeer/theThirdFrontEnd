type UserDetailData = {
  [about?: string]: string;
  [avatar?: string]: string | null;
  [bio?: string]: string;
  [display_name?: string]: string;
  [location?: string]: string;
  [created_at: string]: string;
  [handle: string]: string;
  [email: string]: string;
}

type PostListData = {
  avatar: string;
  comment_count: number;
  content: string;
  created_at: string;
  display_name: string;
  handle: string;
  like_count: number;
  post_uuid: string;
  user_uuid: string;
  post_liked: boolean;
  comments: PostComments[];
}

type PostDetailData = {
  avatar: string;
  comment_count: number;
  content: string;
  created_at: string;
  display_name: string;
  handle: string;
  like_count: number;
  post_uuid: string;
  user_uuid: string;
  post_liked: boolean;
  comments: PostComments[];
}

type PostComments = {
  comment_uuid: string;
  content: string;
  created_at: string;
  user_uuid: string;
  handle: string;
  avatar: string;
  likes: number;
  comment_liked: boolean;
}

type FriendListData = {
  uuid: string;
  handle: string;
  avatar: string | null;
  created_at: string;
}

type APIResponse<T> = {
  success: boolean;
  path: string;
  message: string;
  data?: T;
}

type APIUserData = {
  uuid: string,
  about: string,
  avatar: string,
  created_at: string,
  display_name: string,
  email: string,
  handle: string,
  location: string,
}
