import { useState } from "react";
import { Siren, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Emergency", href: "#emergency-buttons" },
  { label: "Map", href: "#map" },
  { label: "Contacts", href: "#contacts" },
  { label: "Report", href: "#report" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="section-container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg">
          <Siren className="w-6 h-6 text-primary" />
          <span>EmergencyLocator</span>
        </a>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
          <a href="tel:112" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all">
            Call 112
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="sm:hidden p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t bg-card px-4 pb-4">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
          <a href="tel:112" className="block mt-2 text-center bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold">
            Call 112
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
