import type { Route } from "./+types/home";
import { Dashboard } from "../dashboard/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Terra" },
    { name: "description", content: "Welcome to Terra!" },
  ];
}

export default function Home() {
  return <Dashboard />;
}
