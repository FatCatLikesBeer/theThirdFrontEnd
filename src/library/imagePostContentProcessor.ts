export default function fetchImage(post: PostListData): string {
  return `https://cdn.billlaaayyy.dev/image${post.post_uuid}.jpg`;
}
