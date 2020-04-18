import { createStore, compose } from "redux";
import { PatentTranslator } from "./types";
import * as actionTypes from "./actions";

const initialState: PatentTranslator = {
  englishTexts: [],
  uniqueKeys: [],
  uniqueKeysSortByUseCount: [],
  keysToShow: [],
  foundTexts: []
};

const reducer = (
  state = initialState,
  action: { [key: string]: string | string[] }
) => {
  switch (action.type) {
    case actionTypes.SET_ENGLISH_TEXTS:
      return {
        ...state,
        englishTexts: action.payload
      };
    case actionTypes.SET_UNIQUE_KEYS:
      return {
        ...state,
        uniqueKeys: action.payload
      };
    case actionTypes.SET_UNIQUE_KEYS_SORT_BY_USE_COUNT:
      return {
        ...state,
        uniqueKeysSortByUseCount: action.payload
      };
    case actionTypes.SET_KEYS_TO_SHOW:
      return {
        ...state,
        keysToShow: action.payload
      };
    case actionTypes.SET_FOUND_TEXTS:
      return {
        ...state,
        foundTexts: action.payload
      };
    default:
      return state;
  }
};

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

export const store = createStore(reducer as any, composeEnhancers());
