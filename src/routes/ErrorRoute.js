import React from 'react';
import ErrorPage from '../views/pages/ErrorPage';

const ErrorRoute = {
  path: "*",
  element: (
    <React.Fragment>
      <ErrorPage />,
    </React.Fragment>
  ),
};

export default ErrorRoute;