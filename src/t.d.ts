type UserDetailData = {
  about?: string;
  avatar?: string;
  bio?: string;
  display_name?: string;
  location?: string;
  created_at: string;
  handle: string;
  email: string;
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
