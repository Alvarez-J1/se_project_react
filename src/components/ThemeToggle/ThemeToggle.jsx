import "./ThemeToggle.css";

function ThemeToggle({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
    >
      <span className="theme-toggle__icon theme-toggle__icon_sun" aria-hidden="true"></span>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb"></span>
      </span>
      <span className="theme-toggle__icon theme-toggle__icon_moon" aria-hidden="true"></span>
    </button>
  );
}

export default ThemeToggle;
