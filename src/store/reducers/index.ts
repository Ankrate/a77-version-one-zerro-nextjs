import { combineReducers } from 'redux';

import { changeCarModelReducer } from './changeCarModelReducer';
import { UIReducer } from '~/store/reducers/UIReducer';
import { shopReducer } from '~/store/shop/shopReducer';

export default combineReducers({
  shop: changeCarModelReducer,
  shopNew: shopReducer,
  uiState: UIReducer,
});
