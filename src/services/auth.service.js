import axios from "axios";
import { API_URL } from  '../utilities/staticData';

const register = (name, phone, email, avatar, password) => {
  return axios
    .post(API_URL + "/users/register", {
      name,
      phone,
      email,
      avatar,
      password,
    })
    .then((response) => {
      return response?.status;
    });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "/users/login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      if (response) { return response.data}
      else { return -1; }
    });
};

const updateProfile = (params, token) => {
  return axios
    .put(API_URL + "/users/updateProfile", params, { headers: { token: `Bearer ${token}` } })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};


const setCurrentUser = (user) => {
  return JSON.parse(localStorage.setItem("user", JSON.stringify(user)));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  setCurrentUser,
  updateProfile
};

export default authService;
