import React from 'react';
import Head from 'next/head';
import AnimationPage from '~/components/common/AnimationPage';
import { footerData, SITE_DOMAIN_FULL } from '~/config';
import { Box, Grid, Typography, Container, Paper } from '@material-ui/core';

import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { GetServerSidePropsContext } from 'next';
import DashboardLeftMenu from '~/components/account/DashboardLeftMenu';
import url from '~/services/url';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IUser, IOrder, IOrderProducts } from '~/interfaces';
import { getUserCookie } from '~/services/getUserCookie';
import NoLoggedIn from '~/components/account/NotLoggedIn';
import { backServerUrlRest } from '~/config';
import axios from 'axios';
import NotLoggedIn from '~/components/account/NotLoggedIn';
import Moment from 'moment';
import Link from 'next/link';

// This is the recommended way for Next.js 9.3 or newer
interface IProps {
  user: IUser;
  access: string;
  order: IOrder;
}
export default function Order({ access, order }: IProps) {
  const classes = useStyles();
  Moment.locale('ru');

  if (access) {
    return (
      <React.Fragment>
        <DashboardHead />
        <AnimationPage>
          <Container maxWidth="lg">
            <Grid className={classes.container} container>
              <Grid className={classes.left} item container xs={12} sm={3}>
                <Grid container>
                  <Grid item xs={12}>
                    <DashboardLeftMenu />
                  </Grid>
                </Grid>
              </Grid>
              <Grid className={classes.right} item container xs={12} sm={9}>
                <Grid container>
                  <Grid className={classes.ordersGrid} item xs={12}>
                    {access ? (
                      <Paper className={classes.paper}>
                        <Typography className={classes.orderTitle} variant="h6">
                          Мои заказы
                        </Typography>
                        <Box>{Moment(order.date).format('d MMM YYYY')}</Box>
                        <TableContainer>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell align="left">Бренд</TableCell>
                                <TableCell align="left">Машина</TableCell>
                                <TableCell align="left">Кол-во</TableCell>
                                <TableCell align="left">Цена</TableCell>
                                <TableCell align="left">Сумма</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.order_products.length &&
                                order.order_products.map(
                                  (product: IOrderProducts) => {
                                    return (
                                      <TableRow key={product.product_id}>
                                        <TableCell component="th" scope="row">
                                          <Link href={url.product(product.id)}>
                                            <a>
                                              <Typography
                                                className={classes.orderDate}
                                                color="primary"
                                                variant="body2"
                                              >
                                                {product.product_name}
                                              </Typography>
                                            </a>
                                          </Link>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            className={classes.orderRow}
                                            variant="body2"
                                          >
                                            {product.product_brand}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          {product.product_car}
                                        </TableCell>
                                        <TableCell align="left">
                                          {product.qty}
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography variant="body2">
                                            &#8381; {product.product_price}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            className={classes.orderSum}
                                            variant="body2"
                                          >
                                            &#8381;{' '}
                                            {parseFloat(
                                              product.product_price as string
                                            ) * product.qty}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  }
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    ) : (
                      <NotLoggedIn />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </AnimationPage>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <NoLoggedIn />
      </React.Fragment>
    );
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id || '';

  const data = await getUserCookie(context);
  let user = {} as IUser;
  let access = '';
  if (data) {
    user = data.user;
    access = data.access;
  }
  /* if (!access) { */
  /*   return { */
  /*     redirect: { */
  /*       destination: url.account.login(), */
  /*       permanent: false, */
  /*     }, */
  /*   }; */
  /* } */

  let order = {} as IOrder;
  if (access) {
    const urlAxios = `${backServerUrlRest}/orders/${id}/`;
    const config = {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };
    try {
      const response = await axios.get(urlAxios, config);
      order = response.data;
    } catch (e) {}
  }

  return {
    props: {
      user,
      access,
      order,
    },
  };
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
    },
    left: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    right: {
      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(2),
      },
    },
    paper: {
      height: '100%',
      padding: theme.spacing(2),
    },
    ordersGrid: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    orderTitle: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(2),
    },
    orderRow: {
      textDecoration: 'underline',
    },
    orderSum: {
      fontWeight: 700,
    },
    orderDate: {
      fontWeight: 700,
      textDecoration: 'underline',
    },
  })
);

const DashboardHead = () => (
  <Head>
    <title key="title">Заказ ANGARA77</title>
    <meta
      key="description"
      name="description"
      content={`Angara 77 | ${footerData.SHOP_PHONE} Information about our
          company and history of establishment. We are open our dors in 2001 first time`}
    />
    <meta
      key="og:title"
      property="og:title"
      content="Get your car in perfect health | Angara Parts | About Us"
    />
    <meta
      key="og:url"
      property="og:url"
      content={`${SITE_DOMAIN_FULL}/about`}
    />
    <meta key="og:image" property="og:image" content="/favicon.png" />
    <meta key="og:image:type" property="og:image:type" content="image/png" />
    <meta key="og:image:width" property="og:image:width" content="1200" />
    <meta key="og:image:hight" property="og:image:hight" content="630" />

    <meta key="og:image:alt" property="og:image:alt" content="Angara 77 logo" />
    <link rel="canonical" key="canonical" href={`${SITE_DOMAIN_FULL}/about`} />
  </Head>
);
