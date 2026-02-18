import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Layout/Navbar.jsx";
import { Sidebar } from "./components/Layout/Sidebar.jsx";
import { ProtectedRoute } from "./components/Layout/ProtectedRoute.jsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { TasksPage } from "./pages/TasksPage.jsx";
import { NotesPage } from "./pages/NotesPage.jsx";
import { AnalyticsPage } from "./pages/AnalyticsPage.jsx";
import { FitnessTrackerPage } from "./pages/FitnessTrackerPage.jsx";

const AppShell = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main>
        <Navbar onMenuClick={toggleSidebar} />
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AppShell>
              <TasksPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <AppShell>
              <NotesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fitness"
        element={
          <ProtectedRoute>
            <AppShell>
              <FitnessTrackerPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element>
        <Route
          index
          element={
            <ProtectedRoute>
              <AppShell>
                <AnalyticsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;

