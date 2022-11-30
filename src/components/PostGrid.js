import Link from "next/link";

const PostGrid = ({ posts }) => {
  return (
    <ul className="grid gap-10 grid-cols-masonry grid-rows-masonry">
      {posts.map((post, i) => {
        return (
          <li
            key={post.id}
            className="cursor-pointer border border-transparent rounded-md hover:border-green-400 p-2 transition"
          >
            <Link href={`/blog/${post.slug}`}>
              <a>
                <img src={post.feature_image} className="w-full rounded-md" />

                <div className="p-2">
                  <h3 className="text-white font-bold">{post.title}</h3>
                  <p className="text-gray-400 mt-2">
                    By {post.primary_author.name}
                  </p>
                </div>
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default PostGrid;
