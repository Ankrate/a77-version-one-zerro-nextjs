import React from 'react';
import { Paper, Grid, Chip, Typography, Box, Button } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { IUser } from '~/interfaces';
import { IAddress } from '~/interfaces';

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
    avatarGrid: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    addressGrid: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(2),
      },
    },
    paper: {
      height: '100%',
    },
    userPaper: {
      minHeight: theme.spacing(30),
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      '& > *': {
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
      },
    },
    avatar: {
      width: 100,
      height: 100,
    },
    address: {
      height: '100%',
      minHeight: theme.spacing(30),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    profileButton: {
      marginTop: theme.spacing(2),
    },
    ordersGrid: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(3),
    },
    orderTitle: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(2),
    },
    addressBox: {
      '&>*': {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
      },
    },
    chipBox: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    addressTitle: {
      paddingBottom: theme.spacing(2),
    },
    editAddressButtonBox: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      textAlign: 'center',
    },
  })
);

interface IProps {
  user: IUser;
  addresses: IAddress[];
}

export default function AddressesPaper({ user, addresses }: IProps) {
  const classes = useStyles();

  function handleAddresses() {
    // Hnadle addresses
  }
  if (addresses && addresses.length > 0) {
    const address = addresses.find(
      (address: IAddress) => address.default === true
    );

    return (
      <Paper className={classes.address}>
        {Object.keys(user).length ? (
          <React.Fragment>
            <Box className={classes.chipBox}>
              <Typography className={classes.addressTitle} variant="h6">
                Адрес Доставки
              </Typography>
              <Chip size="small" label="Основной" />
            </Box>
            {user && Object.keys(user.address_user).length ? (
              <Box className={classes.addressBox}>
                <Box>
                  <Typography variant="subtitle2">Адрес</Typography>
                  <Typography variant="body1">{address?.address}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Город</Typography>
                  <Typography variant="body1">{address?.city}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Индекс</Typography>
                  <Typography variant="body1">{address?.zip_code}</Typography>
                </Box>
                {Object.keys(user.profile).length && (
                  <Box>
                    <Typography variant="subtitle2">Телефон</Typography>
                    <Typography variant="body1">
                      {user.profile.phone}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Box>
            ) : (
              ''
            )}
            <Box className={classes.editAddressButtonBox}>
              <Button onClick={handleAddresses} variant="contained">
                Редактировать Адреса
              </Button>
            </Box>
          </React.Fragment>
        ) : (
          ''
        )}
      </Paper>
    );
  } else {
    return <div>No addresses</div>;
  }
}
