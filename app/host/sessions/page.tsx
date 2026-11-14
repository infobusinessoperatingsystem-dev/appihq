import type { Metadata } from "next";
import SessionsClient from "./SessionsClient";

export const metadata: Metadata = {
  title: "Incoming Sessions | Appi Host",
  description: "Review and manage your upcoming and past Appi sessions.",
};

export default function HostSessionsPage() {
  return <SessionsClient />;
}
