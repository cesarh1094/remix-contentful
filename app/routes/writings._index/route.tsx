import { Link, type MetaFunction, useLoaderData } from '@remix-run/react';
import Title from '~/components/Title';
import { client } from '~/models/contentful.server';
import { json } from '@remix-run/node';

type BlogPost = {
  slug: string;
  description: string;
  title: string;
  tag: Array<string>;
  sys: { firstPublishedAt: string };
};

type Page = {
  seoMetadata: {
    title: string;
    description: string;
    ogImage: {
      url: string;
    };
  };
};

export async function loader() {
  const blogs = (await client.getAllBlogs()) as Array<BlogPost>;
  const page = (await client.getPage('Writings')) as Page;

  return json({ blogs, page });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    data?.page?.seoMetadata
      ? {
          title: data.page.seoMetadata.title,
          description: data.page.seoMetadata.description,
          'og:image': `${data.page.seoMetadata.ogImage.url}`,
        }
      : {},
  ];
};

function PostList(
  posts: Array<{
    slug: string;
    description: string;
    title: string;
    tag: Array<string>;
    sys: { firstPublishedAt: string };
  }>
) {
  return posts.map((post) => (
    <div key={post.slug} className="mt-8 pb-6 border-b-2 border-light last:border-0">
      <Link to={post.slug}>
        <h2 className="text-xl font-medium sm:text-3xl cursor-pointer hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-100">
          {post.title}
        </h2>
      </Link>
      <p className="py-2 sm:py-4 text-sm sm:text-lg font-body dark:text-gray-400">{post.description}</p>
      <div className="flex justify-between mb-1">
        <p className="text-sm sm:text-lg dark:text-gray-200">
          <span aria-hidden="true" aria-label="calendar emoji">
            🗓{' '}
          </span>
          {new Date(post.sys.firstPublishedAt).toDateString()}
        </p>
        <p className="">
          {post.tag.map((item) => (
            <span
              key={item}
              className="mr-1 sm:mr-2 text-xs sm:text-sm rounded-full py-1 px-2 sm:px-3 text-primary dark:text-gray-200"
            >
              #{item}
            </span>
          ))}
        </p>
      </div>
      <Link to={`${post.slug}`}>
        <p className="pt-1 sm:pt-2 text-xs sm:text-base text-primary cursor-pointer hover:text-hover w-fit dark:text-gray-200">
          Read More{' '}
          <span aria-hidden="true" aria-label="arrow">
            →
          </span>
        </p>
      </Link>
    </div>
  ));
}

export default function Writings() {
  const { blogs } = useLoaderData<typeof loader>();

  return (
    <div className="px-8 sm:px-0 sm:max-w-2xl mx-auto">
      <Title title="Writings" emoji="📝" />
      {PostList(blogs)}
    </div>
  );
}
