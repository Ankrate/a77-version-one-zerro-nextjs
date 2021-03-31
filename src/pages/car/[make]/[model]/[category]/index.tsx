import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { REVALIDATE } from '~/config';
import { ICar } from '~/interfaces/ICar';
import { getCategoryBySlugGQL } from '~/endpoints/categories';
import { asString } from '~/helpers';
import { IFilter } from '~/interfaces/filters';
import { ICategory, IShopCategory } from '~/interfaces/category';
import AnimationPage from '~/components/common/AnimationPage';
import { getVehicle, getVehicles } from '~/endpoints/carsEndpoint';
import {
  IAgregations,
  IAggregationCategory,
  IAggregationBucket,
  IAggregationAgg,
} from '~/interfaces/aggregations';
import {
  IProduct,
  IProductElasticHitsFirst,
  IProductElasticHitsSecond,
  IProductElasticBase,
} from '~/interfaces/product';
import { getProductsByCar } from '~/endpoints/productEndpoint';
import { makeTree, OrderBreads } from '~/utils';
import ShopGrid from '~/components/product/ShopGrid';
import { Hidden } from '@material-ui/core';
import FilterWidget from '~/components/product/FilterWidget';
import LeftSideBar from '~/components/product/LeftSideBar';
import CategoryHead from '~/components/heads/CategoryHead';
import { getCatPath } from '~/services/utils';
import { IBread } from '~/interfaces';
import url from '~/services/url';
import { capitalize } from '~/utils';
import PageHeader from '~/components/product/PageHeader';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '~/interfaces/IState';
import { getProductsByFilters } from '~/endpoints/productEndpoint';
import { shopProductLoading } from '~/store/shop/shopActions';
import { CheckFilterBulder } from '~/services/filters/filtersBuilder';

interface CategoryProps {
  category: IShopCategory;
  categoriesForFilter: ICategory[];
  categoryId?: number;
  products: IProductElasticHitsFirst;
  make: string;
  model: ICar;
  updated: Date;
  catPath: ICategory[];
  categories: ICategory[];
  aggregations: IAgregations;
}

