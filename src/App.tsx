import React from "react";
import "./App.css";
import { useAuth } from "context/auth-context";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import { FullPageLoading } from "components/lib";

const AuthenticatedApp = React.lazy(() => import("authenticated-app"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"));
function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundary>
        <React.Suspense fallback={<FullPageLoading />}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
