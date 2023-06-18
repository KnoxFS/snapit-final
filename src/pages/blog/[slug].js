import Head from 'components/Head';
import HeadOG from 'components/HeadOG';

import { TwitterIcon } from 'ui/icons';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

import { getPosts, getSinglePost } from 'utils/posts';

const SinglePost = ({ post }) => {
  return (
    <section className='mx-auto my-12 min-h-screen w-[90%] md:w-[80%]'>
      <Head>
        <title>Snapit - {post.title}</title>

        <meta name='description' content={post.excerpt} />
      </Head>

      <HeadOG
        title={`Snapit - ${post.title}`}
        description={post.excerpt}
        url={`https://www.snapit.gg/blog/${post.slug}`}
        image={post.feature_image}
      />

      <header className='mx-auto md:w-[80%]'>
        <h2 className='mb-6 text-lg font-semibold text-center text-darkGreen dark:text-white md:text-4xl'>
          {post.title}
        </h2>

        {/* description */}
        {post.excerpt && (
          <p className='text-sm text-center text-gray-400 md:text-base'>
            {post.excerpt}
          </p>
        )}
      </header>

      {/* image */}

      {/* <figure className="my-12">
        {post.feature_image && (
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full rounded-md"
          />
        )}

        <article className="flex flex-col p-4 space-y-6 md:flex-row md:space-y-0 md:space-x-12">
          <div>
            <h3 className="text-base font-bold text-gray-400 uppercase">
              Last updated
            </h3>
            <p className="text-white">
              {new Date(post.updated_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-400 uppercase">
              Written By
            </h3>
            <p className="text-white">{post.primary_author.name}</p>
          </div>
        </article>
      </figure> */}

      {/* Content */}
      <section className='my-24 grid grid-cols-1 gap-10 md:grid-cols-[70%,1fr]'>
        <div
          className='text-gray-400 post-content'
          dangerouslySetInnerHTML={{ __html: post.html }}></div>

        <article>
          <h3 className='mb-4 font-bold uppercase text-darkGreen dark:text-white'>
            Share this post
          </h3>

          <ul className='flex space-x-4'>
            <li>
              {/* twitter */}
              <a
                className='twitter-share-button'
                target='_blank'
                rel='noreferrer'
                href={`https://twitter.com/intent/tweet?text=${post.title}&url=https://www.snapit.gg/blog/${post.slug}`}>
                <TwitterIcon className='w-6 h-6 text-darkGreen dark:text-white' />
              </a>
            </li>

            <li>
              {/* mail */}
              <a
                target='_blank'
                rel='noreferrer'
                href={`mailto:#?subject=${post.title} - https://www.snapit.gg/blog/${post.slug}`}>
                <EnvelopeIcon className='w-6 h-6 text-darkGreen dark:text-white' />
              </a>
            </li>
          </ul>
        </article>
      </section>
    </section>
  );
};

export async function getStaticPaths() {
  const posts = await getPosts();

  // Get the paths we want to create based on posts
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));

  // { fallback: false } means posts not found should 404.
  return { paths, fallback: false };
}

// Pass the page slug over to the "getSinglePost" function
// In turn passing it to the posts.read() to query the Ghost Content API
export async function getStaticProps(context) {
  const post = await getSinglePost(context.params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post },
  };
}

export default SinglePost;
