import Link from 'next/link';

const PostGrid = ({ posts }) => {
  return (
    <ul className='grid gap-10 grid-cols-masonry grid-rows-masonry'>
      {posts.map((post, i) => {
        return (
          <li
            key={post.id}
            className='p-2 transition border border-transparent rounded-md cursor-pointer hover:border-green-400'>
            <Link href={`/blog/${post.slug}`}>
              <a>
                <img src={post.feature_image} className='w-full rounded-md' />

                <div className='p-2'>
                  <h3 className='font-bold text-darkGreen dark:text-white'>
                    {post.title}
                  </h3>
                  <p className='mt-2 text-gray-400'>
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
