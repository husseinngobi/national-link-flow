import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Phone, Mail, MapPin, MessageCircle, HelpCircle, ChevronRight, Bot } from "lucide-react";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Help Center — NGDXH" },
      { name: "description", content: "Get help with government services. FAQs, contact information and support channels." },
    ],
  }),
});

const FAQS = [
  { q: "How do I verify a document?", a: "Use the Verify Status page and enter your reference number. Results are returned in seconds." },
  { q: "Is my data safe with NGDXH?", a: "Yes. NGDXH does not store your records — it brokers authorized exchanges between ministries. Every transaction is encrypted and audited." },
  { q: "What languages does the AI Assistant speak?", a: "English, Luganda, Runyankole, Acholi and Lusoga." },
  { q: "I lost my reference number — what now?", a: "Sign in to the Citizen Portal to see all your past applications, or contact the issuing ministry directly." },
  { q: "How do I report fraud or misuse?", a: "Email gdr@ict.go.ug or call the toll-free line 0800 100 000. All reports are confidential." },
  { q: "Why was a service request denied?", a: "Each ministry has its own rules. Open the request from your Citizen Portal to see the specific reason." },
];

const CENTRES = [
  { city: "Kampala (HQ)", addr: "Plot 7, Lumumba Avenue, Nakasero", hours: "Mon–Fri · 8:00–17:00" },
  { city: "Mbarara", addr: "High Street, Mbarara Municipality", hours: "Mon–Fri · 8:00–17:00" },
  { city: "Gulu", addr: "Coronation Road, Gulu City", hours: "Mon–Fri · 8:00–17:00" },
  { city: "Mbale", addr: "Republic Street, Mbale City", hours: "Mon–Fri · 8:00–17:00" },
];

function HelpPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Help center</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">We're here to help.</h1>
          <p className="mt-3 text-muted-foreground">
            Get answers to common questions, find a service centre near you, or talk to a human.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="glass rounded-xl p-5">
            <Phone className="w-5 h-5 text-gold mb-3" />
            <div className="font-semibold">Toll-free phone</div>
            <a href="tel:0800100000" className="text-primary hover:underline text-sm">0800 100 000</a>
            <div className="text-xs text-muted-foreground mt-1">24 hours · 7 days</div>
          </div>
          <div className="glass rounded-xl p-5">
            <Mail className="w-5 h-5 text-gold mb-3" />
            <div className="font-semibold">Email support</div>
            <a href="mailto:support@ngdxh.go.ug" className="text-primary hover:underline text-sm">support@ngdxh.go.ug</a>
            <div className="text-xs text-muted-foreground mt-1">Reply within 1 business day</div>
          </div>
          <Link to="/assistant" className="glass rounded-xl p-5 hover:border-gold/40 transition">
            <Bot className="w-5 h-5 text-gold mb-3" />
            <div className="font-semibold">AI Assistant</div>
            <div className="text-primary text-sm">Chat now</div>
            <div className="text-xs text-muted-foreground mt-1">Available in 5 languages</div>
          </Link>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-gold" />
            <h2 className="text-xl font-display font-bold">Frequently asked questions</h2>
          </div>
          <div className="glass rounded-xl divide-y divide-border/60">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium">{f.q}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Service centres */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gold" />
            <h2 className="text-xl font-display font-bold">Service centres near you</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {CENTRES.map((c) => (
              <div key={c.city} className="glass rounded-lg p-4">
                <div className="font-semibold">{c.city}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.addr}</div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  <MessageCircle className="w-3 h-3" /> {c.hours}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
