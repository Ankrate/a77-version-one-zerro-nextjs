import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { IProductElasticHitsSecond } from '~/interfaces/product';
import { Hidden, Box, Grid, TextField } from '@material-ui/core';
import { prodCardSize } from '~/config';
import AppsIcon from '@material-ui/icons/Apps';
import MenuIcon from '@material-ui/icons/Menu';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '~/interfaces/IState';
import { SET_SHOP_GRID, SET_SORT_VALUE } from '~/store/types';
import { compareByNameAsc, compareByNameDesc } from '~/utils';
import ProductCardGrid from './ProductCardGrid';
import ProductCardList from './ProductCardList';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import Button from '@material-ui/core/Button';
import FilterDrawer from '~/components/product/FilterDrawer';
import Chip from '@material-ui/core/Chip';
import { capitalize } from '~/utils';
import Typography from '@material-ui/core/Typography';
import { shopResetFilter, shopResetFilters } from '~/store/shop/shopActions';
import ProductCardGridSkeleton from './ProductCardGridSkeleton';
import ProductCardListSkeleton from './ProductCardListSkeleton';
import { useRouter } from 'next/router';

interface IProps {
  products: IProductElasticHitsSecond[];
  totalPages: number;
}

export default function ShopGrid({ products, totalPages }: IProps) {
  // Drawer stuff
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  // End drawer stuff
  const dispatch = useDispatch();
  const sort = useSelector((state: IState) => state.uiState.sortPage);
  const shopGrid = useSelector((state: IState) => state.uiState.shopGrid);
  const filters = useSelector((state: IState) => state.shopNew.filters);
  const filtersBarOpen = Object.keys(filters).length ? true : false;
  const loading = useSelector((state: IState) => state.shopNew.productsLoading);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      cards: {
        margin: '0 auto',
        padding: theme.spacing(2),
        display: 'grid',
        gridTemplateColumns:
          shopGrid === 'grid'
            ? `repeat(auto-fill, minmax(${prodCardSize}px, 1fr))`
            : `1fr `,
        gridGap: theme.spacing(4), // padding for cards in the content area
        marginBottom: theme.spacing(5),
      },
      pageBarContainer: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        position: 'relative',
      },
      pageBarBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        background: theme.palette.background.paper,
        boxShadow: '0 1px 3px  rgba(0, 0, 0, 0.1)',
      },
      iconsBoxContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      iconItem: {
        fontSize: '1.7rem',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
      },
      iconGrid: {
        fontSize: '1.7rem',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        color:
          shopGrid === 'grid'
            ? theme.palette.primary.main
            : theme.palette.action.disabled,
      },
      iconList: {
        fontSize: '1.7rem',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        color:
          shopGrid === 'list'
            ? theme.palette.primary.main
            : theme.palette.action.disabled,
      },

      selectForm: {
        [theme.breakpoints.down('sm')]: {
          maxWidth: '15rem',
        },
        [theme.breakpoints.up('sm')]: {
          maxWidth: '15rem',
        },
      },
      resize: {
        color: theme.palette.text.secondary,
        padding: '.4rem 14px',
        fontSize: '0.9rem',
      },
      label: {},
      paginationBottom: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(5),
      },
      pageBottomPaginationBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        background: theme.palette.background.paper,
        boxShadow: '0 1px 3px  rgba(0, 0, 0, 0.1)',
      },
      filterButton: {
        marginRight: theme.spacing(2),
      },
      filtersBox: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        background: theme.palette.background.paper,
        boxShadow: '0 1px 3px  rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
      },
      deleteChip: {
        marginRight: theme.spacing(1),
      },
      dividerBox: {
        position: 'absolute',
        left: '50%',
        top: '-0.5rem',
        transform: `translateX(-50%)`,
        paddingRight: '1rem',
        paddingLeft: '1rem',
        background: theme.palette.background.paper,
        color: theme.palette.text.disabled,
        [theme.breakpoints.down('xl')]: {
          fontSize: '0.75rem',
        },
        [theme.breakpoints.up('xxl')]: {
          fontSize: '0.85rem',
        },
      },
    })
  );

  const classes = useStyles();

  let productsSorted;
  switch (sort) {
    case '1':
      productsSorted = products;
      break;
    case '2':
      /* productsSorted = products.hits.sort(compareByPriceDesc); */
      break;
    case '3':
      /* productsSorted = products.hits.sort(compareByPriceAsc); */
      break;
    case '4':
      productsSorted = products.sort(compareByNameAsc);
      break;
    case '5':
      productsSorted = products.sort(compareByNameDesc);
      break;
    default:
      productsSorted = products;
      break;
  }

  const values = [
    { value: 1, label: 'по умолчанию' },
    { value: 2, label: 'цена: сначала дешевые' },
    { value: 3, label: 'цена: сначала дорогие' },
    { value: 4, label: 'название: А - Я' },
    { value: 5, label: 'название: Я - А' },
  ];

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: SET_SORT_VALUE, payload: event.target.value });
  };

  const handleGrid = () => {
    dispatch({ type: SET_SHOP_GRID, payload: 'grid' });
  };
  const handleList = () => {
    dispatch({ type: SET_SHOP_GRID, payload: 'list' });
  };
  const handleDeleteFilter = (filterSlug: string) => {
    dispatch(shopResetFilter(filterSlug));
  };
  const handleDeleteFilters = () => {
    dispatch(shopResetFilters());
  };
  const Select = () => (
    <TextField
      id="outlined-select-currency-native"
      select
      label="сортировать"
      value={sort}
      onChange={handleSortChange}
      SelectProps={{
        native: true,
      }}
      InputProps={{
        classes: {
          input: classes.resize,
        },
      }}
      InputLabelProps={{
        classes: {
          root: classes.label,
        },
      }}
      variant="outlined"
      size="small"
      fullWidth
    >
      {values.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
  const FilterIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
      <path d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0l-2.01-2.01a.989.989 0 0 1-.29-.83V12h-.03L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L14.03 12H14z" />
    </SvgIcon>
  );

  const [pagPage, setPagPage] = useState(1);
  const router = useRouter();
  const { make, model, category, page } = router.query;

  function paginationHandler(e: object, page: number) {
    console.log('Current page is:', page);
    setPagPage(page);
    router.push({
      pathname: `/car/${make}/${model}/${category}/${page}`,
    });
  }

  return (
    <React.Fragment>
      <FilterDrawer openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
      <Grid container>
        <Grid item container xs={12}>
          <Grid className={classes.pageBarContainer} item xs={12}>
            <Box className={classes.pageBarBox}>
              <Box className={classes.iconsBoxContainer}>
                <Hidden mdUp>
                  <Button
                    onClick={toggleDrawer}
                    variant="outlined"
                    color="primary"
                    className={classes.filterButton}
                    startIcon={<FilterIcon color="primary" />}
                  >
                    ФИЛЬТРЫ
                  </Button>
                </Hidden>
                <AppsIcon className={classes.iconGrid} onClick={handleGrid} />
                <MenuIcon className={classes.iconList} onClick={handleList} />
              </Box>
              <Box className={classes.selectForm}>
                <Select />
              </Box>
              <Hidden mdDown>
                <Box>
                  <Pagination
                    onChange={paginationHandler}
                    count={totalPages}
                    page={pagPage}
                    color="primary"
                  />
                </Box>
              </Hidden>
            </Box>
          </Grid>
          {filtersBarOpen && (
            <Grid className={classes.pageBarContainer} item xs={12}>
              <Typography className={classes.dividerBox} variant="body2">
                АКТИВНЫЕ ФИЛЬТРЫ
              </Typography>
              <Box className={classes.filtersBox}>
                {Object.entries(filters).map((fil: any) => {
                  return (
                    <Chip
                      key={fil[0]}
                      className={classes.deleteChip}
                      variant="outlined"
                      size="small"
                      label={capitalize(fil[0])}
                      onDelete={() => {
                        handleDeleteFilter(fil[0]);
                      }}
                      onClick={() => {
                        handleDeleteFilter(fil[0]);
                      }}
                    />
                  );
                })}
                <Chip
                  className={classes.deleteChip}
                  variant="outlined"
                  size="small"
                  label="Очистить Все"
                  onDelete={handleDeleteFilters}
                  onClick={handleDeleteFilters}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <div className={classes.cards}>
            {products.map((item: IProductElasticHitsSecond) => {
              const elem =
                shopGrid === 'grid' ? (
                  <ProductCardGrid key={item._id} product={item} />
                ) : (
                  <ProductCardList key={item._id} product={item} />
                );
              const skel =
                shopGrid === 'grid' ? (
                  <ProductCardGridSkeleton key={item._id} />
                ) : (
                  <ProductCardListSkeleton key={item._id} />
                );

              return !loading ? elem : skel;
            })}
          </div>
        </Grid>
        <Grid className={classes.paginationBottom} item xs={12}>
          <Box className={classes.pageBottomPaginationBox}>
            <Pagination count={50} color="primary" />
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
