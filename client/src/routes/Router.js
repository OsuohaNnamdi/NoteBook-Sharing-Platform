import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PastQuestionForm from "../pages/dashboard/studentDashboard/PastQuestionForm"; // Removed .jsx if not required
import PastQuestions from "../pages/dashboard/studentDashboard/PastQuestions"; // Removed .jsx if not required
import SearchPage from "../pages/StudentShare/SearchPage"; // Removed .jsx if not required
import ChatPage from "../pages/StudentShare/ChatPage"; // Removed .jsx if not required
import HomePage from "../pages/HomePage"; // Removed .jsx if not required
import LoginPage from "../pages/auth/Login"; // Removed .jsx if not required
import RegistrationPage from "../pages/auth/RegistrationPage"; // Removed .jsx if not required
import StudentTable from "../pages/dashboard/studentDashboard/StudentTable"; // Removed .jsx if not required
import CourseTable from "../pages/dashboard/studentDashboard/CourseTable"; // Removed .jsx if not required
import AdminDashboard from '../pages/AdminDashboard'; // Removed .js if not required

const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout"));
const Dashboard = lazy(() => import("../pages/dashboard/studentDashboard/Dashboard"));
const LecturerDashboard = lazy(() => import("../pages/dashboard/LecturerDashboard/LecturerDashboard"));
const AddCourse = lazy(() => import("../pages/dashboard/LecturerDashboard/AddCourse"));

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/home" /> },
      { path: "/home", exact: true, element: <HomePage /> },
      { path: "/search", exact: true, element: <SearchPage /> },
      { path: "/admin", exact: true, element: <AdminDashboard /> },
      { path: "/chat/:email", exact: true, element: <ChatPage /> },
      { path: "/login", exact: true, element: <LoginPage /> },
      { path: "/studentTable", exact: true, element: <StudentTable /> },
      { path: "/courseTable", exact: true, element: <CourseTable /> },
      { path: "/add-course", exact: true, element: <AddCourse /> },
      { path: "/register", exact: true, element: <RegistrationPage /> },
      { path: "/dashboard", exact: true, element: <Dashboard /> },
      { path: "/add-pastquestion", exact: true, element: <PastQuestionForm /> },
      { path: "/pastquestion", exact: true, element: <PastQuestions /> },
      { path: "/lecturer-dashboard", exact: true, element: <LecturerDashboard /> },
    ],
  },
];

export default ThemeRoutes;
