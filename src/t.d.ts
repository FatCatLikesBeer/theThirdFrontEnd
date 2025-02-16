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
  user_uuid: string;
  handle: string;
  avatar: string;
  display_name: string;
  post_uuid: string;
  created_at: string;
  content: string;
  like_count: number;
  comment_count: number;
}
