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
}

type PostDetailData = {
  [avatar: string]: string;
  [comment_count: string]: number;
  [content: string]: string;
  [created_at: string]: string;
  [display_name: string]: string;
  [handle: string]: string;
  [like_count: string]: number;
  [post_uuid: string]: string;
  [user_uuid: string]: string;
  [comments: string]: PostComments[];
}

type PostComments = {
  [comment_uuid: string]: string;
  [content: string]: string;
  [created_at: string]: string;
  [user_uuid: string]: string;
  [handle: string]: string;
  [avatar: string]: string;
  [likes: string]: number;
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
  [about: string]: string,
  [avatar: string]: string,
  [created_at: string]: string,
  [display_name: string]: string,
  [email: string]: string,
  [handle: string]: string,
  [location: string]: string,
}
