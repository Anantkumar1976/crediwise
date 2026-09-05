import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/landing/brand-logo";
import { ContactForm } from "@/components/landing/contact-form";

const services = [
  {
    title: "Home loans",
    description:
      "Find a suitable home loan with competitive rates and flexible repayment options.",
    href: "/auth/sign-up",
    cta: "Explore home loans",
    icon: "home",
  },
  {
    title: "Car loans",
    description: "Compare offers and move forward with a loan that fits your vehicle plans.",
    href: "/auth/sign-up",
    cta: "Explore car loans",
    icon: "car",
  },
  {
    title: "Personal loans",
    description: "Support education, healthcare, travel, weddings, and other life goals.",
    href: "/auth/sign-up",
    cta: "Explore personal loans",
    icon: "personal",
  },
  {
    title: "Business loans",
    description: "Working capital, MSME financing, and growth funding in one place.",
    href: "/auth/sign-up",
    cta: "Explore business loans",
    icon: "business",
  },
] as const;

const howItWorks = [
  {
    title: "Compare",
    text: "Explore multiple loan options.",
    icon: "/images/crediwise/compare-search.svg",
    accent: "bg-[#00A88E]",
  },
  {
    title: "Apply",
    text: "Submit a simple application.",
    icon: "/images/crediwise/apply-document.svg",
    accent: "bg-[#2F80ED]",
  },
  {
    title: "Track",
    text: "Check your application status in real time.",
    icon: "/images/crediwise/track-status.svg",
    accent: "bg-[#6C63FF]",
  },
  {
    title: "Get Approved",
    text: "Receive approval and move forward.",
    icon: "/images/crediwise/approved-thumb.svg",
    accent: "bg-[#F2994A]",
  },
] as const;

const whyChoose = [
  {
    title: "Multiple Lenders",
    text: "Compare options from multiple lending partners.",
    icon: "/images/crediwise/multiple-lenders.svg",
  },
  {
    title: "Transparent Comparison",
    text: "Understand rates and options clearly.",
    icon: "/images/crediwise/transparent-comparison.svg",
  },
  {
    title: "Faster Approvals",
    text: "A simpler process designed to move quickly.",
    icon: "/images/crediwise/faster-approvals.svg",
  },
  {
    title: "Expert Guidance",
    text: "Get help when you need it.",
    icon: "/images/crediwise/expert-guidance.svg",
  },
  {
    title: "Secure & Reliable",
    text: "Your information and application journey are handled securely.",
    icon: "/images/crediwise/secure-reliable.svg",
  },
] as const;

