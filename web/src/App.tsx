import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home";
import { Redirect } from "./pages/redirect";
import { NotFound } from "./pages/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:shortCode",
    element: <Redirect />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
