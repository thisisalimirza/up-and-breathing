import { Link, Outlet, useLocation } from "react-router-dom";
import { useCopy, useStore } from "../state/store";
import { BottomNav } from "./BottomNav";
import { LanguageToggle } from "./LanguageToggle";
import { Mark } from "./Icons";

export function AppShell() {
  const { pathname } = useLocation();
  const { profile } = useStore();
  const copy = useCopy();
  const isPrint = pathname === "/print";
  const isSetup = pathname === "/" || pathname.startsWith("/setup");
  const showNav = !isPrint && !isSetup;

  return (
    <div className={`app-frame${showNav ? " has-nav" : ""}${isPrint ? " is-print" : ""}`}>
      <a className="skip" href="#main">
        {copy.skip}
      </a>
      <header className="topbar">
        <Link className="brand" to={profile ? "/home" : "/"}>
          <Mark />
          <span>{copy.appName}</span>
        </Link>
        <div className="top-actions">
          <LanguageToggle />
          {showNav && pathname !== "/settings" ? (
            <Link className="text-btn" to="/settings">
              {copy.settings.title}
            </Link>
          ) : null}
        </div>
      </header>
      <p className="landscape-note">{copy.landscape}</p>
      <main id="main" tabIndex={-1} className="screen">
        <Outlet />
      </main>
      {isPrint ? null : (
        <footer className="dock">
          <p className="disclaimer">{copy.disclaimer}</p>
          {showNav ? <BottomNav /> : null}
        </footer>
      )}
    </div>
  );
}
