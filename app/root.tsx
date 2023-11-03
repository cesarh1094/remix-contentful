import type { MetaFunction } from '@remix-run/node';
import type { LinksFunction } from '@remix-run/react/dist/routeModules';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import stylesheet from '~/tailwind.css';
import NavBar from '~/components/NavBar';
import { LoadingBar } from './components/LoadingBar';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const meta: MetaFunction = () => [];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-gray-800">
        <LoadingBar />
        <NavBar />
        <main className="container mx-auto pt-8 sm:pt-16 pb-8 md:pb-24">
          <Outlet />
        </main>
        <footer className="lg:fixed bottom-0 w-screen p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-900">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Created with{' '}
            <a href="https://remix.run/" className="hover:underline">
              Remix
            </a>{' '}
            and{' '}
            <a href="https://contentful.com/" className="hover:underline">
              Contentful
            </a>
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a href="https://www.contentful.com/remix-tutorial/" className="mr-4 hover:underline md:mr-6 ">
                Read More
              </a>
            </li>
            <li>
              <a href="https://github.com/contentful/starter-remix-portfolio" className="mr-4 hover:underline md:mr-6">
                GitHub
              </a>
            </li>
          </ul>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
