import axios from 'utils/axios';
import jwtDecode from 'jwt-decode';

const API_URL = '/api/auth';

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

let getToken = () => {
  return localStorage.getItem('token')
}


let getTokenInfo = () => {
  return jwtDecode(getToken())
}

const getTokenExpirationDate = encodedToken => {
  const token = jwtDecode(encodedToken);
  if (!token.exp) {
    return null;
  }

  const expirationDate = new Date(0);
  expirationDate.setUTCSeconds(token.exp);

  return expirationDate;
}

const isTokenExpired = token => {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}


const register = async (name, email, password) => {
  await axios.post(`${API_URL}/register`, {name, email, password});
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthToken(null);
}

const getAuthToken = () => localStorage.getItem('token');
const getUserFromLocalCache = () => JSON.parse(localStorage.getItem('user'));

const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
}

let isLogged = () => {
  let token = localStorage.getItem('token')
  return token === null
}


export const auth = {
  setAuthToken,
  getTokenExpirationDate,
  isTokenExpired,
  register,
  logout,
  getAuthToken,
  isAuthenticated,
  getUserFromLocalCache,
  isLogged,
  getTokenInfo,

};
