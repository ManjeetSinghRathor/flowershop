import React from "react";

const ShippingDelivery = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="max-w-4xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-pink-600 mb-6">
                    Shipping & Delivery Policy
                </h1>

                <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto">
                    At <strong>Bloom’s Heaven</strong>, we take pride in delivering your
                    fresh flowers and gifts with care, precision, and a personal touch.
                    Please read our simple policy below to understand how we ensure every
                    delivery brings a smile.
                </p>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🌷 Delivery Areas
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        We currently deliver across <strong>Bangalore</strong> and nearby
                        locations. For other cities, please contact us before placing an
                        order. We are continuously expanding our delivery network to serve
                        more customers.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        ⏰ Delivery Time
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Orders placed before <strong>7:00 PM</strong> are usually delivered
                        the same day. For orders placed after that, delivery will be made on
                        the next day.
                        <br />
                        {/* You can also choose your preferred delivery slot during checkout for
                        special occasions or surprises. */}
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🌸 Same-Day & Express Delivery
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        We offer same-day delivery for most flower products within city
                        limits. Express delivery within <strong>2–3 hours</strong> is also
                        available for select areas at an additional charge.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        💐 Handling & Packaging
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Every bouquet and gift is hand-crafted fresh by our florists.
                        We pack your flowers with moisture wraps and eco-friendly materials
                        to ensure they stay fresh and beautiful upon arrival.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        📦 Delivery Charges
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Standard delivery charges apply based on your delivery location and
                        time slot. The exact amount will be shown during checkout before you
                        confirm your order.
                        We also offer <strong>free delivery</strong> on select occasions and
                        promotional offers.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        🚚 Order Tracking
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Once your order is confirmed, you’ll receive a tracking link or
                        update via WhatsApp or email.
                        Our support team is always available to help you with order status
                        or delivery updates.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        📞 Failed or Missed Delivery
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        If the recipient is unavailable at the delivery address, our team
                        will contact you or attempt redelivery.
                        Please ensure correct address and contact details are provided to
                        avoid delays or failed deliveries.
                    </p>
                </section>

                {/* Section 8 */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        ❤️ Our Promise
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        We understand how special every flower delivery is. Our goal is to
                        make sure your flowers arrive on time, fresh, and beautifully
                        arranged — just the way you imagined.
                        <br />
                        Your trust means everything to us. Thank you for choosing{" "}
                        <strong>Bloom’s Heaven</strong> to spread smiles and love.
                    </p>
                </section>

                <div className="text-center text-gray-500 text-sm border-t pt-6">
                    Updated on {new Date().toLocaleDateString()}
                    <br />
                    For any queries, reach us at{" "}
                    <a
                        href="mailto:bloomsheaven.ltd@gmail.com"
                        className="anchor-tag text-pink-600 font-medium hover:underline"
                    >
                        bloomsheaven.ltd@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShippingDelivery;
