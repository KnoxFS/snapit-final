import Head from "components/Head";
import dynamic from "next/dynamic";
import BuyPro from "components/BuyPro";

import { getPosts } from "utils/posts";

import useAuth from "hooks/useAuth";
import HeadOG from "components/HeadOG";

const PostGrid = dynamic(() => import("components/PostGrid"), { ssr: false });

const Blog = ({ posts }) => {
  const { showBuyPro, setShowBuyPro } = useAuth();

  return (
    <main className="w-[90%] md:w-[80%] mx-auto my-12 min-h-screen">
      <Head>
        <title>Screenshots4all - Blog</title>

        <meta
          name="description"
          content="Get the latest updates on Screenshots4all, learn how to use Screenshots4all, and get to know the best features on Screenshots4all."
        />
      </Head>

      <HeadOG
        title="Screenshots4all - Blog"
        description="Get the latest updates on Screenshots4all, learn how to use Screenshots4all, and get to know the best features on Screenshots4all."
        url="https://www.Screenshots4all.com/blog"
      />

      {/* fallback for no posts */}
      {posts.length === 0 && (
        <div className="text-center my-32">
          <h1 className="text-lg md:text-6xl font-bold text-white">
            There are not posts yet.
          </h1>

          <p className="text-sm md:text-lg text-white mt-4">
            Come back later to see the latest updates on Screenshots4all.
          </p>
        </div>
      )}

      <PostGrid posts={posts} />

      <BuyPro open={showBuyPro} setOpen={setShowBuyPro} />
    </main>
  );
};

export async function getStaticProps(ctx) {
  const posts = await getPosts();

  if (!posts) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      posts,
    },
  };
}

export default Blog;
