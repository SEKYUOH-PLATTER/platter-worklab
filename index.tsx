import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import App from './App';

Sentry.init({
  dsn: "https://f6e9dd8d3b4d88b0b9ee6878576748ef@o4510578825494528.ingest.us.sentry.io/4510578828967936",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });
  (window as any).posthog = posthog;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </PostHogProvider>
  </React.StrictMode>
);
