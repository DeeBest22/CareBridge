import { createFileRoute } from "@tanstack/react-router";
import heroAsset from "../assets/careBridge-hero.png";
import networkAsset from "../assets/careBridge-network-v2.png";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareBridge - Connecting Healthcare, Improving Lives" },
      {
        name: "description",
        content:
          "CareBridge connects patients, hospitals, labs, pharmacies, doctors and insurers on one secure digital health platform across Nigeria and Africa.",
      },
      { property: "og:title", content: "CareBridge — Connecting Healthcare, Improving Lives" },
      {
        property: "og:description",
        content:
          "One secure health profile: medical history, test results, prescriptions, appointments and online consultations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = ["Find care", "Success", "For providers", "Pricing"];

const comparisonColumns = [
  {
    name: "Paper & phone calls",
    big: "Manual",
    detail: "Charts, phone calls and faxes",
    highlighted: false,
  },
  {
    name: "Single hospital EMR",
    big: "Single-site",
    detail: "One hospital's own system",
    highlighted: false,
  },
  {
    name: "CareBridge",
    big: "Connected",
    detail: "Every provider, one profile",
    highlighted: true,
    badge: "Most connected",
    cta: "Get started",
  },
] as const;

const comparisonRows = [
  { label: "Health records accessible everywhere you're treated", a: false, b: false, c: true },
  { label: "Test results updated in real time", a: false, b: true, c: true },
  { label: "Book appointments & consultations online", a: false, b: true, c: true },
  { label: "Prescriptions shared digitally", a: false, b: true, c: true },
  { label: "Works across hospitals, labs & pharmacies", a: false, b: false, c: true },
  { label: "You control who can access your records", a: false, b: false, c: true },
  { label: "Available on your phone", a: false, b: false, c: true },
];

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-8 lg:px-12">
        <a href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-brand-blue">Care</span>
          <span className="text-brand-teal">Bridge</span>
          <span className="text-brand-blue">.</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item, i) => (
            <a
              key={item}
              href="#"
              className={
                i === 0
                  ? "text-[15px] font-semibold text-foreground"
                  : "text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="/get-started"
          className="rounded-full border border-border px-7 py-3 text-[15px] font-semibold text-foreground shadow-[0_10px_30px_-18px_oklch(0.26_0.06_255/0.6)] transition-colors hover:bg-secondary"
        >
          Get started
        </a>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 pb-16 lg:grid-cols-2 lg:gap-6 lg:px-12 lg:pb-24 lg:pt-16">
          <div>
            <p className="text-[15px] font-medium text-muted-foreground">
              Connected healthcare for Africa
            </p>
            <h1 className="mt-4 text-[3.25rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-foreground lg:text-[4.1rem]">
              One health
              <br />
              record for every
              <br />
              patient<span className="text-brand-teal">.</span>
            </h1>
            <p className="mt-8 max-w-md text-[16.5px] leading-relaxed text-muted-foreground">
              CareBridge links patients, hospitals, labs, pharmacies and insurers on one secure
              platform. Records, results and prescriptions always in one place.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/get-started"
                className="rounded-full bg-primary px-9 py-4 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
              </a>
              <a
                href="#"
                className="rounded-full border border-border bg-background px-9 py-4 text-[15px] font-semibold text-foreground shadow-[0_12px_30px_-20px_oklch(0.26_0.06_255/0.7)] transition-colors hover:bg-secondary"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroAsset}
              alt="Doctor reviewing a patient's digital health record on a tablet"
              className="w-full"
              width={1134}
              height={1382}
            />
          </div>
        </section>

        <CareLinkAssistant />

        <section className="border-t border-border">
          <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-28">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-secondary/40 p-8 sm:p-10 lg:p-14">
                <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-3.5 py-1.5 text-[13px] font-semibold text-brand-blue">
                  For patients
                </span>
                <h3 className="mt-6 font-display text-[1.875rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-foreground lg:text-[2.25rem]">
                  Your whole health story, always with you.
                </h3>
                <p className="mt-5 text-[15.5px] leading-relaxed text-muted-foreground">
                  See your medical history, test results, prescriptions and appointments in one
                  place, and choose exactly which providers can access them.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "One profile for every hospital, lab and pharmacy visit",
                    "Appointments and consultations booked in a few taps",
                    "Lab results delivered the moment they're ready",
                    "Full control over who sees your records",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] bg-[oklch(0.22_0.05_255)] p-8 sm:p-10 lg:p-14">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-brand-teal">
                  For providers
                </span>
                <h3 className="mt-6 font-display text-[1.875rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-white lg:text-[2.25rem]">
                  Everything your practice needs, in one place.
                </h3>
                <p className="mt-5 text-[15.5px] leading-relaxed text-white/70">
                  Manage patients, create digital records, issue prescriptions and run
                  consultations, without switching between five different systems.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "Digital records for every patient you see",
                    "Prescriptions and lab results uploaded in seconds",
                    "Appointments and online consultations in one calendar",
                    "Patient history available the moment it's needed, with permission",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-white/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-teal text-[oklch(0.22_0.05_255)]">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="grid lg:grid-cols-2">
            <div className="flex h-[360px] items-center justify-center bg-background p-10 sm:h-[480px] sm:p-14 lg:h-auto lg:min-h-[600px] lg:p-16">
              <img
                src={networkAsset}
                alt="Icons for hospitals, doctors, laboratories, pharmacies and prescriptions arranged around a central heartbeat symbol"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex items-center bg-secondary/30 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-20">
              <div className="max-w-xl">
                <span className="mb-6 block h-[3px] w-9 rounded-full bg-gradient-to-r from-brand-blue to-brand-teal" />
                <p className="text-[15px] font-medium text-muted-foreground">
                  The problem CareBridge solves
                </p>
                <h2 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground lg:text-[2.75rem]">
                  One record.
                  <br />
                  Every provider, <span className="text-brand-teal">connected.</span>
                </h2>
                <p className="mt-6 text-[16.5px] leading-relaxed text-muted-foreground">
                  Right now, a hospital visit, a lab result and a pharmacy pickup each live in a
                  different system. CareBridge brings them into one secure profile, so any provider
                  you approve can see your full history in seconds, not days.
                </p>

                <ul className="mt-9 space-y-4">
                  {[
                    { lead: "Records", rest: "created once, visible everywhere you allow." },
                    { lead: "Consultations", rest: "booked with any connected hospital or clinic." },
                    { lead: "Prescriptions and results", rest: "delivered straight to your profile." },
                  ].map((item) => (
                    <li key={item.lead} className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-teal text-white">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="leading-snug">
                        <span className="font-semibold">{item.lead}</span> {item.rest}
                      </span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-28">
          <div className="max-w-xl">
            <p className="text-[15px] font-medium text-muted-foreground">Why CareBridge</p>
            <h2 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground lg:text-[2.75rem]">
              The old way, and the CareBridge way.
            </h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-muted-foreground">
              Paper charts and single-hospital systems can't talk to each other. CareBridge
              connects every provider you see to one secure profile, wherever you're treated.
            </p>
          </div>

          <div className="mt-12 hidden overflow-hidden rounded-[2rem] border border-border md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">
                  Comparison of paper records, a single hospital EMR, and CareBridge
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[38%] bg-background px-6 py-8 align-bottom">
                      <span className="text-[13px] font-medium text-muted-foreground">
                        How records work today
                      </span>
                    </th>
                    {comparisonColumns.map((col) => (
                      <th
                        key={col.name}
                        scope="col"
                        className={`border-l border-border px-6 py-8 align-bottom font-normal ${
                          col.highlighted ? "bg-brand-blue/5" : "bg-background"
                        }`}
                      >
                        <div className="flex flex-col items-start gap-3">
                          {"badge" in col ? (
                            <span className="inline-flex items-center rounded-full bg-brand-blue px-3 py-1 text-[12px] font-semibold text-white">
                              {col.badge}
                            </span>
                          ) : (
                            <span className="h-[26px]" aria-hidden="true" />
                          )}
                          <p
                            className={`text-[15px] font-semibold ${
                              col.highlighted ? "text-brand-blue" : "text-foreground"
                            }`}
                          >
                            {col.name}
                          </p>
                          <div>
                            <p className="text-[1.9rem] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                              {col.big}
                            </p>
                            <p className="mt-1.5 text-[13px] text-muted-foreground">
                              {col.detail}
                            </p>
                          </div>
                          {"cta" in col && (
                            <a
                              href="/get-started"
                              className="mt-2 w-full rounded-full bg-primary px-5 py-2.5 text-center text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                            >
                              {col.cta}
                            </a>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-t border-border">
                      <th
                        scope="row"
                        className="px-6 py-4 text-left text-[14.5px] font-normal text-muted-foreground"
                      >
                        {row.label}
                      </th>
                      {[row.a, row.b, row.c].map((included, i) => (
                        <td
                          key={i}
                          className={`border-l border-border px-6 py-4 text-center ${
                            comparisonColumns[i].highlighted ? "bg-brand-blue/5" : ""
                          }`}
                        >
                          {included ? (
                            <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-white">
                              <svg
                                className="h-3 w-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <svg
                              className="mx-auto h-3.5 w-3.5 text-muted-foreground/40"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:hidden">
            {comparisonColumns.map((col, i) => (
              <div
                key={col.name}
                className={`rounded-[1.75rem] border p-6 ${
                  col.highlighted
                    ? "border-brand-blue/30 bg-brand-blue/5"
                    : "border-border bg-background"
                }`}
              >
                {"badge" in col ? (
                  <span className="inline-flex items-center rounded-full bg-brand-blue px-3 py-1 text-[12px] font-semibold text-white">
                    {col.badge}
                  </span>
                ) : null}
                <p
                  className={`mt-3 text-[15px] font-semibold ${
                    col.highlighted ? "text-brand-blue" : "text-foreground"
                  }`}
                >
                  {col.name}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-[1.6rem] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                    {col.big}
                  </p>
                  <p className="text-[13px] text-muted-foreground">{col.detail}</p>
                </div>
                {"cta" in col && (
                  <a
                    href="/get-started"
                    className="mt-4 block w-full rounded-full bg-primary px-5 py-2.5 text-center text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {col.cta}
                  </a>
                )}

                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {comparisonRows.map((row) => {
                    const included = [row.a, row.b, row.c][i];
                    return (
                      <li
                        key={row.label}
                        className="flex items-start gap-3 text-[14px] leading-snug text-foreground"
                      >
                        {included ? (
                          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                            <svg
                              className="h-2.5 w-2.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <svg
                            className="mt-1.5 h-3 w-3 shrink-0 text-muted-foreground/40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        )}
                        <span className={included ? "" : "text-muted-foreground"}>
                          {row.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-5">
              <a href="/" className="inline-block text-2xl font-extrabold tracking-tight">
                <span className="text-brand-blue">Care</span>
                <span className="text-brand-teal">Link</span>
                <span className="text-brand-blue">.</span>
              </a>
              <p className="max-w-[16rem] text-[15px] leading-relaxed text-muted-foreground">
                One secure platform connecting patients, providers and insurers across Africa.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Twitter"
                  className="text-muted-foreground transition-colors hover:text-brand-blue"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-muted-foreground transition-colors hover:text-brand-blue"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="text-muted-foreground transition-colors hover:text-brand-blue"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-foreground">For patients</h3>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Find a doctor</a></li>
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Book appointments</a></li>
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">View health records</a></li>
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Track prescriptions</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-foreground">For providers</h3>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Hospital portal</a></li>
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Lab integration</a></li>
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Pharmacy network</a></li>
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Insurance claims</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-foreground">Stay updated</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Get the latest on healthcare innovation in Africa.
              </p>
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-[14px] text-muted-foreground md:flex-row">
            <p>&copy; {new Date().getFullYear()} CareBridge. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-foreground">Terms of Service</a>
              <a href="#" className="transition-colors hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
function CareLinkAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setAnswer(null);
    setError(null);
    try {
      const response = await fetch("/api/carelink-assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "The CareLink assistant is unavailable.");
      setAnswer(payload.answer ?? "");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The CareLink assistant is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && <button aria-label="Close CareLink assistant" className="fixed inset-0 z-40 cursor-default bg-overlay/20 backdrop-blur-[2px]" onClick={() => setOpen(false)} />}

      {open && (
        <section role="dialog" aria-modal="true" aria-labelledby="carelink-chat-title" className="fixed inset-x-3 bottom-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_80px_-30px_oklch(0.18_0.05_255/0.65)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(440px,calc(100vw-3rem))]">
          <header className="flex shrink-0 items-center justify-between border-b border-border bg-primary px-4 py-3.5 text-primary-foreground sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15"><Sparkles className="size-4" /></div>
              <div className="min-w-0"><h2 id="carelink-chat-title" className="truncate text-sm font-bold">CareLink assistant</h2><p className="text-[11px] text-primary-foreground/75">General health guidance</p></div>
            </div>
            <button type="button" aria-label="Close chat" title="Close chat" className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-white/15" onClick={() => setOpen(false)}><X className="size-4" /></button>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-secondary/60 px-3.5 py-3 text-sm leading-relaxed text-foreground">
              Hi, I can help you prepare for a visit, understand care options, or find the right questions to ask a clinician. What would you like to know?
            </div>
            {question && answer && <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-primary/10 px-3.5 py-3 text-sm leading-relaxed text-foreground">{question}</div>}
            {loading && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin" /> CareLink is thinking...</div>}
            {answer && <div className="max-w-[95%] rounded-2xl rounded-tl-sm border border-border bg-card px-3.5 py-3 text-sm leading-relaxed text-foreground"><p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">CareLink</p><div>{formatAssistantAnswer(answer)}</div></div>}
            {error && <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
          </div>

          <form onSubmit={ask} className="shrink-0 border-t border-border bg-background p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20">
              <textarea
                id="carelink-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a health question..."
                aria-label="Ask CareLink a question"
                className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
                maxLength={1000}
                rows={1}
              />
              <button type="submit" aria-label="Send question" title="Send question" disabled={loading || question.trim().length < 3} className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
            <p className="mt-2 px-1 text-[10px] leading-relaxed text-muted-foreground">General guidance only. Do not share sensitive medical information or use this for emergencies.</p>
          </form>
        </section>
      )}

      {!open && <button type="button" aria-label="Open CareLink assistant" title="Open CareLink assistant" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_14px_35px_-12px_oklch(0.24_0.08_255/0.8)] transition-transform hover:-translate-y-0.5 hover:opacity-95 sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5">
        <MessageCircle className="size-5" />
        <span>Ask CareLink</span>
      </button>}
    </>
  );
}

function formatAssistantAnswer(answer: string): ReactNode {
  return answer.split(/\r?\n/).map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={`space-${index}`} className="h-2" aria-hidden="true" />;

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const content = bullet ? bullet[1] : trimmed;
    const formatted = content.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${index}-${partIndex}`}>{part.slice(2, -2)}</strong>;
      }
      return <span key={`${index}-${partIndex}`}>{part}</span>;
    });

    return bullet ? (
      <div key={`line-${index}`} className="flex gap-2">
        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        <span>{formatted}</span>
      </div>
    ) : (
      <p key={`line-${index}`}>{formatted}</p>
    );
  });
}
