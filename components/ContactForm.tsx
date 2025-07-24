"use client";

export default function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/xnnveqve" // 🔁 Replace with your Formspree URL
      method="POST"
      className="space-y-4 max-w-xl"
    >
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        className="w-full p-3 rounded border border-slate-300"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
        className="w-full p-3 rounded border border-slate-300"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        required
        className="w-full p-3 rounded border border-slate-300 h-32"
      ></textarea>
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
      >
        Send Message
      </button>
    </form>
  );
}
