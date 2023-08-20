import { auth } from './auth';
import { useNavigate, useRoutes } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import { useEffect } from 'react';
import ClientRoute from './ClientRoute';
import ManagerRoute from './ManagerRoute';
import AuthenticationRoutes from './AuthenticationRoutes';

const AuthGuard = ({children}) => {
  let user = auth.getUserFromLocalCache();
  const navigate = useNavigate();
  const adminRouting = useRoutes(AdminRoute);
  const userRouting = useRoutes(ClientRoute);
  const managerRouting = useRoutes(ManagerRoute);
  const authenticationrouting = useRoutes(AuthenticationRoutes);
  useEffect(() => {
    if (!auth.isLogged()) {
      navigate("/");
    }
  }, [authenticationrouting,adminRouting, userRouting, managerRouting, navigate]);

console.log(user);
  if (user !== null && user?.role === 'ADMIN') {
    return (<div className="dark">
      {adminRouting}
    </div>);
  }
  else if(user !== null && user?.role === 'MANAGER'){
    return (<div className="dark">
      {managerRouting}
    </div>);
  }
    else {
    return (<div className="dark">
      {userRouting}
    </div>);
  }
};

export default AuthGuard;
