import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from "shaders/react";
import "./index.css";
import App from "./App";

function SiteShaderBackground() {
  return (
    <div className="site-shader-bg" aria-hidden="true">
      <Shader>
        <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
        <ChromaFlow
          baseColor="#ffffff"
          downColor="#ff5f03"
          leftColor="#ff5f03"
          rightColor="#ff5f03"
          upColor="#ff5f03"
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.12}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        />
        <FilmGrain strength={0.05} />
      </Shader>
    </div>
  );
}

function RootShell() {
  return (
    <>
      <SiteShaderBackground />
      <div className="site-app-shell">
        <App />
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootShell />
  </StrictMode>
);
