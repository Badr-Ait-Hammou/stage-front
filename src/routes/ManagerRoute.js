import React from 'react';
import MainLayout from 'layout/MainLayout';

// dashboard routing
import DashboardDefault from 'views/dashboard/Default';

// utilities routing
import UtilsTypography from 'views/utilities/Typography';
import UtilsColor from 'views/utilities/Color';
import UtilsShadow from 'views/utilities/Shadow';
import UtilsMaterialIcons from 'views/utilities/MaterialIcons';
import UtilsTablerIcons from 'views/utilities/TablerIcons';

// sample page routing
import SamplePage from 'views/sample-page';
import Image from '../component/Image';
import Information from '../component/Information';
import Annotation from '../component/Annotation';
import Projects from '../component/Projects';
import Storage from '../component/ImportCsv';
import ImageDetail from '../component/ImageDetail';
import Chart from "../component/Chart"
import ProjectDetails from "../component/ProjectDetails"
import Template from "../component/Template"
import Profile from '../component/Profile';
import AddClient from "../ac_manager/AddClient"
import ProjectClient from "../ac_client/ProjectsPage"
import ProjectComment from "../ac_client/ProjectComment"
import AllComments from "../component/AllComments"
import TempDetails from "../component/TemplateDetails"
import TempDetailsExcel from "../component/TemplateDetailsExcel"
import ProjectDetailsDoc from "../component/ProjectDetailDoc"
import ProjectDetailsCsv from "../component/ProjectDetailsCsv"

// ==============================|| MAIN ROUTING ||============================== //

const ManagerRoute = {
  path: 'visumine',
  element: <MainLayout />,

  children: [
    {
      path: 'projects',
      element: <Projects />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
      ]
    },

    {
      path: 'annotation',
      element: <Annotation />
    },
    {
      path: 'template',
      element: <Template />
    },
    {
      path: 'client_projects',
      element: <ProjectClient />
    },
    {
      path: 'addClient',
      element: <AddClient />
    },
    {
      path: 'profile',
      element: <Profile />
    },
    {
      path: 'all_comments',
      element: <AllComments />
    },
    {
      path: 'annotation/Imagedetail/:id',
      element: <ImageDetail />
    },
    {
      path: 'template/template_details/:id',
      element: <TempDetails />
    },
    {
      path: 'project_detailsDoc/:id',
      element: <ProjectDetailsDoc />
    },
    {
      path: 'project_detailsExcel/:id',
      element: <ProjectDetailsCsv />
    },
    {
      path: 'project_details/:id',
      element: <ProjectDetails />
    },
    {
      path: 'template/template_detailsExcel/:id',
      element: <TempDetailsExcel />
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
      path: 'projects/Imagedetail/:id',
      element: <ImageDetail />
    },
    {
      path: 'chart',
      element: <Chart />
    },
    {
      path: 'projects/project_details/:id',
      element: <ProjectDetails />
    },
    {
      path: 'all_comments/project_detailsDoc/:id',
      element: <ProjectDetailsDoc />
    },
    {
      path: 'all_comments/project_details/:id',
      element: <ProjectDetails />
    },
    {
      path: 'all_comments/project_detailsExcel/:id',
      element: <ProjectDetailsCsv />
    },
    {
      path: 'projects/project_detailsDoc/:id',
      element: <ProjectDetailsDoc />
    },
    {
      path: 'projects/project_detailsExcel/:id',
      element: <ProjectDetailsCsv />
    },
    {
      path: 'projects',
      element: <Projects />
    },
    {
      path: 'information',
      element: <Information />
    },
    {
      path: 'projects',
      element: <Projects />
    },
    {
      path: 'importCsv',
      element: <Storage />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },

    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'image',
      element: <Image />
    },

    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },

    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default ManagerRoute;
