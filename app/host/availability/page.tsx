import type { Metadata } from "next";
import AvailabilityClient from "./AvailabilityClient";

export const metadata: Metadata = {
  title: "Availability & Settings | Appi Host",
  description: "Manage your Appi session settings and weekly availability.",
};

export default function HostAvailabilityPage() {
  return <AvailabilityClient />;
}
