import { createFileRoute } from "@tanstack/react-router";
import { CompanyPortal } from "@/components/company-portal";

export const Route = createFileRoute("/company-page")({
  component: CompanyPortal,
});
