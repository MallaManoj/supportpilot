import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          How can we help?
        </h2>

        <p className="mt-2 text-gray-500">
          Ask a question about your product, account, orders, or subscription.
        </p>

        <ChatWindow />

        <ChatInput />
      </section>
    </main>
  );
}