function ServiceIcon({ name }: { name: (typeof services)[number]["icon"] }) {
  const common = "h-6 w-6";
  if (name === "home") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "car") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 14h16l-1.4-5.2A2 2 0 0 0 16.7 7H7.3a2 2 0 0 0-1.9 1.8L4 14Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="7.5" cy="16.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (name === "personal") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5 19c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V7l8-3 8 3v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function HomeContent() {
  return (
    <>
      <div className="mx-auto max-w-6xl overflow-x-clip px-4 sm:px-6 lg:px-10">
        <section id="services" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="services-heading">
          <h2
            id="services-heading"
            className="text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl"
          >
            Loan options for every goal
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-[#3D4F63]">
            Purpose-built offerings for home, vehicle, personal, and business needs.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F7F4] text-[#00A88E]">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#0A2540]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3D4F63]">{service.description}</p>
                <Link
                  href={service.href}
                  className="mt-5 inline-flex text-sm font-semibold text-[#00A88E] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
                >
                  {service.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 py-16 sm:py-20"
          aria-labelledby="how-heading"
        >
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-[#3D4F63]">A few simple steps to get your loan.</p>
          <ol className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
            {howItWorks.map((step, index) => (
              <li key={step.title} className="relative text-center">
                {index < howItWorks.length - 1 ? (
                  <span
                    className="pointer-events-none absolute left-[calc(50%+2.25rem)] top-8 hidden h-px w-[calc(100%-2rem)] bg-slate-200 lg:block"
                    aria-hidden
                  />
                ) : null}
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-sm ${step.accent}`}
                >
                  <Image
                    src={step.icon}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 brightness-0 invert"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#0A2540]">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3D4F63]">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="tools" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="tools-heading">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F7F4] text-[#00A88E]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h2
                id="tools-heading"
                className="mt-4 text-2xl font-bold tracking-tight text-[#0A2540] sm:text-3xl"
              >
                Stay in control after approval
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#3D4F63] sm:text-base">
                Track EMIs, view repayment schedules, and manage your loan from one dashboard once
                your application is approved.
              </p>
            </div>
            <Link
              href="/auth/sign-up"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#00A88E] px-7 text-sm font-semibold text-white transition hover:bg-[#00957D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E] lg:mt-0"
            >
              Open your dashboard
            </Link>
          </div>
        </section>

        <section
          id="why-crediwise"
          className="scroll-mt-24 py-16 sm:py-20"
          aria-labelledby="why-heading"
        >
          <h2 id="why-heading" className="text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
            Why Choose CrediWise
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-[#3D4F63]">Smarter choices. Greater confidence.</p>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-5">
            {whyChoose.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 max-lg:last:col-span-2 max-lg:last:mx-auto max-lg:last:max-w-xs"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F7F4] text-[#00A88E]">
                  <Image src={item.icon} alt="" width={28} height={28} unoptimized className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#0A2540] sm:text-base">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3D4F63]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section
        className="bg-[#F3F7FA] py-16 sm:py-20"
        aria-labelledby="testimonial-heading"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 overflow-x-clip px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch lg:gap-12 lg:px-10">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#00A88E]">CUSTOMER STORIES</p>
            <h2
              id="testimonial-heading"
              className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-[#0A2540] sm:text-[2rem] lg:text-[2.5rem]"
            >
              Trusted by People Making
              <br />
              Smarter Financial Choices
            </h2>
            <blockquote className="mt-8 max-w-xl">
              <p className="text-5xl font-serif leading-none text-[#00A88E]" aria-hidden>
                “
              </p>
              <p className="-mt-4 text-lg leading-relaxed text-[#3D4F63]">
                CrediWise helped me compare my options clearly and made the loan process feel much
                simpler.
              </p>
              <div className="mt-4 flex gap-1 text-[#00A88E]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <svg key={starIndex} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.18 3.64a1 1 0 0 0 .95.69h3.83c.97 0 1.37 1.24.59 1.81l-3.1 2.25a1 1 0 0 0-.36 1.12l1.18 3.64c.3.92-.76 1.69-1.54 1.12l-3.1-2.25a1 1 0 0 0-1.16 0l-3.1 2.25c-.78.57-1.84-.2-1.54-1.12l1.18-3.64a1 1 0 0 0-.36-1.12L2.5 9.07c-.78-.57-.38-1.81.59-1.81h3.83a1 1 0 0 0 .95-.69l1.18-3.64Z" />
                  </svg>
                ))}
              </div>
              <footer className="mt-6">
                <p className="font-semibold text-[#0A2540]">Priya S., Pune</p>
                <p className="mt-1 text-sm text-[#3D4F63]">Home Loan Customer</p>
              </footer>
            </blockquote>
          </div>
          <div className="order-1 relative min-h-[260px] overflow-hidden rounded-3xl bg-slate-200 sm:min-h-[320px] lg:order-2 lg:min-h-full">
            <Image
              src="/images/crediwise/crediwise-customer-photo.png"
              alt="CrediWise customer sharing her loan experience"
              fill
              sizes="(max-width: 1024px) 92vw, 45vw"
              className="object-cover object-[58%_center]"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#F3FAFC] md:hidden">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/images/crediwise/crediwise-cta-sunrise.png"
              alt="A young man with a backpack looking toward a city skyline at sunrise"
              fill
              sizes="100vw"
              className="object-cover object-[72%_center]"
            />
          </div>
          <div className="px-6 py-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#00A88E]">YOUR NEXT MOVE</p>
            <h2
              id="cta-heading"
              className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-[#0A2540]"
            >
              Take the Next Step Towards Your Goals
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#3D4F63]">
              Join thousands who trust CrediWise for smarter loan decisions.
            </p>
            <Link
              href="/auth/sign-up"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#00A88E] px-8 text-sm font-semibold text-white transition hover:bg-[#00957D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
            >
              Get Started →
            </Link>
          </div>
        </div>

        <div className="relative mx-auto hidden min-h-[22rem] max-w-6xl overflow-hidden rounded-3xl md:block">
          <Image
            src="/images/crediwise/crediwise-cta-sunrise.png"
            alt="A young man with a backpack looking toward a city skyline at sunrise"
            fill
            sizes="(max-width: 1440px) 100vw, 1152px"
            className="object-cover object-[70%_center]"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-white/95 from-[8%] via-[#F3FAFC]/75 via-[46%] to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex w-[42%] min-w-[17rem] max-w-[45%] items-center px-8 py-14 lg:px-12 lg:py-16">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#00A88E]">YOUR NEXT MOVE</p>
              <h2 className="mt-3 text-[2.25rem] font-bold leading-[1.2] tracking-tight text-[#0A2540] lg:text-[2.75rem]">
                Take the Next Step
                <br />
                Towards Your Goals
              </h2>
              <p className="mt-4 max-w-[26rem] text-base leading-relaxed text-[#3D4F63]">
                Join thousands who trust CrediWise for smarter loan decisions.
              </p>
              <Link
                href="/auth/sign-up"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#00A88E] px-8 text-sm font-semibold text-white transition hover:bg-[#00957D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-10"
        aria-labelledby="contact-heading"
      >
        <h2 id="contact-heading" className="text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
          Contact
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-[#3D4F63]">
          Tell us a little about what you need. We&apos;ll get back to you at the details you share.
        </p>
        <ContactForm />
      </section>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <BrandLogo heightPx={50} />
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} CrediWise. All rights reserved.
        </p>
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
  );
}
