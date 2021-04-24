import React from 'react';
import { IBlogCategory, IPost } from '~/interfaces';
import {
  getBlogCategories,
  getPosts,
  getPostsByCategory,
  getTotalPosts,
} from '~/endpoints/blogEndpoint';
import { REVALIDATE } from '~/config';
import { GetStaticPropsContext, GetStaticPathsContext } from 'next';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import AnimationPage from '~/components/common/AnimationPage';
import { Grid, Typography, Box, Paper } from '@material-ui/core';
import BlogHead from '~/components/heads/BlogHead';
import SearchField from '~/components/blog/SearchBar';
import BlogPaper from '~/components/blog/PostSingleRow';
import CategoryList from '~/components/blog/CategoryList';
import Pagination from '~/components/blog/Pagination';
import { asString } from '~/helpers';

const postsOnPage = 2;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '0 auto',
      [theme.breakpoints.down('lg')]: {
        maxWidth: 1400,
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: 1600,
      },
    },
    pageTitle: {
      padding: theme.spacing(2),
    },
    itemContainer: {
      padding: theme.spacing(2),
    },
    sidePanel: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
      paddingTop: theme.spacing(2),
      /* border: '1px solid blue', */
    },
    searchContainer: {
      marginBottom: theme.spacing(3),
    },
    categoriesPaper: {
      minHeight: theme.spacing(15),
      padding: theme.spacing(5),
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: theme.spacing(4),
    },
  })
);

interface IProps {
  posts: IPost[];
  categories: IBlogCategory[];
  totalPages: number;
  curPage: number;
}

export default function Posts({
  posts,
  categories,
  totalPages,
  curPage,
}: IProps) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <BlogHead />
      <AnimationPage>
        <div className={classes.container}>
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.pageTitle} variant="h1">
                Статьи об автомобилях, ремонте, запчастях.
              </Typography>
            </Grid>
            <Grid container item xs={12} md={8}>
              <div className={classes.itemContainer}>
                {posts.map((post: IPost) => {
                  return <BlogPaper key={post.slug} post={post} />;
                })}
              </div>
              <Grid className={classes.pagination} item xs={12}>
                <Pagination count={totalPages} curPage={curPage} />
              </Grid>
            </Grid>
            <Grid className={classes.sidePanel} item xs={12} md={4}>
              <Box className={classes.searchContainer}>
                <SearchField />
              </Box>
              <Paper className={classes.categoriesPaper}>
                <CategoryList categories={categories} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </AnimationPage>
    </React.Fragment>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const slug = asString(context.params?.slug);
  const page = parseInt(asString(context.params?.page));

  const pageFrom = postsOnPage * (page - 1);
  const pageTo = pageFrom + postsOnPage;

  const posts = await getPostsByCategory(slug, pageFrom, pageTo);
  const categories = await getBlogCategories();
  const total = await getTotalPosts();
  console.log(total);
  const totalPages = Math.ceil(total / postsOnPage);

  return {
    revalidate: REVALIDATE,
    props: {
      posts,
      categories,
      totalPages,
      curPage: page,
    },
  };
}

interface IParams {
  slug: string;
  page: string;
}
interface IPath {
  params: IParams;
}

export async function getStaticPaths(context: GetStaticPathsContext) {
  const categories = await getBlogCategories();
  const total = await getTotalPosts();
  const paths: any[] = [];

  [...Array(total).keys()].map((page: number) => {
    const row = {
      params: {
        slug: 'vse-kategorii',
        page: Math.ceil((page + 1) / postsOnPage).toString(),
      },
    };
    if (!paths.some((path: IPath) => path.params.page === row.params.page)) {
      paths.push(row);
    }
  });

  for (let category of categories) {
    for (let page of [...Array(category.postsCount).keys()]) {
      const row = {
        params: {
          slug: category.slug,
          page: Math.ceil((page + 1) / postsOnPage).toString(),
        },
      };
      if (
        !paths.some(
          (path: IPath) =>
            path.params.page === row.params.page &&
            path.params.slug === row.params.slug
        )
      ) {
        paths.push(row);
      }
    }
  }
  console.log(paths);

  return {
    paths,
    fallback: true,
  };
}
