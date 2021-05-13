import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Typography, Paper } from '@material-ui/core';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import url from '~/services/url';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
  })
);

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

export default function SimpleList() {
  const classes = useStyles();
  const router = useRouter();
  function handleGarage() {
    router.push(url.account.garage());
  }
  function handleProfile() {
    router.push(url.account.profile());
  }

  return (
    <Paper className={classes.root}>
      <Typography className={classes.title} variant="h6">
        Навигация
      </Typography>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemText primary="Гараж" onClick={handleGarage} />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Профиль" onClick={handleProfile} />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Выйти" onClick={() => signOut()} />
        </ListItem>
      </List>
    </Paper>
  );
}
