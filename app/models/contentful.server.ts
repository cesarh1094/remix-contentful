import { getPlaiceholder } from 'plaiceholder';

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

type ContentFulPage = {};

async function apiCall(query: string, variables = {}) {
  const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  };
  return await fetch(fetchUrl, options);
}

const getImage = async (src: string) => {
  const buffer = await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()));

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
};

async function getProjects() {
  const query = `
    {
        projectsCollection (order:releaseDate_DESC) {
            items {
                title
                desc {
                    json
                }
                releaseDate
                link
            }
        }
    }`;
  const response = await apiCall(query);
  const json = await response.json();
  const formattedData = await json.data.projectsCollection.items.map(
    async (project: {
      title: string;
      desc: string;
      releaseDate: string;
      link: string;
      previewImage: { url: string; description: string };
    }) => {
      const { title, desc, releaseDate, link, previewImage } = project;

      return {
        title,
        desc,
        releaseDate,
        link,
      };
    }
  );
  return Promise.all(formattedData);
}

async function getTalks() {
  const query = `{
        talksCollection {
            items {
                sys {
                    id
                }
                title
                description {
                    json
                }
                link
                type
                previewImage {
                    description
                    url
                }
            }
        }
    }`;
  const response = await apiCall(query);
  const json = await response.json();
  return await json.data.talksCollection.items;
}

async function getAllBlogs() {
  const query = `
    {
        blogCollection(order:sys_firstPublishedAt_DESC) {
        items {
          title
          slug
          description
          tag
          sys {
            firstPublishedAt
          }
        }
      }
    }
    `;
  const response = await apiCall(query);
  const json = await response.json();
  return await json.data.blogCollection.items;
}

async function getSingleBlog(slug: string) {
  const query = `
    query($slug: String){
        blogCollection(where: {slug:$slug}) {
            items {
                title
                description
                tag
                canonicalUrl
                blogBody {
                  json
                }
                sys {
                  publishedAt
                }
                openGraphImage {
                  url
                }
              }
            }
    }
    `;
  const variables = {
    slug: slug,
  };
  const response = await apiCall(query, variables);
  const json = await response.json();
  return await json.data.blogCollection.items[0];
}

async function getPage(title: string) {
  const query = `
    query($title:String) {
        pageCollection(where:{title:$title}){
          items{
            title
            description{
              json
            }
            rolesCollection{
              items{
                roleTitle
              }
            }
            linksCollection{
              items {
                name
                url
              }
            }
            seoMetadata{
              title
              ogImage {
                url
              }
              description
            }
          }
        }
      }
    `;
  const variables = {
    title: title,
  };
  const response = await apiCall(query, variables);
  const json = await response.json();

  console.log(json);

  return await json.data.pageCollection.items[0];
}

export const client = { getProjects, getTalks, getAllBlogs, getSingleBlog, getPage };
