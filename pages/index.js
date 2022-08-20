import PostCard from '../components/PostCard';
import { loadPosts } from '../utils/index';

export const getStaticProps = async () => {

  const posts = await loadPosts();
  
  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.metadata.date) > new Date(postB.metadata.date) ? -1 : 1
  );

  return {
    props: {
      posts: sortedPosts,
    },
  };
};

export default function Home({ posts }) {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.metadata.slug} post={post} />
        ))}
      </div>
    </div>
  );
}