import { Outlet, Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      {/* your sidebar/nav */}
      <nav>
        <Link to="/admin/users">Users</Link>
      </nav>

      {/* child routes render here */}
      <Outlet />
    </div>
  );
}