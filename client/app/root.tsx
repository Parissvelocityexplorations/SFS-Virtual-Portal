import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import "./styles/theme.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning className="bg-gray-50">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Function to remove Grammarly elements that cause hydration errors
              const removeElements = () => {
                // Remove grammarly elements
                const grammarlyElements = document.querySelectorAll('grammarly-desktop-integration');
                if(grammarlyElements.length > 0) {
                  grammarlyElements.forEach(e => e.remove());
                }
              };
              
              // Run immediately
              removeElements();
              
              // Also run after DOM is fully loaded
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', removeElements);
              }
              
              // And after everything is loaded (images, styles, etc.)
              window.addEventListener('load', removeElements);
              
              // Set up a MutationObserver to catch dynamically added elements
              const observer = new MutationObserver(function(mutations) {
                removeElements();
              });
              
              // Start observing once the DOM is ready
              if (document.body) {
                observer.observe(document.body, { 
                  childList: true, 
                  subtree: true 
                });
              } else {
                document.addEventListener('DOMContentLoaded', function() {
                  observer.observe(document.body, { 
                    childList: true, 
                    subtree: true 
                  });
                });
              }
            })();
          `
        }} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
