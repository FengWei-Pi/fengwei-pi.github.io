// Boilerplate for future application storage needs.
// To use, import `AppContextProvider` and wrap app with it. Then,
// `const [state, dispatch] = useContext(AppContext)` to get the state in a descendent component.
import { createContext, useReducer, Dispatch } from "react";

type AppState = {
  articles: Array<Article>;
}

type Article = {
  content: string;
  frontmatter: string;
}

type Action = {
  type: "SET_ARTICLES"
  payload: Array<Article>;
}

const initialState: AppState = {
  articles: []
};

export const AppContext = createContext<
  [AppState, Dispatch<Action>]
>(
  [initialState, () => { throw new Error("Using ArticleContext with no context provider ancestor"); }]
);

const reducer = (store: AppState, action: Action) => {
  if (action.type === "SET_ARTICLES") {
    return {
      ...store,
      articles: action.payload
    };
  } else {
    return store;
  }
};

export const AppContextProvider = (props) => {
  const [store, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[store, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};
