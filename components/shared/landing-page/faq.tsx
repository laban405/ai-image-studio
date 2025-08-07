import {
  BadgeDollarSign,
  Route,
  ShieldCheck,
  Truck,
  Undo2,
  UserRoundCheck,
} from "lucide-react";

const faq = [
  {
    icon: Undo2,
    question: "Do I need editing experience?",
    answer:
      "Nope — just upload and choose your tool. We handle the magic.",
  },
  {
    icon: Route,
    question: "Are the edits high-resolution?",
    answer:
      "Yes, all outputs are HD and ready for publishing.",
  },
  {
    icon: Truck,
    question: "Do I need a subscription?",
    answer:
      "We use a credit-based system. You can top up credits as needed. A subscription plan is available for high-volume users and businesses.",
  },
  {
    icon: BadgeDollarSign,
    question: "What payment methods do you accept?",
    answer:
      "We accept M-PESA, ensuring secure payment options for all customers.",
  },
  {
    icon: ShieldCheck,
    question: "Is my data secure?",
    answer:
      "Absolutely. Your uploaded images are processed securely and deleted shortly after generation. We do not share or reuse your images.",
  },
  {
    icon: UserRoundCheck,
    question: "How can I contact customer support?",
    answer:
      "Reach out via email at imagestudio@mikrosell.com or call us at 0797313732 for assistance with any inquiries.",
  },
];

const FAQ = () => {
  return (
    <div
      id="faq"
      className="min-h-screen flex items-center justify-center px-6 py-12 xs:py-20"
    >
      <div className="max-w-screen-lg">
        <h2 className="text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 xs:text-lg text-center text-muted-foreground">
          Quick answers to common questions about our products and services.
        </p>

        <div className="mt-12 grid md:grid-cols-2 bg-background rounded-xl overflow-hidden outline outline-[1px] outline-border outline-offset-[-1px]">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 -mt-px -ml-px">
              <div className="h-8 w-8 xs:h-10 xs:w-10 flex items-center justify-center rounded-full bg-accent">
                <Icon className="h-4 w-4 xs:h-6 xs:w-6" />
              </div>
              <div className="mt-3 mb-2 flex items-start gap-2 text-lg xs:text-[1.35rem] font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p className="text-sm xs:text-base">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
