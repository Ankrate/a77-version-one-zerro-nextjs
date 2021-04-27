import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AnimationPage from '~/components/common/AnimationPage';
import { footerData, SITE_DOMAIN_FULL } from '~/config';
import ShopCarGrid from '~/components/product/ShopMakeGrid';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  Container,
  List,
  ListItem,
  Grid,
  Hidden,
  Typography,
  Paper,
} from '@material-ui/core';
import Link from 'next/link';

import { getVehicles } from '~/endpoints/carsEndpoint';
import { IMake } from '~/interfaces/IMake';
import { getMakes } from '~/endpoints/carsEndpoint';
import { containerMaxWidth } from '~/config';
import CarHead from '~/components/heads/CarHead';
import PopularMakes from '~/components/car/PopularMakesWidet';
import Breads from '~/components/common/BreadCrumbs';
import { IBread, IPost } from '~/interfaces';
import url from '~/services/url';
import { getPosts } from '~/endpoints/blogEndpoint';
import LatestPosts from '~/components/blog/LatestPosts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(3),
    },
    leftPanel: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    breads: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    pageTitle: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: theme.spacing(2),
    },
    latestPosts: {
      marginTop: theme.spacing(2),
    },
  })
);

interface ICarProps {
  makes: IMake[];
  popularMakes: IMake[];
  latestPosts: IPost[];
}

function Car(props: ICarProps) {
  const classes = useStyles();
  const { makes, popularMakes, latestPosts } = props;

  const breads: IBread[] = [
    { name: 'Ангара77', path: '/' },
    { name: 'Машины', path: url.cars() },
  ];
  return (
    <React.Fragment>
      <CarHead />
      <AnimationPage>
        <Container className={classes.container} maxWidth={containerMaxWidth}>
          <Grid container>
            <Grid className={classes.breads} item xs={12}>
              <Breads breadCrumbs={breads} />
            </Grid>
            <Grid className={classes.pageTitle} item xs={12}>
              <Typography variant="h1">
                Интернет магазин запчастей ANGARA PARTS
              </Typography>
            </Grid>
            <Hidden smDown>
              <Grid className={classes.leftPanel} item xs={3}>
                <PopularMakes makes={popularMakes} />
                <Paper className={classes.latestPosts}>
                  <LatestPosts posts={latestPosts} />
                </Paper>
              </Grid>
            </Hidden>
            <Grid item xs={12} md={9}>
              <ShopCarGrid cars={makes} />
            </Grid>
          </Grid>
        </Container>
      </AnimationPage>
    </React.Fragment>
  );
}

export const getStaticProps: GetServerSideProps = async () => {
  const makes: IMake[] = await getMakes();
  const sortedMakes = makes
    .slice()
    .sort((a: IMake, b: IMake) => +b.priority - +a.priority);
  const popularMakes = makes.filter((make: IMake) => {
    if (make && make.priority) {
      const priority =
        typeof make.priority === 'string'
          ? parseInt(make.priority)
          : make.priority;
      return priority > 3;
    }
    return false;
  });

  const latestPosts = await getPosts(5);

  return {
    props: {
      makes: sortedMakes,
      popularMakes,
      latestPosts,
    },
  };
};

export default Car;
