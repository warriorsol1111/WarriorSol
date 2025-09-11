import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export const metadata = {
  title: "Privacy Policy | Warrior Sol",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-8">
          At <span className="font-semibold">Warrior Sol</span>, your privacy
          matters to us. This Privacy Policy explains how we collect, use, and
          protect your information when you shop with us. By using our website,
          you agree to the terms below.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>
          <p>
            We may collect personal information such as your name, email
            address, shipping address, payment details, and order history. We
            also collect non-personal data like browser type, device
            information, and site usage statistics to improve your experience.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To process and deliver your orders</li>
            <li>To communicate updates, promotions, and customer support</li>
            <li>To improve our website, products, and shopping experience</li>
            <li>
              To prevent fraudulent activity and ensure secure transactions
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            3. Sharing Your Information
          </h2>
          <p>
            We do not sell your personal data. However, we may share necessary
            details with trusted third-party services (such as payment
            processors, shipping providers, and analytics tools) strictly for
            business purposes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">4. Cookies & Tracking</h2>
          <p>
            Like most websites, we use cookies to personalize your shopping
            experience, remember your preferences, and analyze site traffic. You
            may disable cookies in your browser, but some features of our site
            may not function properly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
          <p>
            We take your security seriously. Our website uses industry-standard
            encryption and security measures to protect your personal
            information against unauthorized access, loss, or misuse.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. You may also opt out of marketing emails at any time by
            clicking the “unsubscribe” link in our emails.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated “last revised” date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at: <br />
            <a
              href="mailto:support@warriorsol.com"
              className="text-blue-600 underline"
            >
              hello@warriorsol.com
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
