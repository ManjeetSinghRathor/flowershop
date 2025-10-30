import React from "react";

const TnCPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6 sm:py-8 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-center mb-4 text-pink-600">
        Terms & Conditions
      </h1>

      <p className="text-gray-600 text-center mb-10">
        Welcome to <strong>Bloom’s Heaven</strong>! These Terms & Conditions
        govern your use of our website and services. By accessing or making a
        purchase from our site, you agree to follow these terms carefully.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        1. General Information
      </h2>
      <p>
        Bloom’s Heaven is an online flower and gift delivery service based in
        Banglore, India. We aim to bring joy and smiles through beautiful
        arrangements, delivered with care. All transactions on our website are
        subject to these terms and applicable Indian laws.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        2. Product Availability & Images
      </h2>
      <p>
        Our flowers are fresh and seasonal. In rare cases, some blooms,
        wrappings, or ribbons shown in product images may be unavailable due to
        market conditions. We reserve the right to make minor substitutions
        while maintaining the overall theme, quality, and value of your
        selected arrangement.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        3. Orders and Payments
      </h2>
      <p>
        Orders can be placed securely through our website. All prices are listed
        in Indian Rupees (₹) and include applicable taxes. Payment must be made
        in full before your order is confirmed. We use trusted and secure
        payment gateways to protect your information.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        4. Delivery Policy
      </h2>
      <p>
        We strive to deliver your order on your chosen date and time slot.
        However, unforeseen factors such as traffic, weather, or other external
        events may occasionally cause slight delays. In such cases, our team
        will keep you informed and ensure timely delivery as best possible.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        5. Cancellation and Modifications
      </h2>
      <p>
        Once your bouquet has been carefully prepared or dispatched, we’re
        unable to cancel or modify the order. If you wish to cancel, please
        contact us <strong>immediately before dispatch</strong>. You can reach
        us via <strong>WhatsApp or call at +91 6361132722</strong> — we’ll do
        our best to assist you promptly.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        6. Returns & Refunds
      </h2>
      <p>
        Due to the perishable nature of flowers, we can only accept returns or
        issue refunds in cases of damaged, missing, or incorrect products. If
        you face any issues, please contact us within <strong>2 hours</strong>{" "}
        of delivery with photos or proof of the issue. We’ll review your request
        and resolve it fairly.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        7. Customer Responsibilities
      </h2>
      <p>
        Please ensure that the recipient’s address, contact number, and delivery
        details are accurate. Incorrect or incomplete details may lead to failed
        or delayed deliveries, for which we cannot be held responsible.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        8. Intellectual Property
      </h2>
      <p>
        All website content, including text, images, graphics, and logos, are
        the property of Bloom’s Heaven. You may not reproduce, distribute, or
        use any material from our website without prior written consent.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        9. Limitation of Liability
      </h2>
      <p>
        While we take great care in every step, Bloom’s Heaven will not be
        liable for indirect, incidental, or consequential damages arising from
        the use of our website or services. Our responsibility is limited to the
        value of the order placed.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        10. Changes to Terms
      </h2>
      <p>
        We may update these Terms & Conditions from time to time to reflect new
        policies, services, or legal requirements. Please review this page
        periodically for the latest updates. Continued use of our website
        signifies your acceptance of the current terms.
      </p>

      {/* Section 11 */}
      <h2 className="text-xl font-semibold mt-8 mb-2 text-pink-500">
        11. Contact Us
      </h2>
      <p>
        For any questions or concerns regarding these Terms & Conditions, feel
        free to reach out to us:
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
        <a href="tel:+916361132722" className="text-pink-600 hover:underline">
          +91 6361132722
        </a>
      </p>

      <p className="text-sm text-gray-500 mt-10 text-center">
        Last updated: October 2025
      </p>
    </div>
  );
};

export default TnCPolicy;
