import { useEffect, useState } from "react";
import { Icon, LogoMark } from "../icons";

export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "why", label: "Why Choose Us" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact Us" },
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
}

export function Brand({ light = true }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-[15px] font-bold tracking-tight ${light ? "text-navy-foreground" : "text-primary"}`}>NEW PRESTIGE</span>
        <span className={`block text-[10px] font-semibold tracking-[0.28em] ${light ? "text-navy-foreground/60" : "text-muted-foreground"}`}>CORPORATION LLP</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const go = (id: string) => { setOpen(false); scrollToId(id); };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy/95 shadow-lift backdrop-blur" : "bg-navy"}`}>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <button onClick={() => go("home")} aria-label="Go to top"><Brand /></button>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className={`relative px-3 py-2 text-[13.5px] font-medium transition-colors ${active === n.id ? "text-navy-foreground" : "text-navy-foreground/65 hover:text-navy-foreground"}`}>
              {n.label}
              <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ${active === n.id ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => go("contact")} className="btn btn-accent btn-sm hidden sm:inline-flex">Enquire Now <Icon name="arrow" className="h-4 w-4" /></button>
          <button className="rounded-lg p-2 text-navy-foreground lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-fade-in border-t border-navy-foreground/10 bg-navy lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-3">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium ${active === n.id ? "bg-navy-foreground/10 text-navy-foreground" : "text-navy-foreground/75"}`}>
                {n.label}{active === n.id && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </button>
            ))}
            <button onClick={() => go("contact")} className="btn btn-accent mt-3">Enquire Now</button>
          </div>
        </nav>
      )}
    </header>
  );
}
