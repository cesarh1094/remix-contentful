import type { MetaFunction } from '@remix-run/node';
import { motion } from 'framer-motion';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { client } from '~/models/contentful.server';
import { FaGithub, FaLinkedin, FaTwitter, FaTwitch, FaYoutube } from 'react-icons/fa/index.js';

export function headers({ loaderHeaders, parentHeaders }: { loaderHeaders: Headers; parentHeaders: Headers }) {
  console.log(
    'This is an example of how to set caching headers for a route, feel free to change the value of 60 seconds or remove the header'
  );
  return {
    // This is an example of how to set caching headers for a route
    // For more info on headers in Remix, see: https://remix.run/docs/en/v1/route/headers
    'Cache-Control': 'public, max-age=60, s-maxage=60',
  };
}

export async function loader() {
  return json(await client.getPage('Corgi'));
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { seoMetadata } = data;

  return [
    {
      title: seoMetadata.title,
      description: seoMetadata.description,
      'og:image': `${seoMetadata.ogImage.url}`,
    },
  ];

};

export default function Index() {
  const { title, rolesCollection, linksCollection } = useLoaderData<typeof loader>();
  const links = {};

  linksCollection.items.forEach((link: {}) => {
    Object.assign(links, Object.fromEntries([Object.values(link)]));
  });

  return (
    <div className="text-center mt-24 sm:mt-24 dark:text-white">
      <div>
        <h1 className="text-3xl sm:text-6xl">
          Hello{' '}
          <motion.div
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
              loop: 'Infinity',
              repeatDelay: 2,
            }}
            className="inline-block"
          >
            <span role="img" aria-label="wave">
              👋
            </span>
          </motion.div>
          , I'm <span className="text-primary dark:text-secondary"> {title}</span>!
        </h1>
      </div>
      <div className="mt-8"></div>
      <div className="mt-8 sm:mt-16 flex justify-between sm:mx-64 mx-12 dark:text-secondary">
        <a href={links.GitHub} target="_blank" aria-label="GitHub">
          <FaGithub className="h-12 w-12 sm:h-16 sm:w-16 fill-current" />
        </a>
        <a href={links.Twitter} target="_blank" aria-label="Twitter">
          <FaTwitter className="h-12 w-12 sm:h-16 sm:w-16 fill-current" />
        </a>
        <a href={links.LinkedIn} target="_blank" aria-label="LinkedIn">
          <FaLinkedin className="h-12 w-12 sm:h-16 sm:w-16 fill-current" />
        </a>
        <a href={links.Twitch} target="_blank" aria-label="Twitch">
          <FaTwitch className="h-12 w-12 sm:h-16 sm:w-16 fill-current" />
        </a>
        <a href={links.YouTube} target="_blank" aria-label="YouTube">
          <FaYoutube className="h-12 w-12 sm:h-16 sm:w-16 fill-current" />
        </a>
      </div>
    </div>
  );
}