export default function Cagetory(props: CategoryProps) {
  const {
    category,
    categories,
    make,
    model,
    updated,
    products,
    catPath,
    aggregations,
  } = props;
  const router = useRouter();

  const modelName = capitalize(model.model);
  const makeName = capitalize(model.make.name);
  const catName = capitalize(category.name);
  const header = `${catName} на  ${makeName} ${modelName}`;

  const count = products.total.value;

  const orderedCatBreads = catPath.sort(OrderBreads);
  const catBreads: IBread[] = orderedCatBreads?.map((item: ICategory) => ({
    name: item.name,
    path: url.category(model.make.slug, model.slug, item.slug),
  }));

  const breads: IBread[] = [
    { name: 'Ангара77', path: '/' },
    { name: model.make.name, path: url.make(model.make.slug) },
    { name: model.model, path: url.model(model.make.slug, model.slug) },
    ...catBreads,
  ];

  // Make array for brands filter

  const engs = aggregations.engines.buckets.map((item: IAggregationBucket) => ({
    name: item.key,
    count: item.doc_count,
  }));
  let minPrice: number = 0;

  let maxPrice: number = 0;
  if (
    aggregations.hasOwnProperty('min_price') &&
    aggregations.hasOwnProperty('max_price')
  ) {
    minPrice = aggregations.min_price.value as number;
    maxPrice = aggregations.max_price.value as number;
  }
  const categoriesFilter: IFilter = {
    type: 'category',
    name: 'category',
    slug: 'category',
    value: 'dvigatel',
    path: orderedCatBreads,
    items: categories,
  };
  /* const brands: IFilter = { */
  /*   type: 'check', */
  /*   name: 'Бренды', */
  /*   slug: 'brands', */
  /*   value: brandVals, */
  /*   items: fBrands, */
  /* }; */
  const price: IFilter = {
    type: 'range',
    name: 'Цена',
    slug: 'price',
    value: [minPrice, maxPrice],
    min: minPrice,
    max: maxPrice,
  };

  const bages: IFilter = {
    type: 'check',
    name: 'Бейдж',
    slug: 'bages',
    value: ['sale', 'new'],
    items: [
      { name: 'NEW', count: 39 },
      { name: 'SALE', count: 90 },
    ],
  };
  /* const engines: IFilter = { */
  /*   type: 'check', */
  /*   name: 'Двигатель', */
  /*   slug: 'engines', */
  /*   value: ['d4dd', 'd4db'], */
  /*   items: engs, */
  /* }; */

  // filters builder ////////////////////////////////////////
  const filterBrand = router.query.filter_brand || [];

  let brandVals: string[] = [];

  if (typeof filterBrand === 'string') {
    brandVals.push(filterBrand);
  } else if (Array.isArray(filterBrand)) {
    brandVals = [...filterBrand];
  }
  const brandsClass = new CheckFilterBulder(
    'Бренды',
    'brands',
    aggregations.brands.buckets,
    brandVals
  );
  const brands = brandsClass.buildFilter();
  // llllllllllllllllllllllllll
  const filterEngine = new CheckFilterBulder(
    'Двигатель',
    'engines',
    aggregations.engines.buckets,
    ['d4bf']
  );
  const engines = filterEngine.buildFilter();
  //////////////////////////////////////////

  const bucketsFilters: any = { brands, bages, engines };
  const filters = [categoriesFilter, price];

  for (const [key, value] of Object.entries(aggregations)) {
    if (value.hasOwnProperty('buckets') && value.buckets.length > 0) {
      if (bucketsFilters[key]) {
        filters.push(bucketsFilters[key]);
      }
    }
  }

  filters.push();
  const [stateProducts, setStateProducts] = useState(products.hits);
  const [stateCount, setStateCount] = useState(products.total.value);
  const fils = useSelector((state: IState) => state.shopNew.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      dispatch(shopProductLoading(true));
      console.log(fils);
      const brands = fils.hasOwnProperty('brands') ? fils.brands : '';
      let promise = {} as IProductElasticBase;
      if (brands === '') {
        promise = await getProductsByCar(model.slug, category.slug);
      } else {
        promise = await getProductsByFilters(model.slug, category.slug, brands);
      }
      let products: IProductElasticHitsFirst = promise.hits;
      setStateProducts(products.hits);
      setStateCount(products.total.value);
      dispatch(shopProductLoading(false));
    }
    fetchProducts();
  }, [fils, products]);

  return (
    <React.Fragment>
      <CategoryHead model={model} category={category} />
      <AnimationPage>
        <Grid container>
          <PageHeader header={header} breads={breads} count={stateCount} />
          <Hidden smDown>
            <Grid item xs={3}>
              <LeftSideBar>
                <FilterWidget filters={filters} />
              </LeftSideBar>
            </Grid>
          </Hidden>
          <Grid item xs={12} md={9}>
            <ShopGrid products={stateProducts} />
          </Grid>
        </Grid>
      </AnimationPage>
    </React.Fragment>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { category, make, model } = context.params!;
  const modelSlug: string = model as string;
  if (!category) {
    return {
      notFound: true,
    };
  }
  // sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
  function searchTree(element: any, matchingTitle: any): any {
    if (element.slug == matchingTitle) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = searchTree(element.children[i], matchingTitle);
      }
      return result;
    }
    return null;
  }
  // sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
  const mod: ICar = await getVehicle(modelSlug);

  const slug: string = asString(category);

  // Comment out for building next time here and in static paths
  const cat: ICategory = await getCategoryBySlugGQL(slug);
  const promise = await getProductsByCar(modelSlug, cat.slug);
  const categories: IAggregationCategory[] =
    promise.aggregations.categories.buckets;
  let products: IProductElasticHitsFirst = promise.hits;

  const aggregations: IAgregations = promise.aggregations;

  const catPath = getCatPath(cat, categories);

  const localCatTree: ICategory[] = makeTree(categories);
  let catRet;
  try {
    const cttt = searchTree(localCatTree[0], slug);
    catRet = cttt.children.length ? cttt.children : [];
  } catch (e) {
    catRet = null;
    console.log('Fucks up in ', e);
  }
  return {
    revalidate: REVALIDATE,
    props: {
      car: {},
      category: cat,
      categories: catRet,
      products: products,
      make: make,
      model: mod,
      updated: Date.now(),
      catPath: catPath,
      aggregations,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // here is good place to add whole pages to be generated

  const vehicles = await getVehicles();

  const makeModel = vehicles.map((vehicle: ICar) => {
    return {
      make: vehicle.make.slug,
      model: vehicle.slug,
    };
  });

  // !!!! Getting NOT Empty categories from endpoint
  /* const categories = await getCategoryAllGQL(); */
  // Here is all not empty categories from elastic need to be refactored
  // const categories = await getCategories();

  const paths: {
    params: { make: string; model: string; category: string };
  }[] = [];

  for (let model of makeModel) {
    const promise = await getProductsByCar(model.model);
    const categories: IAggregationCategory[] =
      promise.aggregations.categories.buckets;
    for (let cat of categories) {
      paths.push({
        params: { make: model.make, model: model.model, category: cat.slug },
      });
    }
  }

  return {
    paths: paths,
    fallback: false,
  };
};
