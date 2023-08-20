import ProjectClient from '../ac_client/ProjectsPage';
import React from 'react';
import MainLayout from '../layout/MainLayout';

const ClientRoute = {
  path: "client",
  element: (
    <React.Fragment>
       <MainLayout />,
    </React.Fragment>
  ),
  children: [
    {
      path: 'client_projects',
      element: <ProjectClient />
    }
  ]
};

export default ClientRoute;
