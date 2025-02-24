import { useState, useEffect } from "react";
import { useParams } from "react-router";

import PageNotFound from "./PageNotFound";
import avatarFormatter from "../library/avatarFormatter";
import dateFormatter from "../library/dateFormatter";
import ReactionPanel from "./icons/ReactionPanel";

export default function PostDetail() {
  const [post, setPost] = useState<PostDetailData | null>(null);
  const postUUID = useParams().uuid;
  const url = `http://localhost:3000/api/posts/${postUUID}`;

  useEffect(() => {
    // Fetch data and format it
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then((json) => {
        if (json.success) {
          const newPost: PostDetailData = { ...json.data }
          newPost.created_at = dateFormatter(newPost.created_at);
          newPost.avatar = avatarFormatter(newPost.avatar);

          newPost.comments = newPost.comments.map(elem => {
            elem.avatar = avatarFormatter(elem.avatar);
            elem.created_at = dateFormatter(elem.avatar);
            return elem;
          });

          setPost({ ...newPost });
        } else {
          console.error(json);
        }
      });
  }, []);

  return (
    <>
      {post
        ?
        <div className="post-detail-container">
          <div className="post-detail-user">
            <img className="user-avatar avatar-list" src={post?.avatar} />
            <p>{post?.handle}</p>
          </div>
          <p>{post?.created_at}</p>
          <p>{post?.content}</p>
          <ReactionPanel
            likeCount={post?.like_count}
            commentCount={post?.comment_count}
            likeCallback={() => { }}
            commentCallback={() => { }}
          />
          {post.comments[0].comment_uuid != null
            ?
            post?.comments?.map((elem) => {
              return (
                <div className="post-detail-comment-container" key={Math.floor(Math.random() * 10000000)}>
                  <img className="user-avatar avatar-list" src={elem.avatar} />
                  <p>{elem.handle}</p>
                  <p>{elem.content}</p>
                  <ReactionPanel likeCount={elem.likes} commentCount={null} likeCallback={() => { }} commentCallback={() => { }} />
                </div>
              );
            })
            :
            ""
          }
        </div>
        :
        <PageNotFound />
      }
    </>
  );
}
