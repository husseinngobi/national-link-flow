import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import {
  Car,
  Plane,
  Receipt,
  HeartPulse,
  GraduationCap,
  Building2,
  IdCard,
  FileText,
  Phone,
  Briefcase,
  Baby,
  Scale,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Public Services — NGDXH" },
      {
        name: "description",
        content:
          "Browse and access government services from every Ugandan ministry in one secure place.",
      },
    ],
  }),
});

const CATEGORIES = [
  {
    title: "Identity & Civil Registration",
    icon: IdCard,
    items: [
      "National ID (NIN) application",
      "Birth certificate",
      "Marriage certificate",
      "Death certificate",
    ],
  },
  {
    title: "Travel & Immigration",
    icon: Plane,
    items: ["Passport application & renewal", "Visa enquiries", "Border crossing records"],
  },
  {
    title: "Transport & Permits",
    icon: Car,
    items: ["Driving permit renewal", "Vehicle registration", "Road safety enquiries"],
  },
  {
    title: "Tax & Revenue",
    icon: Receipt,
    items: ["TIN registration", "Tax clearance certificate", "Annual return filing", "VAT status"],
  },
  {
    title: "Health",
    icon: HeartPulse,
    items: ["NHIS insurance status", "Health facility lookup", "Immunisation records"],
  },
  {
    title: "Education",
    icon: GraduationCap,
    items: ["Certificate verification", "Institution accreditation", "Student loan status"],
  },
  {
    title: "Land & Property",
    icon: Building2,
    items: ["Land title verification", "Property registry lookup", "Parcel search"],
  },
  {
    title: "Justice & Legal",
    icon: Scale,
    items: ["Criminal clearance certificate", "Court case status", "Notary registry"],
  },
  {
    title: "Family & Social",
    icon: Baby,
    items: ["Social protection enrolment", "Family welfare programmes", "Dependant registration"],
  },
];

function ServicesPage() {
  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
            Government services
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Every service. One trusted place.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Browse services from all connected ministries. Click any service to learn more, start an
            application or check your status.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="glass rounded-xl p-5 hover:border-gold/40 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-gold/10 text-gold flex items-center justify-center">
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="font-display font-semibold">{c.title}</div>
              </div>
              <ul className="space-y-1.5 text-sm">
                {c.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 glass rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Briefcase className="w-8 h-8 text-gold" />
            <div>
              <div className="font-semibold">Need help choosing a service?</div>
              <div className="text-sm text-muted-foreground">
                Ask our AI assistant or call our toll-free line.
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/assistant"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-1.5"
            >
              Chat with AI <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="tel:0800100000"
              className="px-4 py-2 rounded-md border border-border text-sm hover:bg-accent inline-flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> 0800 100 000
            </a>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
