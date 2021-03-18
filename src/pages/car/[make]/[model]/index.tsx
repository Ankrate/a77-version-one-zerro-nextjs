import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetStaticPaths, GetStaticProps } from 'next';
import MainLayout from '~/layouts/Main';
import Grid from '@material-ui/core/Grid';

import { ICar } from '~/interfaces/ICar';
import { ICategory } from '~/interfaces/category';
import { Box } from '@material-ui/core';
import FilterWidget from '~/components/main/FilterWidget';
import LeftSideBar from '~/components/main/LeftSideBar';
import { REVALIDATE } from '~/config';
import { IFilter } from '~/interfaces/filters';
import { motion } from 'framer-motion';
import { durationPage } from '~/config';
import { setCurrentCarAction } from '~/store/actions';
import { getVehicle, getVehicles } from '~/endpoints/carsEndpoint';
import { toLoverSpace } from '~/helpers';
import { getProductsByCar } from '~/endpoints/productEndpoint';
import { IAggregationCategory } from '~/interfaces/aggregations';
import {
  IProductElasticHitsFirst,
  IProductElasticHitsSecond,
} from '~/interfaces/product';
import { makeTree } from '~/utils';
import ProductCard from '~/components/product/ProductCard2';
import PageHeader from '~/components/product/PageHeader';

interface IModelProps {
  model: ICar;
  categories: ICategory[];
  products: IProductElasticHitsFirst;
}
export interface IBaseFilter<T extends string, V> {
  type: T;
  name: string;
  slug: string;
  value: V;
}

function Model(props: IModelProps) {
  const { model, categories, products } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentCarAction(model));
  }, [model]);

  const filterCategory: IFilter = {
    type: 'category',
    name: 'category',
    slug: 'category',
    value: 'dvigatel',
    items: [],
  };

  const filters = [];
  //filters.push(filterCategory);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: durationPage }}
    >
      <MainLayout>
        <Grid container>
          <Grid item xs={12} sm={3} style={{ border: '1px solid grey' }}>
            <LeftSideBar>
              <Box>{/* <FilterWidget filters={filters} /> */}</Box>
            </LeftSideBar>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={9}
            style={{ border: '1px solid green' }}
          >
            <Grid item xs={12}>
              <PageHeader
                categories={categories}
                model={model}
                totalParts={products.total.value}
              />
            </Grid>
            <Grid item container xs={12}>
              <Grid container item xs={12} justify="space-evenly" spacing={6}>
                {products.hits.map((product: IProductElasticHitsSecond) => {
                  return <ProductCard product={product} />;
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainLayout>
    </motion.div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const modelSlug = context.params?.model as string;
  const vehicle: ICar = await getVehicle(modelSlug);

  const promise = await getProductsByCar(vehicle.slug);
  const categories: IAggregationCategory[] =
    promise.aggregations.categories.buckets;
  const products = promise.hits;

  return {
    revalidate: REVALIDATE,
    props: {
      model: vehicle,
      categories: makeTree(categories),
      products: products,
    },
  };
};

//Get Static Paths
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  const models = await getVehicles();
  for (let model of models) {
    paths.push({
      params: {
        make: toLoverSpace(model.make.slug),
        model: toLoverSpace(model.slug),
      },
    });
  }

  return {
    fallback: false,
    paths: paths,
  };
};

export default Model;
