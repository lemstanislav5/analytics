// import {InferActionsTypes} from './redux-store';
const SET_DIR_NAME = 'SET_DIR_NAME';
const SET_OPTION = 'SET_OPTION';
const IS_COINCIDENCE = 'ISCOINCIDENCE';

const getDate = () => {
  const i = n => (n < 10)? '0'+n: n, e = new Date();
  return i(e.getFullYear())+'-'+i(e.getMonth() + 1)+'-'+i(e.getDate());
}

export const initialState = {
  startTime: '2014-04-20',
  endTime: getDate(),
  firstNumberСolumn: undefined,
  secondNumberСolumn: undefined, 
  timeСolumn: undefined,
  physics: true,
  searchDepth: 1,
  numberOfCharacters: 11,
  mutualСonnections: true,
};

export const actionCreatorSetDir = (name) => {
  return { type: SET_DIR_NAME, dirName: name };
};

export const actionCreatorSetOption= (name, value) => {
  return { type: SET_OPTION, name, value };
};

export const optionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DIR_NAME: {
      return { ...state, readingFiles: { dirName: action.dirName } };
    }
    case SET_OPTION: {
      return { ...state, [action.name]: action.value };
    }
    default: {
      return state;
    }
  }
};
