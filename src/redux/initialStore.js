import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { cacheReduser } from "./reducers/cacheReduser";

export const store = createStore(cacheReduser, composeWithDevTools());
