import { NavLink } from "react-router-dom";
import { useCopy } from "../state/store";
import { IconBook, IconBreath, IconHome, IconProgress, IconWalk } from "./Icons";

const items = [
  { to: "/home", key: "home", icon: IconHome },
  { to: "/breathe", key: "breathe", icon: IconBreath },
  { to: "/walk", key: "walk", icon: IconWalk },
  { to: "/learn", key: "learn", icon: IconBook },
  { to: "/progress", key: "progress", icon: IconProgress },
] as const;

export function BottomNav() {
  const copy = useCopy();
  return (
    <nav className="bottom-nav" aria-label={copy.nav.label}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}>
            <Icon />
            <span>{copy.nav[item.key]}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
