import { json, type DataFunctionArgs } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { client } from '~/models/contentful.server';
import Title from '~/components/Title';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

export const loader = async ({ params }: DataFunctionArgs) => {
  const { postSlug = '' } = params;

  return json(await client.getSingleBlog(postSlug));
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description, openGraphImage } = data;
  return [
    {
      title,
      description,
      'og:image': `${openGraphImage.url}`,
    },
  ];
};

export const richTextRenderOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { data } = node;
      const { uri } = data;
      return (
        <a className="text-primary underline dark:text-gray-400" target="_blank" rel='noreferrer' href={uri}>
          {children[0]}
        </a>
      );
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <p className="md:text-xl text-gray-700 text-base dark:text-gray-300 leading-relaxed mb-4 md:mb-7 text-justify">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (node, children) => {
      return <h2 className="text-4xl dark:text-gray-200 mb-5">{children}</h2>;
    },
    [BLOCKS.HEADING_2]: (node, children) => {
      return <h2 className="text-3xl dark:text-gray-200 mb-5">{children}</h2>;
    },
  },
};

export default function PostSlug() {
  const { title, description, tag, blogBody, sys, canonicalUrl } = useLoaderData();
  let canonicalName = '';
  if (canonicalUrl) {
    canonicalName = canonicalUrl.replace('https://', '').split('/')[0];
  }

  return (
    <div className="sm:max-w-3xl mx-auto pb-10">
      <div className="px-4 sm:px-0">
        <Title title={title} />
      </div>
      <article className="mt-4">
        <div className="post px-4 sm:px-0">
          {canonicalUrl ? (
            <p className="text-lg mb-6 italic dark:text-gray-400">
              This blog was originally shared on <a href={canonicalUrl}>{canonicalName}</a>.
            </p>
          ) : null}
          {documentToReactComponents(blogBody.json, richTextRenderOptions)}
        </div>
      </article>
      <p className="text-hover italic dark:text-gray-400">Last Updated: {new Date(sys.publishedAt).toDateString()}</p>
    </div>
  );
}
