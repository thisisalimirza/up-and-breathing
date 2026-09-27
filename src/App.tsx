import { Component, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Breathe } from "./screens/Breathe";
import { Family } from "./screens/Family";
import { Home } from "./screens/Home";
import { Learn } from "./screens/Learn";
import { LearnArticle } from "./screens/LearnArticle";
import { NotFound } from "./screens/NotFound";
import { OnboardingDay } from "./screens/OnboardingDay";
import { OnboardingSurgery } from "./screens/OnboardingSurgery";
import { Print } from "./screens/Print";
import { Progress } from "./screens/Progress";
import { Safety } from "./screens/Safety";
import { Settings } from "./screens/Settings";
import { Walk } from "./screens/Walk";
import { Welcome } from "./screens/Welcome";
import { Why } from "./screens/Why";
import { StoreProvider } from "./state/store";

type BoundaryState = { failed: boolean };

class Boundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const es = document.documentElement.lang === "es";
    return (
      <div className="app-frame">
        <main className="screen stack">
          <h1>{es ? "La guía tuvo un problema." : "The guide hit a snag."}</h1>
          <p>
            {es
              ? "Recargue la página. Sus notas siguen en este teléfono."
              : "Reload the page. Your notes are still on this phone."}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            {es ? "Recargar" : "Reload"}
          </button>
        </main>
      </div>
    );
  }
}

export function App() {
  return (
    <Boundary>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Welcome />} />
              <Route path="/setup/surgery" element={<OnboardingSurgery />} />
              <Route path="/setup/day" element={<OnboardingDay />} />
              <Route path="/home" element={<Home />} />
              <Route path="/breathe" element={<Breathe />} />
              <Route path="/walk" element={<Walk />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/why" element={<Why />} />
              <Route path="/learn/safety" element={<Safety />} />
              <Route path="/learn/:slug" element={<LearnArticle />} />
              <Route path="/family" element={<Family />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/print" element={<Print />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </Boundary>
  );
}
