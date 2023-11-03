import { json } from '@remix-run/node';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import Title from '~/components/Title';
import { client } from '~/models/contentful.server';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

export async function loader() {
  const projects = await client.getProjects();
  const page = await client.getPage('Projects');

  return json({ projects, page });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description, ogImage } = data.page.seoMetadata;
  return [
    {
      title: title,
    },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:image',
      content: `${ogImage.url}`,
    },
  ];
};

export const richTextRenderOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { data } = node;
      const { uri } = data;
      return (
        <a className="text-primary underline dark:text-secondary" target="_blank" href={uri}>
          {children[0]}
        </a>
      );
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <p className="text-gray-700 text-base dark:text-gray-400">{children}</p>;
    },
  },
};

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();

  console.log(projects);

  return (
    <div className="px-4 sm:px-48">
      <Title title="Projects" emoji="💻" />
      <div className="grid gap-4 sm:grid-cols-3">
        {projects.map((project) => {
          console.log({ project: project.desc.json.content[0].content });
          return (
            <div
              key={project.title}
              className="mt-8 max-w-sm rounded overflow-hidden shadow-lg bg-white h-auto dark:bg-gray-700"
            >
              <div className="px-6 py-4">
                <h2 className="font-bold text-lg sm:text-xl mb-2 dark:text-secondary">
                  {project.title}{' '}
                  <a href={project.link} target="_blank">
                    <span role="image" aria-label="internet" className="cursor-pointer">
                      🔗
                    </span>
                  </a>
                </h2>
                {documentToReactComponents(project.desc.json, richTextRenderOptions)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
