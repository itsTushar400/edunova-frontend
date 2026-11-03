import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout">

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="admin-layout-main">

        <header className="admin-mobile-header">

          <button
            className="admin-hamburger"
            onClick={() => setMobileOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="mobile-brand">

            <div className="mobile-brand-logo">
              E
            </div>

            <div>
              <strong>EduNova</strong>
              <small>ADMIN PANEL</small>
            </div>

          </div>

        </header>

        <div className="admin-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;