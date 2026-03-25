"use client";

import React from "react";

const BecomeAgentPage = () => {
  const phoneNumber = "07061673695";
  const message = encodeURIComponent(
    "Hi, I would like to become an agent on Ruum.",
  );

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Become an Agent</h1>

        <p className="text-gray-600">
          Want to list your properties and reach more students? Click the button
          below to chat with us on WhatsApp and get started.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          {/* WhatsApp Icon */}
          <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
          Message us on WhatsApp
        </a>
      </div>
    </section>
  );
};

export default BecomeAgentPage;
