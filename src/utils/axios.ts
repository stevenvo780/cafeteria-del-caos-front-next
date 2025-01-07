import axios from 'axios';
import store from '../redux/store';
import { loading } from '../redux/ui';
import { getCurrentUserToken, refreshUserToken } from '../utils/firebaseHelper';
import { logout } from '../redux/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let activeCalls = 0;
let token: string | null = null;

const updateLoadingState = () => {
  store.dispatch(loading(activeCalls > 0));
};

api.interceptors.request.use(
  async function (config) {
    activeCalls++;
    updateLoadingState();

    if (!token) {
      token = await getCurrentUserToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    activeCalls++;
    updateLoadingState();
    console.error(error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    activeCalls = Math.max(0, activeCalls - 1);
    updateLoadingState();
    return response;
  },
  async function (error) {
    activeCalls = Math.max(0, activeCalls - 1);
    updateLoadingState();

    if (error.response && error.response.status === 401) {
      try {
        token = await refreshUserToken();

        if (token) {
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        } else {
          throw new Error("Token renewal failed");
        }
      } catch (refreshError) {
        console.error("Error renewing token:", refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    console.error(error);
    return Promise.reject(error);
  }
);

export default api;
