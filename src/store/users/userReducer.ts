import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  USER_AUTHENTICATED_SUCCESS,
  USER_AUTHENTICATED_FAIL,
  USER_LOGOUT,
  USER_PASSWORD_RESET_SUCCESS,
  USER_PASSWORD_RESET_FAIL,
  USER_PASSWORD_RESET_CONFIRM_SUCCESS,
  USER_PASSWORD_RESET_CONFIRM_FAIL,
  USER_SIGN_UP_SUCCESS,
  USER_SIGN_UP_FAIL,
  USER_ACTIVATION_SUCCESS,
  USER_ACTIVATION_FAIL,
  IUserAction,
  USER_GOOGLE_LOGIN_SUCCESS,
  USER_GOOGLE_LOGIN_FAIL,
} from './userActionTypes';
import { IUser, IUserState } from '~/interfaces';
import jwt from 'jsonwebtoken';

const dateNow = new Date();
let access = '';
let refresh = '';

if (typeof window !== 'undefined') {
  access = localStorage.getItem('access') || '';
  refresh = localStorage.getItem('refresh') || '';
}
let isAuthenticated = false;
if (refresh) {
  const decodedRefresh = jwt.decode(refresh, { complete: true });
  if (decodedRefresh?.exp < dateNow.getTime()) {
    refresh = '';
  }
}
if (access) {
  const decoded = jwt.decode(access, { complete: true });

  if (decoded?.exp < dateNow.getTime()) {
    access = '';
  } else {
    isAuthenticated = true;
  }
}

// Trying to get user from localstorage if not empty strings
let user = {} as IUser | null;
if (typeof window !== 'undefined') {
  user = JSON.parse(localStorage.getItem('user') as string) || null;
}
let email = user ? user.email : '';
let username = user ? user.username : '';

const initialState: IUserState = {
  access: access,
  refresh: refresh,
  isAuthenticated: isAuthenticated,
  email: email,
  username: username,
};

export const userReducer = (
  state: IUserState = initialState,
  action: IUserAction
) => {
  switch (action.type) {
    case USER_AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case USER_AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case USER_SIGN_UP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };

    case USER_LOGIN_SUCCESS:
      localStorage.setItem('access', action.payload?.tokens.access!);
      localStorage.setItem('refresh', action.payload?.tokens.refresh!);
      localStorage.setItem(
        'user',
        JSON.stringify({
          username: action.payload?.username,
          email: action.payload?.email,
        })
      );
      return {
        ...state,
        isAuthenticated: true,
        access: action.payload?.tokens.access,
        refresh: action.payload?.tokens.refresh,
        email: action.payload?.email,
        username: action.payload?.username,
      };
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };
    case USER_GOOGLE_LOGIN_SUCCESS:
      localStorage.setItem('access', action.payload?.tokens.access!);
      localStorage.setItem('refresh', action.payload?.tokens.refresh!);
      return {
        ...state,
        isAuthenticated: true,
        access: action.payload?.tokens.access,
        refresh: action.payload?.tokens.refresh,
        email: action.payload?.email,
        username: action.payload?.username,
      };
    case USER_LOGOUT:
    case USER_GOOGLE_LOGIN_FAIL:
    case USER_LOGIN_FAIL:
    case USER_SIGN_UP_FAIL:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        access: null,
        refresh: null,
        user: null,
      };
    case USER_ACTIVATION_SUCCESS:
      return {
        ...state,
      };
    case USER_PASSWORD_RESET_SUCCESS:
    case USER_PASSWORD_RESET_FAIL:
    case USER_PASSWORD_RESET_CONFIRM_SUCCESS:
    case USER_PASSWORD_RESET_CONFIRM_FAIL:
    case USER_ACTIVATION_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
};
