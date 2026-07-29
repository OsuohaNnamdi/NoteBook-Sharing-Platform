import React, { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { baseTheme } from "./assets/global/Theme-variable";
import FullLayout from "./layouts/FullLayout/FullLayout";
import LoadingSpinner from "./components/LoadingSpinner"; // Add a fallback spinner for lazy loading

// Lazy loading all pages
const PastQuestionForm = lazy(() => import("./pages/dashboard/studentDashboard/PastQuestionForm.jsx"));
const PastQuestions = lazy(() => import("./pages/dashboard/studentDashboard/PastQuestions.jsx"));
const SearchPage = lazy(() => import("./pages/StudentShare/SearchPage.jsx"));
const ChatPage = lazy(() => import("./pages/StudentShare/ChatPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const LoginPage = lazy(() => import("./pages/auth/Login.jsx"));
const RegistrationPage = lazy(() => import("./pages/auth/RegistrationPage.jsx"));
const StudentTable = lazy(() => import("./pages/dashboard/studentDashboard/StudentTable.jsx"));
const CourseTable = lazy(() => import("./pages/dashboard/studentDashboard/CourseTable.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.js"));
const Dashboard = lazy(() => import("./pages/dashboard/studentDashboard/Dashboard.jsx"));
const LecturerDashboard = lazy(() => import("./pages/dashboard/LecturerDashboard/LecturerDashboard.jsx"));
const AddCourse = lazy(() => import("./pages/dashboard/LecturerDashboard/AddCourse.jsx"));

const App = () => {
  const routes = [
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

  const routing = useRoutes(routes); // Use routes in place of separate Router.js
  const theme = baseTheme;

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingSpinner />}>
        {routing}
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
