
import { Navigate } from "react-router-dom";
import { auth } from './auth';


const ProtectedRoute = ({children}) => {

  if(!auth.isLogged()){
    return <Navigate to="/login"/>
  }

  return children
};

export default ProtectedRoute;