import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Plans from "./pages/Plans";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import { GymProvider } from "./contexts/GymContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AccountGate } from "./components/AccountGate";


// Training Ledger routes stay record-first; GitHub Pages receives its repository path as the router base.
const routerBase = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRouter() {
  return (
    <WouterRouter base={routerBase}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/workout/:id"} component={Workout} />
        <Route path={"/plans"} component={Plans} />
        <Route path={"/exercises"} component={Exercises} />
        <Route path={"/history"} component={History} />
        <Route path={"/progress"} component={Progress} />
        <Route path={"/settings"} component={Settings} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AuthProvider>
            <AccountGate>
              <GymProvider>
                <AppRouter />
              </GymProvider>
            </AccountGate>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
