import GhostContentAPI from "@tryghost/content-api";

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v5.0",
});

export async function getPosts() {
  return await api.posts
    .browse({
      filter: "tag:Snapit",
      limit: "all",
      include: "authors",
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

export async function getSinglePost(postSlug) {
  return await api.posts
    .read({
      slug: postSlug,
      filter: "tag:Snapit",
      include: "authors",
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
