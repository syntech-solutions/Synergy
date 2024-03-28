import { Route, RouteObject, Routes } from "react-router-dom";
import Auth from "../components/LandingPage/Auth";
import WelcomePage from "../components/LandingPage/WelcomePage";
import MainLayout from "../components/MainLayout";
import MiniDrawer from "../components/MainPage/SideBar";
import MainSync from "../components/Syncs/MainSync";
import Dashboard from "../components/MainPage/Dashboard";
import ChatMain from "../components/PeopleMain/PeopleMain";
import ProjectsPage from "../components/Projects/projects(3)";
import SyncMain from "../components/Syncs/SyncMain";
import ProfilePage from "../components/MainPage/ProfilePage";
import SignIn from "../components/LandingPage/SignIn";
import SignUp from "../components/LandingPage/SignUp";
import MainSyncs from "../components/Syncs/main-syncs (1)";
import Profile from "../components/ProfilePage/Profile";
import PeopleMain from "../components/PeopleMain/PeopleMain";
import AdvancedCalendar from "../components/Calendar/AdvancedCalendar (1)";
import SyncsPage from "../components/Syncs/syncspage";
import ProjectsView from "../components/Projects/projectsView";
import CallScreen from "../components/Call/CallScreen";
import { auth } from "../config/firebase";
import ModDashboard from "../components/MainPage/ModDashboard";

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <WelcomePage />,
      },
      {
        path: "/Auth",
        children: [
          { path: "SignIn", element: <Auth mainContent={<SignIn />} /> },
          { path: "SignUp", element: <Auth mainContent={<SignUp />} /> },
        ],
      },
      {
        path: "/MainPage",
        children: [
          { path: "", element: <MiniDrawer mainContent={<Dashboard />} /> },
          {
            path: "Dashboard",
            element: <MiniDrawer mainContent={<Dashboard />} />,
          },
          { path: "Chats", element: <MiniDrawer mainContent={<ChatMain />} /> },
          {
            path: "Syncs",
            element: <MiniDrawer mainContent={<MainSyncs />} />,
          },
          {
            path: "Projects",
            element: <MiniDrawer mainContent={<ProjectsView />} />,
          },
          {
            path: "People",
            element: <MiniDrawer mainContent={<PeopleMain />} />,
          },
          {
            path: "Profile",
            element: <MiniDrawer mainContent={<Profile />} />,
          },
          {
            path: "Calendar",
            element: <MiniDrawer mainContent={<AdvancedCalendar />} />,
            // element: <ControlCalendar />,
          },
        ],
      },
      {
        path: "/Syncs/:id",
        element: <MiniDrawer mainContent={<SyncsPage />} />,
      },
      {
        path: "/Projects/:id",
        element: <MiniDrawer mainContent={<ProjectsPage />} />,
      },
      {
        path: "/ModView",
        element: <MiniDrawer mainContent={<ModDashboard />} />,
      },
      {
        path: "/*",
        element: <h1>Page Not Found</h1>,
      },
      // {
      //   path: "/Call",
      //   element: (
      //     <CallScreen callID={"xRWq6SDcSeSHUrS5jqvR"} userID={"user1"} />
      //   ),
      // },
    ],
  },
];

export default routes;
