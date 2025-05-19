import { AppLayout } from "@/pages/_layout/app-layout";
import List from "@/pages/symbole/list";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <List />,
      },
    ],
  },
]);
