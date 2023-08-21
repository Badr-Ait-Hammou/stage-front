import ProjectClient from '../ac_client/ProjectsPage';
import React from 'react';
import MainLayout from '../layout/MainLayout';
import ImageDetail from '../component/ImageDetail';
import ProjectComment from '../ac_client/ProjectComment';
import MyProfile from "../component/Profile"
import AboutUs from "../component/AboutUs"
const ClientRoute = {
  path: "visumine",
  element: (
    <React.Fragment>
       <MainLayout />,
    </React.Fragment>
  ),
  children: [
    {
      path: 'client_projects',
      element: <ProjectClient />
    }, {
      path: 'aboutUs',
      element: <AboutUs />
    },
    {
      path: 'client_projects/Imagedetail/:id',
      element: <ImageDetail />
    },
    {
      path: 'client_projects/project_comment/:id',
      element: <ProjectComment />
    },
    {
      path: 'profile',
      element: <MyProfile />
    }
  ]
};

export default ClientRoute;
