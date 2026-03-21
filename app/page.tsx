import Link from "next/link";
import { SiteHeader } from "@/components/landing/site-header";

const whyChooseItems = [
  {
    title: "Smart loan discovery",
    text: "Compare loan options from multiple banks and financial institutions to find the best interest rates and repayment terms tailored to your needs.",
  },
  {
    title: "Simplified application process",
    text: "Upload documents once and apply to multiple lenders with a single streamlined process.",
  },
  {
    title: "Loan tracking dashboard",
    text: "Track the complete lifecycle of your loan application from document submission to approval and disbursal.",
  },
  {
    title: "EMI & repayment optimization",
    text: "Understand your EMI commitments, prepayment opportunities, and strategies to reduce interest over time.",
  },
  {
    title: "Expert financial guidance",
    text: "Get insights and advisory support to restructure loans, improve eligibility, and plan your finances better.",
  },
];

const solutions = [
  {
    title: "Home loans",
    description:
      "Find the most suitable home loan with competitive interest rates and flexible repayment options.",
    points: [
      "Compare multiple lenders",
      "Eligibility assessment",
      "Document support",
      "EMI planning tools",
    ],
  },
  {
    title: "Business loans",
    description: "Fuel your business growth with the right financing solutions.",
    points: [
      "Working capital loans",
      "MSME financing",
      "Expansion funding",
      "Loan restructuring advice",
    ],
  },
  {
    title: "Loan management",
    description: "Stay in control of all your loans from a single dashboard.",
    points: [
      "EMI reminders",
      "Repayment schedules",
      "Prepayment impact analysis",
      "Financial insights",
    ],
  },
];

const howItWorksSteps = [
  {
    title: "Create your profile",
    text: "Sign up and securely upload your financial and personal details.",
  },
  {
    title: "Discover loan options",
    text: "Our platform matches you with loan options that suit your eligibility and requirements.",
  },
  {
    title: "Apply & submit documents",
    text: "Upload required documents and submit your loan application digitally.",
  },
  {
    title: "Track your application",
    text: "Monitor your loan progress in real-time from submission to approval.",
  },
  {
    title: "Manage your loan smartly",
    text: "Use our tools to track EMIs, explore refinancing options, and optimise your repayment strategy.",
  },
];

const customerSegments = [
  {
    title: "Home buyers",
    text: "First-time or experienced home buyers looking for competitive loan options.",
  },
  {
    title: "Entrepreneurs & businesses",
    text: "Businesses seeking growth capital or better financing structures.",
  },
  {
    title: "Existing borrowers",
    text: "Individuals who want to refinance or optimize their current loan repayments.",
  },
];

const sectionClass =
  "scroll-mt-24 border-t border-slate-200/80 first:border-t-0 first:pt-0 pt-16 sm:pt-20";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main>
        {/* About — hero */}
        <section
          id="about"
          className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-sky-50/80 via-white to-slate-50 scroll-mt-24"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.15),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-800/90">
              Smarter loans. Better decisions.
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The smart way to find and manage loans
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
              From home loans to business financing, CrediWise helps you compare, apply, and manage
              your loans in one place—with clarity at every step.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
              Whether you are buying your first home, expanding your business, or restructuring an
              existing loan, we give you the tools and guidance to stay financially confident.
            </p>
            <p className="mt-6 text-sm font-semibold tracking-wide text-slate-800">
              Compare · Apply · Manage · Optimise
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Get started
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-sky-800 underline-offset-4 hover:underline sm:ml-2"
              >
                See how it works
              </a>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-slate-900">Built for clarity</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Technology and expertise working together so you can choose financing without
                  guesswork.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-slate-900">Security &amp; trust</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Your data is protected with strong security practices and handled only as you
                  authorise.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <h2 className="text-sm font-semibold text-slate-900">Who we serve</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Home buyers, businesses, and existing borrowers who want better visibility and
                  control.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          {/* Why CrediWise */}
          <section id="why-crediwise" className={sectionClass} aria-labelledby="why-heading">
            <h2
              id="why-heading"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Why CrediWise
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Everything you need to move from comparison to disbursement—with less friction.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {whyChooseItems.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200/80 hover:shadow-md"
                >
                  <div className="mb-3 h-1 w-10 rounded-full bg-sky-500/90 transition group-hover:w-14" />
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className={sectionClass} aria-labelledby="how-heading">
            <h2
              id="how-heading"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              How it works
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Five clear steps from profile to ongoing loan management.
            </p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {howItWorksSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-900">
                    {index + 1}
                  </span>
                  <h3 className="pr-10 text-sm font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Services */}
          <section id="services" className={sectionClass} aria-labelledby="services-heading">
            <h2
              id="services-heading"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Services
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Purpose-built offerings for every stage of your borrowing journey.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {solutions.map((solution) => (
                <article
                  key={solution.title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{solution.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{solution.description}</p>
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                    {solution.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <h3 className="mt-14 text-xl font-semibold text-slate-900">Who we serve</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {customerSegments.map((group) => (
                <article
                  key={group.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6"
                >
                  <h4 className="font-semibold text-slate-900">{group.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{group.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Contact — placeholder */}
          <section id="contact" className={sectionClass} aria-labelledby="contact-heading">
            <h2
              id="contact-heading"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Contact
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              We&apos;re preparing dedicated contact options. Check back soon for phone, email, and
              office details.
            </p>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
              <p className="text-sm font-medium text-slate-500">Contact form &amp; details</p>
              <p className="mt-2 text-base text-slate-700">Coming soon</p>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="mb-16 mt-4 overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-center shadow-xl sm:px-10 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to take the next step?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Create an account to explore your dashboard, or sign in to continue your application.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex w-full min-w-[160px] items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto"
              >
                Sign up
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex w-full min-w-[160px] items-center justify-center rounded-xl border border-slate-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p className="text-sm font-semibold text-slate-900">CrediWise</p>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} CrediWise. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="#about" className="text-slate-600 hover:text-slate-900">
              About
            </a>
            <a href="#contact" className="text-slate-600 hover:text-slate-900">
              Contact
            </a>
            <Link href="/auth/sign-in" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
