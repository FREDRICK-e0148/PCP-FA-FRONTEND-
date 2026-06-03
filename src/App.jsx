import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "./state/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Companies from "./pages/Companies.jsx";
import Drives from "./pages/Drives.jsx";
import Applications from "./pages/Applications.jsx";
import Interviews from "./pages/Interviews.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
  const { state, loadAll } = useApp();

  useEffect(() => {
    loadAll();
  }, [state.token]);

  return (
    <div>
      {state.authUser && <Navbar />}
      {state.notice && <div className="notice">{state.notice}</div>}
      <main className="shell">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to={state.authUser ? "/dashboard" : "/login"} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
          <Route path="/drives" element={<ProtectedRoute><Drives /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/interviews" element={<ProtectedRoute roles={["admin", "placement_officer"]}><Interviews /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
