import ProjectClient from '../ac_client/ProjectsPage';
import React from 'react';

const ClientRoute = {
  path: "client",
  element: (
    <React.Fragment>
      <ProjectClient />
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
