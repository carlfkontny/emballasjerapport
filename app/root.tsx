import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/react-router";
import { prisma } from "./prisma";
import { Dropdown } from "./components/Dropdown";
export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args, async ({ request }) => {
    const { sessionClaims } = request.auth;
    const email = sessionClaims?.email as string;

    if (email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: { email },
        });
      }
    }

    return { yourData: "here" };
  });
}

export const links: Route.LinksFunction = () => [
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider
      loaderData={loaderData}
      signUpFallbackRedirectUrl="/"
      signInFallbackRedirectUrl="/"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <SignedOut>
          <div className="flex items-center justify-center py-2 px-4 h-screen">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-slate-200/10">
            <div className="mx-auto max-w-7xl p-6 pt-8 lg:p-8 lg:pt-10 flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-400 bg-clip-text text-transparent">
                Plastmåleren
              </h1>
              <div className="flex items-center gap-4">
                <Dropdown />
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </SignedIn>
      </div>
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
