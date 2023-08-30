import axios from "utils/axios"
import {setAuthToken} from "./auth";


//const API_URL = 'https://garrulous-metal-production.up.railway.app/api/auth';
const API_URL = '/api/auth';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/authenticate`, {email, password});
      const token = response.data.access_token;
      const user = response.data.role;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user as a string
      setAuthToken(token);
      console.log(user);
      return user;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};

export default AuthService;