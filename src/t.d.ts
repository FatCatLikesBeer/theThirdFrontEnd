type UserDetailData = {
  [about?: string]: string;
  [avatar?: string]: string;
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
  avatar: string;
  comment_count: number;
  content: string;
  created_at: string;
  display_name: string;
  handle: string;
  like_count: number;
  post_uuid: string;
  user_uuid: string;
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
}

type APIResponse<T> = {
  success: boolean;
  path: string;
  message: string;
  data: T;
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
