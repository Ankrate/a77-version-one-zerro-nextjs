import React from 'react';
import Head from 'next/head';
import AnimationPage from '~/components/common/AnimationPage';
import { footerData, SITE_DOMAIN_FULL } from '~/config';
import { Paper, Grid, Typography } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import BreadCrumbs from '~/components/common/BreadCrumbs';
import url from '~/services/url';
import { IBread } from '~/interfaces';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(5),
      margin: '0 auto',
      [theme.breakpoints.down('lg')]: {
        maxWidth: '80%',
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: '70%',
      },
    },
    breads: {
      paddingTop: theme.spacing(2),
    },
    title: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(5),
      height: '100%',
      width: '100%',
    },
    mapGrid: {
      paddingTop: theme.spacing(2),
    },
    mapPaper: {
      padding: theme.spacing(2),
    },
    horisontalBox: {
      display: 'flex',
      alignItems: 'center',
    },
    row: {
      paddingBottom: theme.spacing(2),
    },
    subtitle: {
      paddingBottom: theme.spacing(2),
    },
    p: {
      paddingBottom: theme.spacing(2),
      '&>span': {
        fontWeight: 700,
      },
    },
    payment: {
      display: 'flex',
      flexDirection: 'column',
    },
    item: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    table: {
      minWidth: '100%',
    },
  })
);
const breadCrumbs = [
  { name: 'Ангара77', path: '/' },
  { name: 'О Компании', path: url.about() },
];

export default function About() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AboutHead />
      <AnimationPage>
        <Grid className={classes.container} container>
          <Grid className={classes.breads} item xs={12}>
            <BreadCrumbs breadCrumbs={breadCrumbs} />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h1">
              Способы оплаты
            </Typography>
          </Grid>
          <Grid className={classes.row} container item xs={12}>
            <Paper className={classes.paper}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">

                  <TableBody>

                    <TableRow>
                      <TableCell component="th" scope="row">
                        Название
                      </TableCell>
                      <TableCell align="right">
                        Общество с ограниченной ответственностью "АНГАРА"
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        ИНН
                      </TableCell>
                      <TableCell align="right">
                        7733607590
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        КПП
                      </TableCell>
                      <TableCell align="right">
                        773301001
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Банк
                      </TableCell>
                      <TableCell align="right">
                        ПАО "ПРОМСВЯЗЬБАНК" Г.МОСКВА
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        БИК
                      </TableCell>
                      <TableCell align="right">
                        044525555
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        ОГРН
                      </TableCell>
                      <TableCell align="right">
                        5077746795418
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Номер счета
                      </TableCell>
                      <TableCell align="right">
                        40702810170030424301
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid className={classes.payment} item xs={12}></Grid>
            </Paper>
          </Grid>
          <Grid className={classes.row} container item xs={12}>
            <Paper className={classes.paper}>
              <Typography className={classes.subtitle} variant="h6">
                Как оплатить товар из регионов?
              </Typography>
              <Grid className={classes.payment} item xs={12}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum
                optio nemo, praesentium quo suscipit corporis quod tenetur
                sapiente dolorem minus quae natus itaque aliquid tempora
                quibusdam vero nam soluta inventore ad molestiae at sit nisi
                commodi. Praesentium autem quae pariatur consequatur omnis vero
                eveniet soluta veniam quos enim sed officia, quo debitis nihil
                tempora dolorum quas quidem laboriosam non libero placeat beatae
                similique quam. Sapiente porro odit dolorem sequi debitis,
                delectus fugit illo ullam facere aut ad maiores iste. Esse
                libero aliquam explicabo at fuga recusandae repudiandae nesciunt
                et nobis. Veniam officia quos vitae labore aperiam voluptates
                optio temporibus molestiae!
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </AnimationPage>
    </React.Fragment>
  );
}

const AboutHead = () => {
  const breadItems = breadCrumbs.map((bread: IBread, i: number) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: bread.name,
    item: `${SITE_DOMAIN_FULL}${bread.path}`,
  }));
  return (
    <Head>
      <title key="title">О Компании | Angara Parts</title>
      <meta
        key="description"
        name="description"
        content={`Angara 77 | ${footerData.SHOP_PHONE} Information about our
          company and history of establishment. We are open our dors in 2001 first time`}
      />
      <link
        rel="canonical"
        key="canonical"
        href={`${SITE_DOMAIN_FULL}${url.about()}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadItems,
          }),
        }}
      />
    </Head>
  );
};
