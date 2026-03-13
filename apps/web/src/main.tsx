import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./app/App";
import "./app/globals.css";

// Initialize IndexedDB on app start
import { dbService } from "./services/db.service";
dbService.init().catch(console.error);

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

// ClerkProvider is only mounted when a publishable key is configured (cloud mode).
// In local mode (no key) the app works exactly as before — no auth, no wrapping.
const Root = clerkKey
  ? () => <ClerkProvider publishableKey={clerkKey}><App /></ClerkProvider>
  : () => <App />;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
