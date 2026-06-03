import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext.jsx";

const Navbar = () => {
  const { state, logout } = useApp();
  const navigate = useNavigate();
  const isOfficer = ["admin", "placement_officer"].includes(state.authUser?.role);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="brand">Placement Desk</div>
      <NavLink data-testid="dashboard-link" to="/dashboard">Dashboard</NavLink>
      <NavLink data-testid="students-link" to="/students">Students</NavLink>
      <NavLink data-testid="companies-link" to="/companies">Companies</NavLink>
      <NavLink data-testid="drives-link" to="/drives">Drives</NavLink>
      <NavLink data-testid="applications-link" to="/applications">Applications</NavLink>
      {isOfficer && <NavLink to="/interviews">Interviews</NavLink>}
      <NavLink to="/profile">Profile</NavLink>
      <button data-testid="logout-btn" onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
