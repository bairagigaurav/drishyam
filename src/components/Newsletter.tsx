"use client";

import React, { useState } from "react";
import { CheckCircle2, MapPin, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitOnboardingLead } from "@/lib/site-content";

type ContactFormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const validateContactField = (field: keyof typeof initialForm, value: string): string => {
  const trimmed = value.trim();

  if (field === "name") {
    if (!trimmed) return "Name is required.";
    if (trimmed.length < 2) return "Name must be at least 2 characters.";
  }

  if (field === "email") {
    if (!trimmed) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
  }

  if (field === "phone" && trimmed && !/^\+?[0-9\s-]{7,15}$/.test(trimmed)) {
    return "Enter a valid phone number.";
  }

  if (field === "message") {
    if (!trimmed) return "Message is required.";
    if (trimmed.length < 10) return "Message should be at least 10 characters.";
  }

  return "";
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function Newsletter() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof typeof initialForm;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => ({ ...prev, [fieldName]: validateContactField(fieldName, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: ContactFormErrors = {
      name: validateContactField("name", formData.name),
      email: validateContactField("email", formData.email),
      phone: validateContactField("phone", formData.phone),
      message: validateContactField("message", formData.message),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    submitOnboardingLead({
      name: formData.name,
      number: formData.phone || "Not provided",
      email: formData.email,
    });

    setSubmitted(true);
    setFormData(initialForm);
    setErrors({});
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),transparent_35%),linear-gradient(180deg,#fffaf5_0%,#f7f2ea_100%)] py-20 border-t border-beige-200">
      <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle at 20% 20%, rgba(15,23,42,0.05) 0, transparent 30%), radial-gradient(circle at 80% 10%, rgba(245,158,11,0.08) 0, transparent 25%)"}} />

      <div className="relative  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-[12px] font-bold uppercase -[0.24em] text-charcoal/60 block mb-3">
            Contact us
          </span>
          <h2 className=" text-3xl md:text-5xl text-charcoal font-medium">
            Visit or message our boutique.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-[30px] border border-[#efdcc1] bg-white p-6 shadow-[0_25px_60px_rgba(17,17,17,0.06)]"
          >
            <div className="mb-6 flex items-center gap-3 text-charcoal/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-lg shadow-[#111111]/10">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase -[0.22em] text-charcoal/45">
                  Write to us
                </p>
                <p className="text-xl font-semibold text-charcoal">Book a consultation</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase -[0.2em] text-charcoal/50">
                        Name
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className={`w-full rounded-2xl border bg-[#fffaf5] px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none ${errors.name ? "border-red-300 focus:border-red-400" : "border-[#ebdcc7] focus:border-[#f59e0b]"}`}
                      />
                      {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase -[0.2em] text-charcoal/50">
                        Phone
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full rounded-2xl border bg-[#fffaf5] px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none ${errors.phone ? "border-red-300 focus:border-red-400" : "border-[#ebdcc7] focus:border-[#f59e0b]"}`}
                      />
                      {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone}</p>}
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase -[0.2em] text-charcoal/50">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className={`w-full rounded-2xl border bg-[#fffaf5] px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none ${errors.email ? "border-red-300 focus:border-red-400" : "border-[#ebdcc7] focus:border-[#f59e0b]"}`}
                    />
                    {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
                  </label>

                  {/* <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase -[0.2em] text-charcoal/50">
                      Message
                    </span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you are looking for..."
                      required
                      rows={5}
                      className={`w-full rounded-2xl border bg-[#fffaf5] px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none resize-none ${errors.message ? "border-red-300 focus:border-red-400" : "border-[#ebdcc7] focus:border-[#f59e0b]"}`}
                    />
                    {errors.message && <p className="mt-2 text-xs text-red-600">{errors.message}</p>}
                  </label> */}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-[11px] font-bold uppercase -[0.22em] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#111111]/10"
                  >
                    Send enquiry
                    <Send className="h-4 w-4" />
                  </button>
                    <div className="rounded-[30px] border border-[#efdcc1] bg-white p-6 shadow-[0_25px_60px_rgba(17,17,17,0.06)]">
              <h3 className=" text-2xl md:text-3xl text-charcoal mb-5">Visit our store</h3>

              <div className="space-y-5 text-base text-charcoal/75">
                <div className="flex gap-3 items-start">
                  <MapPin className="mt-1 h-5 w-5 text-[#f59e0b]" />
                  <p className="leading-relaxed text-sm">
                    Shiv Dham Gate, near Prajpat Aata Chakki, Khandwa Road, Limbodi, Indore
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <Phone className="h-5 w-5 text-[#f59e0b]" />
                  <a href="tel:+917999965453" className="hover:text-charcoal transition-colors text-sm">
                    +91 79999-65453
                  </a>
                </div>

                <div className="flex gap-3 items-center">
                  <Mail className="h-5 w-5 text-[#f59e0b]" />
                  <a href="mailto:hello@drishyamoptical.com" className="hover:text-charcoal transition-colors text-sm">
                    hello@drishyamoptical.com
                  </a>
                </div>
              </div>
            </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-center"
                >
                  <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600" />
                  <h3 className=" text-2xl text-charcoal">Thanks for reaching out.</h3>
                  <p className="mt-2 max-w-sm text-sm text-charcoal/60">
                    We have received your message and will contact you shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="space-y-5">
            <div className="overflow-hidden h-full rounded-[30px] border border-[#efdcc1] bg-white shadow-[0_25px_60px_rgba(17,17,17,0.06)]">
              <div className="h-full w-full">
                <iframe
                  title="Drishyam Optical location"
                  src="https://www.google.com/maps?q=Shiv%20Dham%20Gate%2C%20near%20Prajpat%20Aata%20Chakki%2C%20Khandwa%20Road%2C%20Limbodi%2C%20Indore&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </section>
  );
}

