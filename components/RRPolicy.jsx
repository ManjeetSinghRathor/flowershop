import React from "react";

const RRPolicy = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="max-w-4xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-pink-600 mb-6">
                    Return & Refund Policy
                </h1>

                <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto">
                    At <strong>Bloom’s Heaven</strong>, your happiness matters most to us.
                    We aim to deliver every bouquet fresh, beautiful, and on time.
                    However, if something doesn’t go as planned, we’re here to make it
                    right — simply and quickly.
                </p>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🌸 Eligibility for Returns or Refunds
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Since flowers are perishable and made-to-order, returns are not
                        always possible.
                        However, we offer full or partial refunds in the following cases:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Wrong product delivered (different flowers or item).</li>
                        <li>Damaged or wilted flowers upon arrival.</li>
                        <li>Delivery delayed beyond the scheduled time due to our fault.</li>
                        <li>Order cancelled before preparation or dispatch.</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🕒 Timeframe for Reporting Issues
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Please inform us within <strong>2-3 hours of delivery</strong> if you
                        face any issue with your order.
                        We request you to share a clear picture of the product and your
                        order details for quick resolution.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        💰 Refund Process
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Once your request is approved, the refund will be initiated within{" "}
                        <strong>1-2 business days</strong>.
                        Refunds are processed back to the same payment method used during
                        purchase (credit card, UPI, or wallet).
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🚫 Non-Refundable Situations
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        We won’t be able to process a refund if:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>
                            Incorrect delivery address or contact number was provided by the
                            customer.
                        </li>
                        <li>
                            Recipient was not available at the delivery location or refused
                            the order.
                        </li>
                        <li>
                            Minor variations in color, wrapping, or flower type (since natural
                            flowers may vary).
                        </li>
                    </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🌷 Order Cancellation
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Once your bouquet has been carefully prepared or dispatched, we’re unable to cancel or modify the order.
                        If you wish to cancel, please contact us <strong>immediately before dispatch</strong>.
                        You can reach us quickly via <strong className="underline">WhatsApp or call at +91 6361132722</strong> — we’ll do our best to assist you right away.
                    </p>

                </section>

                {/* Section 6 */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        ❤️ Our Commitment
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Every bouquet we make is special, just like the person receiving it.
                        If you ever face an issue, please reach out — our support team will
                        personally ensure it’s resolved quickly and kindly.
                        <br />
                        Your trust keeps us blooming, and we truly appreciate it.
                    </p>
                </section>

                <div className="text-center text-gray-500 text-sm border-t pt-6">
                    Updated on {new Date().toLocaleDateString()}
                    <br />
                    For help, write to us at{" "}
                    <a
                        href="mailto:bloomsheaven.ltd@gmail.com"
                        className="text-pink-600 font-medium hover:underline"
                    >
                        bloomsheaven.ltd@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RRPolicy;
