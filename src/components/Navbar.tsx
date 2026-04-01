import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Siren, Menu, X, LogIn, LogOut, Users, Brain } from "lucide-react";
import { getUser, logoutUser } from "@/lib/auth";

const navLinks = [
  { label: "Emergency", href: "/#emergency-buttons", isHash: true },
  { label: "Map", href: "/#map", isHash: true },
  { label: "Contacts", href: "/contacts", isHash: false },
  { label: "AI Report", href: "/report", isHash: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="section-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Siren className="w-6 h-6 text-primary" />
          <span>EmergencyLocator</span>
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-5">
          {navLinks.map((l) =>
            l.isHash ? (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            )
          )}
          <a href="tel:112" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all">
            Call 112
          </a>
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-xs text-muted-foreground">{user.name}</span>
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-secondary" title="Logout">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline ml-2">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="sm:hidden p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t bg-card px-4 pb-4">
          {navLinks.map((l) =>
            l.isHash ? (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            )
          )}
          <a href="tel:112" className="block mt-2 text-center bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold">
            Call 112
          </a>
          {user ? (
            <button onClick={handleLogout} className="block w-full mt-2 text-center text-sm text-muted-foreground py-2">
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block mt-2 text-center text-primary font-semibold py-2">
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
