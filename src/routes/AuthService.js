import axios from "axios"
import {setAuthToken} from "./auth";


const API_URL = 'http://localhost:8080/api/auth';

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
// console.log("return motherfucker", response.data.user.role);
      return user; // Return user without JSON.parse
    } catch (e) {
      console.error(e);
      throw e; // Explicitly throw the error to reject the Promise
    }
  },
};

export default AuthService;