import { Route, RouteObject, Routes } from "react-router-dom";
import Auth from "../components/LandingPage/Auth";
import WelcomePage from "../components/LandingPage/WelcomePage";
import MainLayout from "../components/MainLayout";
import MiniDrawer from "../components/MainPage/SideBar";
import MainSync from "../components/Syncs/MainSync";
import Dashboard from "../components/MainPage/Dashboard";
import ChatMain from "../components/PeopleMain/PeopleMain";
import ProjectsPage from "../components/Projects/projects(2)";
import SyncMain from "../components/Syncs/SyncMain";
import ProfilePage from "../components/MainPage/ProfilePage";
import SignIn from "../components/LandingPage/SignIn";
import SignUp from "../components/LandingPage/SignUp";
import MainSyncs from "../components/Syncs/main-syncs (1)";
import Profile from "../components/ProfilePage/Profile";
import PeopleMain from "../components/PeopleMain/PeopleMain";
import AdvancedCalendar from "../components/Calendar/AdvancedCalendar (1)";
import SyncsPage from "../components/Syncs/syncspage";

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
            element: (
              <MiniDrawer mainContent={<ProjectsPage window={window} />} />
            ),
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
        path: "/*",
        element: <h1>Page Not Found</h1>,
      },
      {
        path: "/test",
        element: <MainSyncs />,
      },
    ],
  },
];

export default routes;
