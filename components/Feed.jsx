import PostCard from "./PostCard";

const Feed = ({feedPosts, likedPosts, onAddComment}) => {

  return (
    <div className=" flex flex-col justify-center items-center">
      {feedPosts.map((post) => {
        return (
          <div key={post._id} className="mt-2 mb-2 flex justify-center items-center">
            <PostCard
              description={post.description}
              image={post.image || null}
              author={post.author}
              timestamp={post.timestamp}
              id={post._id}
              likes={post.likes}
              liked = {likedPosts}
              comments = {post.comments}
              onAddComment={onAddComment}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
