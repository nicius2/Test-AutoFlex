import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Theme } from "@radix-ui/themes";

export function App() {
  return (
    <Theme accentColor="indigo" grayColor="slate" radius="medium" scaling="100%">
      <RouterProvider router={router} />
    </Theme>
  )
}