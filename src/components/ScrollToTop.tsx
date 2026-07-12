import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // When route changes, scroll the main content into view while accounting for fixed header height
    // Small timeout lets the route render before computing offsets.
    const id = setTimeout(() => {
      try {
        const main = document.querySelector("main");
        const header = document.querySelector("header");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        if (main) {
          const top = window.scrollY + (main.getBoundingClientRect().top || 0) - headerHeight - 8;
          window.scrollTo({ top: Math.max(0, Math.round(top)), left: 0, behavior: "auto" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      } catch (e) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }, 40);

    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
