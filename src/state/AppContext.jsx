import { createContext, useContext, useEffect, useReducer } from "react";
import { api } from "../api/client.js";

const savedUser = JSON.parse(localStorage.getItem("authUser") || "null");
const savedToken = localStorage.getItem("token") || "";

const initialState = {
  authUser: savedUser,
  token: savedToken,
  students: [],
  companies: [],
  drives: [],
  applications: [],
  interviews: [],
  filters: { studentSearch: "", studentDepartment: "", driveSearch: "", applicationStatus: "" },
  analytics: {},
  notice: "",
  loading: false
};

const AppContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_NOTICE":
      return { ...state, notice: action.payload };
    case "LOGIN":
      localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      return { ...state, authUser: action.payload.user, token: action.payload.token };
    case "LOGOUT":
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
      return { ...initialState, authUser: null, token: "" };
    case "SET_COLLECTION":
      return { ...state, [action.key]: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, [action.key]: action.payload } };
    case "SET_ANALYTICS":
      return { ...state, analytics: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window.appState = {
      authUser: state.authUser,
      token: state.token,
      students: state.students,
      companies: state.companies,
      drives: state.drives,
      applications: state.applications,
      interviews: state.interviews,
      filters: state.filters,
      analytics: state.analytics
    };
  }, [state]);

  const request = (path, options = {}) => api(path, options, state.token);

  const login = async (email, password) => {
    const payload = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    dispatch({ type: "LOGIN", payload: payload.data });
    return payload;
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  const loadAll = async () => {
    if (!state.token) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [students, companies, drives, applications, interviews, dashboard] = await Promise.all([
        request("/students"),
        request("/companies"),
        request("/drives"),
        request("/applications"),
        request("/interviews"),
        request("/analytics/dashboard")
      ]);
      dispatch({ type: "SET_COLLECTION", key: "students", payload: students.data });
      dispatch({ type: "SET_COLLECTION", key: "companies", payload: companies.data });
      dispatch({ type: "SET_COLLECTION", key: "drives", payload: drives.data });
      dispatch({ type: "SET_COLLECTION", key: "applications", payload: applications.data });
      dispatch({ type: "SET_COLLECTION", key: "interviews", payload: interviews.data });
      dispatch({ type: "SET_ANALYTICS", payload: dashboard.data });
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return <AppContext.Provider value={{ state, dispatch, request, login, logout, loadAll }}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
