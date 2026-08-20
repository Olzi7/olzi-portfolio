import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";

const root = createRoot(document.getElementById("root")!);

async function boot() {
  if (window.location.pathname === "/") {
    const { default: App } = await import("./App");
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    return;
  }

  const { NotFound } = await import("./components/NotFound");
  root.render(
    <StrictMode>
      <NotFound />
    </StrictMode>,
  );
}

boot();
