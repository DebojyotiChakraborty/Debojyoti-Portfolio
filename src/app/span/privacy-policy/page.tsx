import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Span - Widgets for Time Left",
  description:
    "Privacy Policy for Span - Widgets for Time Left, a minimalist time visualization app for iOS.",
};

export default function SpanPrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle gradient header accent */}
      <div className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none">
        <div className="h-full bg-gradient-to-b from-background via-background/70 to-transparent" />
      </div>

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">
            ←
          </span>
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Span - Widgets for Time Left
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">
              Last updated: April 6, 2026
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-10">
          {/* Intro */}
          <section>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Your privacy is important to us.{" "}
              <span className="text-foreground">Span</span> is a minimalist
              time visualization app designed to help you understand and
              appreciate your time. This Privacy Policy explains what
              information we collect, how we use it, and your rights regarding
              your data.
            </p>
          </section>

          <hr className="border-border" />

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Information We Collect</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              <span className="text-foreground">
                Span does not collect, store, or transmit any personal data.
              </span>{" "}
              All data you enter into the app — such as your date of birth or
              time-related preferences — is stored{" "}
              <span className="text-foreground">
                locally on your device only
              </span>{" "}
              and is never sent to any external server.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">2. In-App Purchases</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Span offers optional in-app purchases (subscriptions and lifetime
              access) through{" "}
              <span className="text-foreground">Apple&apos;s App Store</span>.
              These transactions are processed entirely by Apple and managed
              through{" "}
              <span className="text-foreground">RevenueCat</span>, a
              third-party service that helps us manage subscription status.
            </p>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              RevenueCat may receive an{" "}
              <span className="text-foreground">
                anonymous app user identifier
              </span>{" "}
              and purchase receipt data from Apple to verify and manage your
              subscription. RevenueCat does not receive your name, email
              address, or any other personally identifiable information from
              Span.
            </p>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              For more details, please review{" "}
              <a
                href="https://www.revenuecat.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                RevenueCat&apos;s Privacy Policy
              </a>
              .
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">3. Analytics & Tracking</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Span does{" "}
              <span className="text-foreground">
                not use any analytics, tracking, or advertising SDKs
              </span>
              . We do not track your usage, behavior, or any other activity
              within the app.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Data Sharing</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We do not sell, trade, or share your data with any third parties.
              Since{" "}
              <span className="text-foreground">
                no personal data is collected
              </span>
              , there is nothing to share.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">5. Data Storage & Security</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              All app data is stored{" "}
              <span className="text-foreground">
                locally on your iOS device
              </span>{" "}
              and is protected by your device&apos;s own security measures
              (passcode, Face ID, Touch ID). If you delete the app, all local
              data is permanently removed.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">6. Children&apos;s Privacy</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Span does not knowingly collect any personal information from
              children under 13. Since{" "}
              <span className="text-foreground">
                no personal data is collected at all
              </span>
              , the app is safe for users of all ages.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated{" "}
              <span className="text-foreground">
                &quot;Last updated&quot;
              </span>{" "}
              date. We encourage you to review this page periodically.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">8. Contact</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              If you have any questions or concerns about this Privacy Policy,
              feel free to reach out:
            </p>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  X (Twitter):{" "}
                  <a
                    href="https://x.com/pseudo_maverick"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    @pseudo_maverick
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Website:{" "}
                  <a
                    href="https://debojyoticodes.in"
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    debojyoticodes.in
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Email:{" "}
                  <a
                    href="mailto:debojyotichakraborty.appshelp@gmail.com"
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    debojyotichakraborty.appshelp@gmail.com
                  </a>
                </span>
              </li>
            </ul>
          </section>

          <hr className="border-border" />

          {/* Footer note */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            This privacy policy applies to the Span iOS app distributed through
            the Apple App Store.
          </p>
        </div>
      </main>
    </div>
  );
}
