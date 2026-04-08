import { createContext, useContext, useMemo, useReducer } from "react";

const initialState = {
  categories: [],
  components: [],
  configurations: [],
  isLoading: false,
  error: "",
  toast: null
};

function appDataReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload || "" };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload || [] };
    case "SET_COMPONENTS":
      return { ...state, components: action.payload || [] };
    case "SET_CONFIGURATIONS":
      return { ...state, configurations: action.payload || [] };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
    default:
      return state;
  }
}

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(appDataReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
}
