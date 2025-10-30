import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6 sm:py-8 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-center mb-4 text-pink-600">
        Privacy Policy
      </h1>

      <p className="text-gray-600 text-center mb-10">
        At <strong>Bloom’s Heaven</strong>, your privacy and trust mean the
        world to us. This Privacy Policy explains how we collect, use, and
        protect your information when you visit our website or place an order
        with us.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        1. Information We Collect
      </h2>
      <p>
        We collect only the information necessary to provide a smooth and
        enjoyable shopping experience. This may include:
      </p>
      <ul className="list-disc pl-6 mt-2">
        <li>Your name, email address, and phone number</li>
        <li>Delivery address for your orders</li>
        <li>Payment information (securely processed through trusted gateways)</li>
        <li>Information you provide while contacting us or signing up</li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        2. How We Use Your Information
      </h2>
      <p>
        We use your information responsibly and only for purposes that help us
        serve you better:
      </p>
      <ul className="list-disc pl-6 mt-2">
        <li>To process and deliver your orders accurately</li>
        <li>To keep you updated on your order status and promotions</li>
        <li>To improve our website, services, and customer support</li>
        <li>To respond to your messages and queries promptly</li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        3. Data Security
      </h2>
      <p>
        Your personal data is protected with industry-standard security
        practices. We never store your payment details directly — all payments
        are handled securely through trusted third-party processors. We also
        ensure that your data is not shared or sold to anyone, ever.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        4. Sharing of Information
      </h2>
      <p>
        We may share limited information only with trusted partners who help us
        operate our business — for example, delivery services or payment
        gateways. These partners are bound by strict confidentiality agreements
        and are not allowed to use your data for any other purpose.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        5. Cookies
      </h2>
      <p>
        Our website may use cookies to improve your browsing experience. Cookies
        help us understand your preferences and show you more relevant content.
        You can choose to disable cookies anytime through your browser settings.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        6. Your Rights
      </h2>
      <p>
        You have full control over your personal data. You can request to view,
        update, or delete your information anytime by contacting us. We’ll
        process such requests promptly and respectfully.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        7. Changes to This Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time to reflect new
        features or legal requirements. The latest version will always be
        available on our website with the effective date clearly mentioned.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        8. Contact Us
      </h2>
      <p>
        If you have any questions or concerns about our Privacy Policy, please
        feel free to contact us at:
      </p>
      <p className="mt-2">
        📧 <strong>Email:</strong>{" "}
        <a
          href="mailto:bloomsheaven.ltd@gmail.com"
          className="text-pink-600 hover:underline"
        >
          bloomsheaven.ltd@gmail.com
        </a>
        <br />
        📞 <strong>Phone:</strong>{" "}
        <a
          href="tel:+916361132722"
          className="text-pink-600 hover:underline"
        >
          +91 6361132722
        </a>
      </p>

      <p className="text-sm text-gray-500 mt-10 text-center">
        Last updated: October 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
