export type Theme = "light" | "dark";
export const THEME_KEY = "abhi-portfolio-theme";
// Runs before paint to restore the saved choice without a light/dark flash.
export const THEME_BOOTSTRAP = `(function(){var theme="light";try{var saved=localStorage.getItem("${THEME_KEY}");if(saved==="dark"||saved==="light")theme=saved;}catch(e){}document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;})();`;
export function applyTheme(theme:Theme) {
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",theme==="dark"?"#121313":"#f4f2ee");
  try{localStorage.setItem(THEME_KEY,theme);}catch{/* The toggle still works when storage is unavailable. */}
}
