import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoggedIn(!!localStorage.getItem("token"));

      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(savedTheme);
    }
  }, [router.pathname]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", next);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(next);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container d-flex justify-content-between">
        <Link className="navbar-brand" href="/">
          Fitness App
        </Link>

        <div className="d-flex align-items-center gap-3">
          {loggedIn && (
            <ul className="navbar-nav me-2">
              <li className="nav-item">
                <Link className="nav-link" href="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/workouts">
                  Workouts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/edit-profile">
                  Edit Profile
                </Link>
              </li>
            </ul>
          )}

          {/* Dark mode toggle */}
          <button
            type="button"
            className="btn btn-sm btn-outline-light theme-toggle-btn"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <ul className="navbar-nav">
            {!loggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
