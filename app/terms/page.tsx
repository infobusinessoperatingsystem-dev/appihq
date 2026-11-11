import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Appi",
  description: "Terms for clients and massage therapists using the Appi platform.",
};

const sections = [
  { id: "overview", title: "1. About these terms" },
  { id: "clients", title: "2. Terms for clients" },
  { id: "therapists", title: "3. Terms for therapists" },
  { id: "payments", title: "4. Bookings, pricing and payments" },
  { id: "safety", title: "5. Health, safety and conduct" },
  { id: "privacy", title: "6. Information and privacy" },
  { id: "cancellations", title: "7. Changes, cancellations and complaints" },
  { id: "responsibility", title: "8. Responsibility and limitations" },
  { id: "account", title: "9. Accounts, suspension and ending use" },
  { id: "law", title: "10. Governing law and contact" },
];

export default function TermsPage() {
  return (
    <main className="app-page min-h-screen">
      <header className="border-b border-app-border bg-app-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="app-link text-xl font-semibold tracking-tight"><span className="italic">App</span>i</Link>
          <Link href="/therapists-list" className="app-link text-sm font-medium">Browse therapists</Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="self-start lg:sticky lg:top-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-primary">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Terms of service</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Effective 11 November 2026</p>
          <nav aria-label="Terms sections" className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-sm lg:flex-col">
            {sections.map((section) => <a key={section.id} href={`#${section.id}`} className="app-link">{section.title.replace(/^\d+\. /, "")}</a>)}
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl space-y-10 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
          <section id="overview" className="scroll-mt-8">
            <p className="text-lg leading-8">These Terms of Service explain the arrangements between Appihq, which operates the Appi platform (“Appi”, “we”, “us” or the “Business”), people who use Appi to find massage care (“Clients”), and independent massage therapists who present or offer their services through Appi (“Therapists”). They apply when you visit Appi, create or use an account, publish a therapist profile, contact another user, or request, accept or manage a massage booking through the platform.</p>
            <p className="mt-4">Appi is being developed incrementally. At this stage, Appi is focused on massage therapists and massage services only. Other professions or service categories that may be part of Appi’s longer-term vision are not currently offered through the platform and are not covered as available services by these Terms. If Appi introduces another category, it will explain the applicable service and update these Terms before that category becomes available.</p>
            <p className="mt-4">By using Appi, you agree to the terms that apply to your role. If you do not agree, do not use the relevant Appi service. “You” refers to the person using Appi as a Client or Therapist. These Terms govern your use of the Appi platform; the massage service itself is arranged directly between the Client and the independent Therapist, as described below.</p>
            <div className="mt-5 border-l-2 border-app-accent pl-4 text-sm leading-6 text-app-ink-muted">This page is a plain-language product draft and is not legal advice. Before launch, Appihq should confirm its registered legal name, address, contact details, fees, refund rules, privacy practices, licensing obligations and dispute process with a Ghana-qualified lawyer. Do not rely on a booking or payment feature until Appi explicitly confirms it is available.</div>
          </section>

          <section id="clients" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">2. Terms for clients</h2>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Using Appi to find care</h3>
            <p className="mt-2">Appi lets you discover massage therapist profiles, compare information and, where booking tools are enabled, send a request for a massage service. Appi provides the marketplace and technology used for discovery and booking. Unless we expressly say otherwise, Appi does not provide massage, diagnose or treat medical conditions, employ the Therapist, or supervise the Therapist’s hands-on work. The Client and Therapist are responsible for agreeing the details of the massage service, including the treatment, price, location and timing. Their service agreement is separate from the Client’s agreement with Appihq to use the Appi platform.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Your information and bookings</h3>
            <p className="mt-2">Give accurate contact and booking information and keep it current. Review the selected service, duration, location, date, time and full price before confirming. A booking is not accepted until the relevant confirmation is shown or sent by Appi or the Therapist. Do not assume that a time is reserved while a request is pending. You are responsible for providing reasonable access to the agreed service location and for communicating relevant access instructions.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Health and personal boundaries</h3>
            <p className="mt-2">Tell the Therapist, before the session, about relevant injuries, allergies, pregnancy, health conditions, medication, sensitivities or pressure preferences. Massage may not be suitable for everyone and is not a substitute for medical advice or emergency care. You may pause or stop a session at any time. You may decline any technique or contact that makes you uncomfortable. Do not use Appi to request sexual services; Therapists may stop a session if a Client behaves sexually, threateningly or abusively.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Respectful use</h3>
            <p className="mt-2">Treat Therapists and Appi staff respectfully, arrive on time, and do not harass, discriminate against, threaten, stalk, exploit or impersonate anyone. Do not post false reviews, misuse another person’s personal information, attempt to move a booking off-platform to evade an agreed fee, or use Appi for unlawful activity. Tell us promptly if you believe a profile, message or interaction is unsafe or fraudulent.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Reviews and profile content</h3>
            <p className="mt-2">You may submit truthful, relevant feedback about a genuine experience. Do not include private contact details, sensitive health information, threats, discriminatory language or content you do not have permission to share. You give Appi permission to display and moderate your submitted review to operate the service. You retain ownership of your content; this permission ends when the content is removed, except where retention is needed for records, safety or legal obligations.</p>
          </section>

          <section id="therapists" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">3. Terms for therapists</h2>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Independent provider relationship</h3>
            <p className="mt-2">Therapists use Appi as independent massage service providers, not as employees, partners, agents or representatives of Appihq. The Therapist agrees with Appihq to use the platform under these Terms and any service-specific requirements shown by Appi. Separately, when a Client and Therapist agree to a massage booking, they form a service arrangement directly with each other. The Therapist controls their professional delivery, subject to the agreed booking, applicable law, professional obligations and these platform rules. The Therapist is responsible for their taxes, insurance, permits, registrations, training, equipment, workspace and business expenses. Nothing here removes any legal employment or consumer rights that cannot lawfully be excluded.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Accurate profile and professional standards</h3>
            <p className="mt-2">Provide truthful, current information about your identity, massage qualifications and experience, massage treatments, prices, availability, service area and credentials. Do not claim a licence, certification or verification that you do not hold. Keep credentials and any legally required permissions current, and provide evidence when reasonably requested. Use only photos and text you own or are allowed to publish. Tell Appi promptly about changes that make your profile inaccurate or your massage services unavailable.</p>
            <p className="mt-2">Deliver services competently, safely, hygienically and within the scope of your training. Obtain informed consent before beginning and before changing techniques. Respect privacy, personal boundaries and Client requests to pause or stop. Do not discriminate, harass, exploit, threaten or engage in sexual conduct with a Client. Do not provide a diagnosis or claim a guaranteed medical result unless you are legally qualified to do so.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Bookings, availability and cancellations</h3>
            <p className="mt-2">Keep availability current, respond to booking requests promptly, and accept only work you can perform. Confirm the service, price, location and timing with the Client before the session. Attend at the agreed time or contact the Client as soon as possible if delayed. Do not cancel without good reason or repeatedly fail to attend. Follow the cancellation and refund information displayed for the particular booking; if no policy is displayed, contact the Client and Appi promptly to agree a fair resolution. Do not misrepresent Appi’s role or promise that Appi has approved a service, payment or refund unless it has.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Platform access and fees</h3>
            <p className="mt-2">Appi may set reasonable profile, safety, quality and service-area requirements and may display profiles using factors such as relevance, location, availability, completeness and user feedback. Any commission, subscription, lead fee, payment-processing fee or other charge must be disclosed to you before it applies. Appi will not create a new fee by silently changing these Terms. Where a payment feature is provided, payout timing, deductions and dispute handling will be disclosed separately before you use it.</p>
            <h3 className="mt-5 font-semibold text-zinc-900 dark:text-zinc-100">Client information and confidentiality</h3>
            <p className="mt-2">Use Client information only to communicate about and provide the requested service, meet legal obligations, or address a safety issue. Keep it secure, do not sell it or use it for unrelated marketing without permission, and delete it when it is no longer needed unless law requires retention. Do not share a Client’s images, health details, address or messages without explicit permission or another lawful basis.</p>
          </section>

          <section id="payments" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">4. Bookings, pricing and payments</h2>
            <p className="mt-3">The Therapist sets the price for the massage unless the listing clearly says otherwise. The price and any travel charge, deposit, platform fee, tax or other amount must be shown before the Client confirms. Do not pay through a link or account that you cannot verify. Appi will identify the payment recipient and available payment methods when payment processing is enabled. Until then, Appi’s display of a booking or price does not mean Appi has collected or guaranteed payment.</p>
            <p className="mt-3">Each party must follow the cancellation, refund and payment terms presented for the booking. If those terms are missing or unclear, contact the other party and Appi before payment or service where possible. Appi may help communicate or review a complaint but is not a bank, insurer or guarantor of a Client’s payment or a Therapist’s performance. Nothing in this section limits a right to a refund or remedy that applicable law provides.</p>
          </section>

          <section id="safety" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">5. Health, safety and conduct</h2>
            <p className="mt-3">Clients and Therapists must use accurate identities and communicate respectfully. Neither party should attend or continue a session if they reasonably believe the other person is impaired, threatening, unsafe or acting outside agreed boundaries. Move to a safe place and contact local emergency services if there is an immediate danger. Report serious incidents to Appi as soon as reasonably possible. Appi may preserve relevant account or message information and take proportionate action to protect users and comply with law.</p>
            <p className="mt-3">Profile checks, document checks, reviews and identity indicators, if offered, are limited signals. They are not a guarantee of a person’s character, qualifications, safety, identity or future conduct. Clients must make their own informed decision; Therapists must also take reasonable steps to assess a booking and service location.</p>
          </section>

          <section id="privacy" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">6. Information and privacy</h2>
            <p className="mt-3">Appi may process account, profile, booking, device, communication and support information to operate the platform, match users, prevent misuse, provide support, improve the service and meet legal obligations. We should publish a separate privacy notice explaining what information is collected, the lawful basis and purposes, who receives it, retention periods, security practices, user rights and how to contact the privacy lead. Do not submit payment-card data or sensitive health information in a general message unless Appi specifically provides a secure field for it.</p>
            <p className="mt-3">Therapists must protect personal information received through Appi and use it only as permitted in these Terms and by applicable data-protection law. Both Clients and Therapists should report suspected loss, unauthorised access or disclosure promptly.</p>
          </section>

          <section id="cancellations" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">7. Changes, cancellations and complaints</h2>
            <p className="mt-3">If you need to change or cancel a booking, tell the other party and Appi as soon as possible and follow the policy shown for that booking. Refunds, deposits and late-cancellation charges depend on the disclosed booking terms and applicable law. If a service does not happen as agreed, contact the other party and Appi with the booking details and a factual description. Appi may ask both parties for information, help facilitate a resolution, remove content or restrict access where reasonably necessary. Unless a payment or dispute-resolution service is explicitly offered, Appi cannot promise an outcome or recover money from another party.</p>
          </section>

          <section id="responsibility" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">8. Responsibility and limitations</h2>
            <p className="mt-3">Appi will use reasonable care to operate and maintain the platform, but does not guarantee uninterrupted access, error-free listings, a particular number of bookings, a user’s identity or credentials, or the quality or outcome of a massage. Therapists are responsible for the professional service they provide; Clients are responsible for accurate information and their choices. Appi is not responsible for conduct or services delivered independently by users, except to the extent responsibility cannot lawfully be excluded or results from Appi’s own breach of a duty it owes.</p>
            <p className="mt-3">To the extent permitted by law, Appi excludes implied warranties that can lawfully be excluded and is not liable for indirect or consequential loss, lost profits, or loss of data arising from use of the platform. These limits do not exclude liability for fraud, intentional misconduct, death or personal injury caused by negligence, breach of a non-excludable legal duty, or any other liability that cannot lawfully be limited. Nothing in these Terms takes away a consumer protection or other right that applicable law makes mandatory.</p>
          </section>

          <section id="account" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">9. Accounts, suspension and ending use</h2>
            <p className="mt-3">Keep account credentials private and tell Appi if you suspect unauthorised access. You may stop using Appi at any time and may request account closure through the contact method Appi provides. Appi may remove a listing, pause a booking or suspend or close access if it reasonably believes a user has breached these Terms, created a safety risk, supplied false information, failed to meet platform requirements, or if required by law. Where appropriate and lawful, Appi will explain the reason and provide a way to ask for a review. Accrued payment obligations, privacy duties, content permissions and provisions intended to survive will continue after an account closes.</p>
          </section>

          <section id="law" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">10. Governing law and contact</h2>
            <p className="mt-3">These Terms are intended to be governed by the laws of Ghana, without removing mandatory consumer protections available to you. The parties should first try to resolve a concern through Appi support and direct, respectful communication. If it cannot be resolved informally, either party may use any court or dispute process available under applicable law.</p>
            <p className="mt-3">Appihq should insert and maintain its registered business name, physical or registered address, support email, privacy contact and any required company registration details here before these Terms are relied on as a final legal agreement. For now, contact Appi using the support channel shown in the Appi service.</p>
            <p className="mt-3">We may update these Terms to reflect product or legal changes. We will publish the revised version with its effective date and give additional notice where required. Continued use after an update takes effect means acceptance only to the extent permitted by law; if you do not agree, stop using the affected service.</p>
          </section>
        </article>
      </div>
    </main>
  );
}
