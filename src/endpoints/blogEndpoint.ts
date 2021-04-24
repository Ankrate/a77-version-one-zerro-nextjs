import { gql } from '@apollo/client';
import { client, clientBlog } from './apolloClient';
import { IBlogCategory, IPage, IPost } from '~/interfaces';

// Total posts count
export async function getTotalPosts(): Promise<number> {
  const query = gql`
    query totalPosts {
      totalPosts
    }
  `;
  const promise = await clientBlog.query({
    query: query,
  });
  return promise.data.totalPosts;
}
// Get blog categories
export async function getBlogCategories(): Promise<IBlogCategory[]> {
  const query = gql`
    query categories {
      categories {
        name
        slug
        postsCount
      }
    }
  `;
  const promise = await clientBlog.query({
    query: query,
  });
  return promise.data.categories;
}

// Together products
export async function getPost(slug: string): Promise<IPost[]> {
  const query = gql`
    query post($slug: String!) {
      post(slug: $slug) {
        slug
        title
        text
        image
        author
        date
        car {
          name
          slug
        }
        partsCategory {
          name
          slug
        }
        category {
          name
          slug
        }
      }
    }
  `;
  const promise = await clientBlog.query({
    query: query,
    variables: {
      slug,
    },
  });
  const data = await promise.data.post;
  return data;
}

export async function getPosts(): Promise<IPost[]> {
  const query = gql`
    query posts {
      posts {
        title
        excerpt
        slug
        image
        text
        author
        date
        car {
          name
          slug
        }
        partsCategory {
          name
          slug
        }
        category {
          name
          slug
        }
      }
    }
  `;
  const promise = await clientBlog.query({
    query: query,
  });
  return promise.data.posts;
}

export async function getPostsByCategory(
  slug: string,
  pageFrom: number,
  pageTo: number
): Promise<IPost[]> {
  const query = gql`
    query postsByCategory($slug: String!, $pageFrom: Int!, $pageTo: Int!) {
      postsByCategory(slug: $slug, pageFrom: $pageFrom, pageTo: $pageTo) {
        title
        excerpt
        slug
        image
        text
        author
        date
        car {
          name
          slug
        }
        partsCategory {
          name
          slug
        }
        category {
          name
          slug
        }
      }
    }
  `;
  const promise = await clientBlog.query({
    query: query,
    variables: {
      slug,
      pageFrom,
      pageTo,
    },
  });
  return promise.data.postsByCategory;
}

export async function getPages(): Promise<IPage[]> {
  const query = gql`
  pages {
    title
    textHTML
    text
    }
  `;
  const promise = await client.query({
    query: query,
  });
  return promise.data.pages;
}

export async function getPage(slug: string): Promise<IPost[]> {
  const query = gql`
    query page($slug: String!) {
      page(slug: $slug) {
        slug
        title
        excerpt
        text
        image
        partsCategory {
          name
          slug
        }
        category {
          name
          slug
        }
      }
    }
  `;
  const promise = await clientBlog.query({
    query: query,
    variables: {
      slug,
    },
  });
  const data = await promise.data.page;
  return data;
}
