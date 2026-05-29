import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Bot, Send, Sparkles, User2, Languages, Mic } from "lucide-react";

export const Route = createFileRoute("/assistant")({ component: Assistant });

type Msg = { role: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "How do I renew my driving permit?",
  "What documents do I need for a passport?",
  "How do I file my annual tax return?",
  "Where is the nearest NIRA office?",
  "How do I register a SIM card?",
  "What is my NHIS insurance status?",
];

// Lightweight rule-based responder (frontend prototype, no backend)
function respond(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("permit") || s.includes("driving"))
    return "**Driving permit renewal** — \n\n1. Visit any URSB-MoWT one-stop centre or use the [MoWT eServices portal](#).\n2. Pay the renewal fee (UGX 130,000 for 3 years) via MTN/Airtel money.\n3. Present your NIN and current permit.\n4. NGDXH will cross-verify with NIRA and UPF criminal clearance automatically — no extra forms.\n\n*Estimated processing time: 30 minutes.*";
  if (s.includes("passport"))
    return "**Passport application** — You'll need:\n\n• Your NIN (validated via NIRA)\n• Recommender form signed by an LC1\n• Birth certificate (auto-fetched from NIRA via NGDXH)\n• UGX 250,000 (ordinary 64-page)\n\nApply online at the DCIC portal. NGDXH automatically pulls your criminal clearance from UPF — no need to queue separately.";
  if (s.includes("tax") || s.includes("ura"))
    return "**Filing your annual return** —\n\n1. Log in to URA portal with your TIN.\n2. NGDXH pre-fills employment income from your employer's PAYE filings.\n3. Add other income, deductions, dependants.\n4. Submit before 30 September.\n\nIf you're employed and have no other income, you may be exempt. Use the URA self-check tool.";
  if (s.includes("nira") || s.includes("office"))
    return "**Nearest NIRA office** — Based on your district, the closest offices are:\n\n• Kampala Central — Kololo, Jinja Road\n• Wakiso — Nansana Town Council\n• Mukono — Mukono District HQ\n\nOpen Mon–Fri, 8:00–17:00. Bring your NIN and one supporting document.";
  if (s.includes("sim"))
    return "**SIM registration** — All SIM cards in Uganda require biometric verification under the UCC SIM Registration Regulations.\n\n1. Visit your operator's service centre (MTN, Airtel, Lycamobile, UTL).\n2. Present your NIN.\n3. Biometric capture (fingerprint).\n4. NGDXH cross-verifies with NIRA in real time. Activation ≤ 5 minutes.";
  if (s.includes("nhis") || s.includes("insurance") || s.includes("health"))
    return "**NHIS insurance status** — You can check your active status at any accredited facility. NGDXH brokers a real-time check between MoH and your employer's contribution records. If you see *Active*, your dependants are covered too.";
  if (s.includes("hello") || s.includes("hi"))
    return "Hello! I'm the NGDXH citizen assistant. I can answer questions about government services in English, Luganda, Runyankole, Acholi and Lusoga. What would you like to know?";
  return `I can help you with anything related to Ugandan government services — passports, permits, taxes, health insurance, education records and more. NGDXH connects me to all authorized ministry systems, so I can give you accurate, real-time guidance.\n\nTry asking about: *driving permits, passports, tax returns, NIRA offices, SIM registration*.`;
}

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hello! I'm the **NGDXH AI Citizen Assistant** — your guide to Ugandan government services. Ask me anything in English, Luganda, Runyankole, Acholi or Lusoga.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        setMessages((m) => [...m, { role: "bot", text: respond(q) }]);
        setTyping(false);
      },
      700 + Math.random() * 600,
    );
  };

  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> AI citizen assistant · multilingual
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Ask. Understand. Get served.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
            A conversational guide to every Ugandan government service — grounded in real ministry
            data through NGDXH. No more queues, no more confusion.
          </p>
        </div>

        <div className="glass rounded-xl flex flex-col h-[640px] overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-primary-foreground">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">NGDXH Assistant</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Online ·
                grounded in 9 ministry APIs
              </div>
            </div>
            <button className="text-xs flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-accent">
              <Languages className="w-3.5 h-3.5" /> EN
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-accent" : "bg-gradient-to-br from-primary to-gold text-primary-foreground"}`}
                >
                  {m.role === "user" ? <User2 className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"}`}
                >
                  {m.text.split("**").map((seg, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className="text-gold">
                        {seg}
                      </strong>
                    ) : (
                      <span key={j}>{seg}</span>
                    ),
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-accent text-muted-foreground">
              <Mic className="w-4 h-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about any government service…"
              className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={() => send(input)}
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 text-sm font-medium"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Prototype assistant · in production, NGDXH grounds responses against live ministry
          knowledge bases under the Data Protection &amp; Privacy Act 2019.
        </div>
      </div>
    </SiteShell>
  );
}
