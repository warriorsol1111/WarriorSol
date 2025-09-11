import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export const metadata = {
  title: "Terms of Service | Warrior Sol",
};

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-8">
          Welcome to <span className="font-semibold">Warrior Sol</span>. By
          accessing or using our website, you agree to the following Terms of
          Service. Please read them carefully before placing any orders or using
          our services.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">1. Use of Our Website</h2>
          <p>
            You agree to use our website for lawful purposes only. You must not
            attempt to hack, disrupt, or misuse any features of the site or
            interfere with other users’ experiences.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            2. Product Information
          </h2>
          <p>
            We strive to display accurate product descriptions, pricing, and
            availability. However, mistakes may happen, and we reserve the right
            to correct errors or update information at any time without prior
            notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">3. Orders & Payments</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>All orders are subject to acceptance and availability.</li>
            <li>
              Prices are listed in your local currency (where available) and may
              include taxes.
            </li>
            <li>
              We accept major payment methods securely through our checkout
              system.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            4. Shipping & Delivery
          </h2>
          <p>
            Delivery times are estimates and may vary due to factors outside our
            control. We are not responsible for delays caused by shipping
            carriers or customs clearance.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            5. Returns & Exchanges
          </h2>
          <p>
            If you’re not satisfied with your purchase, you may request a return
            or exchange in accordance with our Return Policy. Items must be
            unused, unworn, and in their original packaging.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            6. Intellectual Property
          </h2>
          <p>
            All content on this website—including text, images, designs, and
            logos— is owned by Warrior Sol and protected by copyright and
            trademark laws. Unauthorized use is strictly prohibited.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            7. Limitation of Liability
          </h2>
          <p>
            We are not liable for any indirect, incidental, or consequential
            damages resulting from your use of our website, products, or
            services. Your use of our site is at your own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our website
            if we believe you have violated these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please reach out at:{" "}
            <br />
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
