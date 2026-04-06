import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Span - Widgets for Time Left",
  description:
    "Privacy Policy for Span - Widgets for Time Left, a time-visualization app for iOS.",
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
              Span – Widgets for Time Left
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
              <span className="text-foreground">Span</span> (&quot;we&quot;,
              &quot;us&quot;, &quot;our&quot;) is a time-visualization app for
              iOS. This Privacy Policy explains what data is processed when you
              use Span and how it is used.
            </p>
          </section>

          <hr className="border-border" />

          {/* Section 1 – Scope */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Scope</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              This policy applies to the Span iOS app distributed through the
              Apple App Store.
            </p>
          </section>

          {/* Section 2 – Data We Process */}
          <section className="space-y-5">
            <h2 className="text-lg font-bold">2. Data We Process</h2>

            {/* 2A */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">
                A. Data stored locally on your device
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Span stores your app content and preferences (for example, time
                settings and customization choices){" "}
                <span className="text-foreground">
                  locally on your device
                </span>
                . We do not upload this local app content to our own servers.
              </p>
            </div>

            {/* 2B */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">
                B. Data processed for subscriptions and purchases
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Span offers optional in-app purchases (such as
                subscriptions/lifetime access). To enable purchases and restore
                entitlements, Apple and our subscription infrastructure provider
                (RevenueCat) process limited data, including:
              </p>
              <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">•</span>
                  <span>
                    <span className="text-foreground">User ID</span> (an
                    app-specific identifier)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">•</span>
                  <span className="text-foreground">Device ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">•</span>
                  <span>
                    <span className="text-foreground">
                      Purchase History
                    </span>{" "}
                    / transaction and receipt-related data
                  </span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                This data is used only to provide purchase-related functionality
                (for example, validating purchases, restoring purchases, and
                determining entitlement status).
              </p>
            </div>
          </section>

          {/* Section 3 – How We Use Data */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">3. How We Use Data</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We use the above data solely for:
            </p>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  <span className="text-foreground">App Functionality</span>{" "}
                  (subscriptions, purchase validation, entitlement management,
                  restore purchases, fraud/security-related reliability)
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We do <span className="text-foreground">not</span> use this data
              for:
            </p>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Third-party advertising</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Developer advertising or marketing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Analytics profiling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Cross-app tracking</span>
              </li>
            </ul>
          </section>

          {/* Section 4 – Tracking */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Tracking</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Span does{" "}
              <span className="text-foreground">not</span> use collected data
              for tracking as defined by Apple (for example, cross-app/site
              targeted advertising or data broker sharing for ad measurement).
            </p>
          </section>

          {/* Section 5 – Third Parties */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">5. Third Parties</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We use the following third parties for app operation:
            </p>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  <span className="text-foreground">Apple</span> (App Store /
                  in-app purchase processing)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  <span className="text-foreground">RevenueCat</span>{" "}
                  (subscription and entitlement infrastructure)
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Please review their policies:
            </p>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Apple Privacy:{" "}
                  <a
                    href="https://www.apple.com/legal/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    apple.com/legal/privacy
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  RevenueCat Privacy Policy:{" "}
                  <a
                    href="https://www.revenuecat.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    revenuecat.com/privacy
                  </a>
                </span>
              </li>
            </ul>
          </section>

          {/* Section 6 – Data Sharing and Sale */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">6. Data Sharing and Sale</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We do{" "}
              <span className="text-foreground">
                not sell your personal data
              </span>
              . We only share limited purchase/subscription-related data with
              Apple and RevenueCat as necessary to operate in-app purchases and
              subscription features.
            </p>
          </section>

          {/* Section 7 – Data Retention */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">7. Data Retention</h2>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Local app data remains on your device until you delete it or
                  uninstall the app.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Purchase/subscription-related records are retained by Apple
                  and/or RevenueCat according to their retention practices and
                  legal obligations.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 8 – Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">8. Children&apos;s Privacy</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Span is not directed to children under 13, and we do not knowingly
              collect personal information directly from children. If you believe
              personal data was provided by a child inappropriately, contact us
              and we will review the request.
            </p>
          </section>

          {/* Section 9 – Your Choices */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">9. Your Choices</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              You can:
            </p>
            <ul className="text-sm text-muted-foreground font-medium space-y-1.5 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Use Span without purchasing premium features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Manage or cancel subscriptions through your Apple ID settings
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>
                  Uninstall the app to remove locally stored app data from your
                  device
                </span>
              </li>
            </ul>
          </section>

          {/* Section 10 – Changes to This Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">
              10. Changes to This Policy
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We may update this Privacy Policy from time to time. When we do,
              we will update the{" "}
              <span className="text-foreground">
                &quot;Last updated&quot;
              </span>{" "}
              date on this page.
            </p>
          </section>

          {/* Section 11 – Contact */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">11. Contact</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              If you have any questions about this Privacy Policy:
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
                    href="https://www.debojyoticodes.in/"
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
