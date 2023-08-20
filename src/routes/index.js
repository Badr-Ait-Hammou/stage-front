import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoute from './AdminRoute';
import ClientRoute from './ClientRoute';
import ManagerRoute from './ManagerRoute';
import ErrorRoute from './ErrorRoute';
import { auth } from './auth';

// ==============================|| ROUTING RENDER ||============================== //


export default function ThemeRoutes() {
  const userRole = auth.getUserFromLocalCache();
  console.log("userRole = ",userRole);
  let routes = [];
  switch (userRole) {
    case 'ADMIN':
      routes = [AdminRoute, ClientRoute, ManagerRoute];
      break;
    case 'CLIENT':
      routes = [ClientRoute];

      break;
    case 'MANAGER':
      routes = [ManagerRoute];
      break;
    default:
      routes = [ErrorRoute];
      break;
  }

  console.log('Routes:', routes);

  return useRoutes([AuthenticationRoutes,...routes]);
}
