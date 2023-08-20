import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoute from './AdminRoute';
import ClientRoute from './ClientRoute';
import ManagerRoute from './ManagerRoute';
import { auth } from './auth';

// ==============================|| ROUTING RENDER ||============================== //


export default function ThemeRoutes() {
  const userRole = auth.getUserFromLocalCache();
  console.log("userRole = ",userRole);
  let routes = [];
  if (userRole == 'ADMIN') {
    routes = [AdminRoute, ClientRoute, ManagerRoute];
  } else if (userRole == 'CLIENT') {
    routes = [ClientRoute];
  } else if(userRole == 'MANAGER'){
    routes = [ManagerRoute];
  }

  console.log('Routes:', routes);

  return useRoutes([AuthenticationRoutes,...routes]);
}
