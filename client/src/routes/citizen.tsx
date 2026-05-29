import { createFileRoute } from "@tanstack/react-router";
import { CitizenPortal } from "@/components/citizen-portal";

export const Route = createFileRoute("/citizen")({ component: CitizenPortal });
