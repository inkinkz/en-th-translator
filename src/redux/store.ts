import { createStore } from "redux";
import { PatentTranslator } from "./types";
import {
  SET_ENGLISH_TEXTS,
  SET_UNIQUE_KEYS,
  SET_FOUND_TEXTS,
  SET_UNIQUE_KEYS_SORT_BY_USE_COUNT,
  SET_KEYS_TO_SHOW
} from "./actions";

const initialState: PatentTranslator = {
  englishTexts: [],
  uniqueKeys: [],
  uniqueKeysSortByUseCount: [],
  keysToShow: [],
  foundTexts: []
};

const reducer = (
  state: PatentTranslator,
  action: { [key: string]: string | string[] }
) => {
  switch (action.type) {
    case SET_ENGLISH_TEXTS:
      return {
        ...state,
        englishTexts: action.payload
      };
    case SET_UNIQUE_KEYS:
      return {
        ...state,
        uniqueKeys: action.payload
      };
    case SET_UNIQUE_KEYS_SORT_BY_USE_COUNT:
      return {
        ...state,
        uniqueKeysSortByUseCount: action.payload
      };
    case SET_KEYS_TO_SHOW:
      return {
        ...state,
        keysToShow: action.payload
      };
    case SET_FOUND_TEXTS:
      return {
        ...state,
        foundTexts: action.payload
      };
    default:
      return state;
  }
};

export const store = createStore(
  reducer as any,
  initialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
