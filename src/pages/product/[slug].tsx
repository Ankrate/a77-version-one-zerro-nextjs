import React, { useEffect, useState } from 'react';
import AnimationPage from '~/components/common/AnimationPage';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { containerMaxWidth, REVALIDATE } from '~/config';
import {
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core';
import ProductPageHead from '~/components/heads/ProductPageHead';
import { IImage } from '~/interfaces/IImage';
import { imageServerUrl } from '~/config';

import { IProduct } from '~/interfaces';
import { getProduct, getProductsAll } from '~/endpoints/productEndpoint';
import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import PageHeader from '~/components/product/PageHeader';
import { IBread } from '~/interfaces';
import ResponsivePlayer from '~/components/common/ResponsivePlayer';
import Image from 'next/image';
import SwiperProduct from '~/components/common/SwiperProduct';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerContainer: {
      /* background: 'rgba(0,142,129,0.1)', */
      marginBottom: theme.spacing(2),
    },
    gridRow: {
      paddingBottom: theme.spacing(2),
    },
    swipeGrid: { paddingRight: theme.spacing(1) },
    swiperPaper: {
      /* padding: theme.spacing(2), */
    },
    descriptionGrid: { paddingLeft: theme.spacing(1) },
    descriptionPaper: {
      height: '100%',
      padding: theme.spacing(2),
    },
    wrapper: {
      display: 'grid',
      gridGap: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '4fr 3fr',
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: '4fr 3fr 3fr',
      },
    },
    side: {
      display: 'flex',
      border: '1px solid pink',
    },
    first: {
      background: theme.palette.action.hover,
    },
    second: {
      background: theme.palette.action.selected,
    },
    third: {
      background: 'rgba(0,180,204,0.2)',
    },
    fifth: {
      background: 'rgba(0, 180, 100, 0.2)',
    },
    playerWrapper: {
      position: 'relative',
    },
    reactPlayer: {},
  })
);

interface IProps {
  product: IProduct;
}
interface IGalery {
  original: string;
  thumbnail: string;
}
export default function ProductPage({ product }: IProps) {
  const classes = useStyles();
  const router = useRouter();
  /* if (router.isFallback) { */
  /*   return <div> ... Loading</div>; */
  /* } */
  const breads: IBread[] = [
    { name: 'Ангара77', path: '/' },
    { name: product.name, path: `/product/${product.slug}` },
  ];

  let images: IGalery[] = [];
  if (product.images.length) {
    images = product.images.map((item: IImage) => ({
      original: `${imageServerUrl}${item.img800}`,
      thumbnail: `${imageServerUrl}${item.img150}`,
    }));
  } else {
    images = [
      {
        original: 'https://picsum.photos/id/1018/1000/600/',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
      },
      {
        original: 'https://picsum.photos/id/1015/1000/600/',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
      },
      {
        original: 'https://picsum.photos/id/1019/1000/600/',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
      },
    ];
  }
  const sources = [
    {
      src: 'https://youtu.be/KDPi_cgItcA',
      type: 'application/x-mpegURL',
    },
    {
      src:
        'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8',
      type: 'application/dash+xml',
    },
  ];

  return (
    <React.Fragment>
      <ProductPageHead product={product} />
      <AnimationPage>
        <Container maxWidth="xl">
          <Grid container>
            <Grid className={classes.headerContainer} item xs={12}>
              <PageHeader header={product.name} breads={breads} />
            </Grid>
            <Grid className={classes.gridRow} container item xs={12}>
              <Grid className={classes.swipeGrid} item xs={12} md={7}>
                <Paper className={classes.swiperPaper}>
                  <SwiperProduct product={product} />
                </Paper>
              </Grid>
              <Grid className={classes.descriptionGrid} item xs={12} md={5}>
                <Paper className={classes.descriptionPaper}>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Earum officia nulla quis magni ad odit autem natus? Vel,
                  impedit placeat.
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid className={classes.wrapper} item xs={12}>
                <div className={classes.first}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facilis cumque rem molestiae excepturi earum voluptate
                  deserunt aspernatur qui non eum maxime quas incidunt facere
                  nostrum atque, beatae animi ullam libero dolore architecto
                  minus voluptates nesciunt vitae! Ut, molestias? Repellat optio
                  reprehenderit quae harum repellendus dignissimos, dolore
                  maxime expedita in. Libero?
                </div>
                <div className={classes.third}>
                  <ResponsivePlayer />
                </div>
                <div className={classes.fifth}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet
                  dolorem reiciendis blanditiis laborum repellat, mollitia
                  assumenda consequuntur? Eveniet voluptatum ex atque quae sunt
                  dolor enim nihil harum ipsa facilis ratione, quo ducimus
                  incidunt eaque nobis illum, maxime dignissimos natus esse.
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </AnimationPage>
    </React.Fragment>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { slug } = context.params!;

  const product: IProduct = await getProduct(slug as string);

  return {
    revalidate: REVALIDATE,
    props: {
      product,
    },
  };
};

interface IPaths {
  params: {
    slug: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const promise = await getProductsAll();
  const prods = promise.hits.hits;
  let paths: IPaths[] = [];
  for (let prod of prods) {
    if (prod._source.slug) {
      paths.push({ params: { slug: prod._source.slug } });
    } else {
      console.log('Something wrong with slug in product');
    }
  }

  return {
    fallback: false,
    paths: paths,
  };
};
