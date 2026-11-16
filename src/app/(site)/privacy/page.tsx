import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

// Starter text describing what this website actually collects. Have it reviewed by your legal
// adviser and replace it with your approved policy before go-live.
const text = `
## What this website collects

**Enquiries.** When you send a message through our contact form we store your name, email address, company, phone number if given, and your message, so that we can reply.

**Job applications.** When you apply for a role we store your name, contact details, any note you add and the CV you upload, so that our talent team can assess your application.

**Analytics.** We may use analytics tools to understand how the site is used, in aggregate.

## How we use it

We use this information only for the purpose it was given: to respond to your enquiry or to consider your application. We do not sell personal data.

## Retention

Enquiries and applications are kept only for as long as needed for those purposes and are then deleted.

## Your choices

To ask for a copy of your data, a correction or deletion, email **${site.email}**.

## Contact

${site.legalName}, 10th Floor, Imperia Mindspace, Sector 62, Gurugram 122098, Haryana, India.
`;

export default function PrivacyPage() {
  return (
    <section className="bg-white py-20">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Privacy notice</h1>
        <Markdown className="mt-6">{text}</Markdown>
      </div>
    </section>
  );
}
