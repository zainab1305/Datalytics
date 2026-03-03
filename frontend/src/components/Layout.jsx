import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, Upload, BarChart3, LogOut, Shield, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const navItems = [
  { path: "/dashboard", label: "Home", icon: LayoutDashboard },
  { path: "/uploadFile", label: "Upload", icon: Upload },
  { path: "/visualization", label: "Visualize", icon: BarChart3 },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-72 sidebar-card p-6 flex flex-col justify-between
          transform transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gradient">Datalytics</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200
                    ${isActive
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "text-color-secondary hover:bg-hover-light hover:text-color-primary border border-transparent"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              );
            })}

            {user?.email === "your_admin_email@gmail.com" && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
              >
                <Shield className="w-5 h-5" />
                Admin
              </button>
            )}
          </nav>
        </div>

        <div className="space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-color-secondary hover:bg-hover-light hover:text-color-primary transition-all duration-200"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                Dark Mode
              </>
            )}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-color-secondary hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 glass-effect border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gradient">Datalytics</h1>
          <div className="w-10" />
        </header>

        {children}
      </main>
    </div>
  );
}
