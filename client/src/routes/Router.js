import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PastQuestionForm from "../pages/dashboard/studentDashboard/PastQuestionForm.jsx";
import PastQuestions from "../pages/dashboard/studentDashboard/PastQuestions.jsx";
import SearchPage from "../pages/StudentShare/SearchPage.jsx";
import ChatPage from "../pages/StudentShare/ChatPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/auth/Login.jsx";
import RegistrationPage from "../pages/auth/RegistrationPage.jsx";
import StudentTable from "../pages/dashboard/studentDashboard/StudentTable.jsx";
import CourseTable from "../pages/dashboard/studentDashboard/CourseTable.jsx";


const AdminDashboard = lazy(() => import("../pages/dashboard/studentDashboard/AdminDashboard.jsx"));
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
const Dashboard = lazy(() => import("../pages/dashboard/studentDashboard/Dashboard.jsx"));
const LecturerDashboard = lazy(() => import("../pages/dashboard/LecturerDashboard/LecturerDashboard.jsx"));
const AddCourse = lazy(() => import("../pages/dashboard/LecturerDashboard/AddCourse.jsx"));


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
