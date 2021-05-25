import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseReducer } from 'react-redux-firebase';
import { LOGIN, LOGOUT, LOCALE, IMAGES_LIST } from '../actions/HeaderActions';
import { CREATELICENSEREQUEST, ADDPLAYERTOREQUEST } from '../actions/RequestsActions';

function user(state = {}, { type, user }) {
  switch (type) {
    case LOGIN:
      return { ...state, ...user };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

function locale(state = 'uk', action) {
  switch (action.type) {
    case LOCALE:
      return action.locale;
    default:
      return state;
  }
}

function clubsList(state = {}, action) {
  switch (action.type) {
    case 'GETCLUBS':
      return action.clubsList;
    default:
      return state;
  }
}

function playersList(state = {}, action) {
  switch (action.type) {
    case 'GETPLAYERS':
      return action.playersList;
    default:
      return state;
  }
}

function imagesList(state = {}, action) {
  switch (action.type) {
    case IMAGES_LIST:
      return action.imagesList;
    default:
      return state;
  }
}

function transfersList(state = {}, action) {
  switch (action.type) {
    case 'GETTRANSFERS':
      return action.transfersList;
    default:
      return state;
  }
}

function photoStorage(state = { show: false }, action) {
  switch (action.type) {
    case 'SHOWPHOTOSTORAGE':
      return action.photoStorage;
    case 'HIDEPHOTOSTORAGE':
      return action.photoStorage;
    default:
      return state;
  }
}

function choosedPhotoUrl(state = '', action) {
  switch (action.type) {
    case 'CHOOSEDPHOTOURL':
      return action.choosedPhotoUrl;
    default:
      return state;
  }
}

function licenseRequest(state = {}, action) {
  switch (action.type) {
    case CREATELICENSEREQUEST:
      return action.newRequest;
    case ADDPLAYERTOREQUEST: {
      const { player } = action,
        newState = {};

      newState.playersList = { ...state.playersList, ...player };

      return { ...state, ...newState };
    }
    default:
      return state;
  }
}

const floorballApp = combineReducers({
  firebase: firebaseReducer,
  user,
  locale,
  clubsList,
  playersList,
  photoStorage,
  choosedPhotoUrl,
  transfersList,
  imagesList,
  licenseRequest,
  routing: routerReducer,
});

export default floorballApp;
