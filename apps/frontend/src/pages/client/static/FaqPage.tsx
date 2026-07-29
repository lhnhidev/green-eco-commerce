import StaticPageLayout from '@layouts/StaticPageLayout'
import { Accordion } from '@mantine/core'

const faqs = [
  {
    question: 'How is shipping calculated?',
    answer: 'Shipping is free on every order — the total you see at checkout is the total you pay, no surprises.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Unused items in their original condition can be returned within 30 days of delivery for a full refund. See our Returns & Refunds page for the full process.',
  },
  {
    question: 'How do Green Points work?',
    answer:
      'Every order earns Green Points based on the CO₂ your purchase saved. Points sit in your Green Wallet and can be redeemed for a discount at checkout (20 points = $1 off), though they can\'t be combined with a coupon on the same order.',
  },
  {
    question: 'What do the carbon footprint numbers mean?',
    answer:
      'Each product page shows its carbon footprint (in kg CO₂e) next to a conventional baseline for the same type of product, so you can see exactly how much lower its impact is.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery, bank transfer, and MoMo Wallet at checkout.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Sign in and open "My Orders" to see the status of every order you\'ve placed, including delivery address and items.',
  },
]

const FaqPage = () => (
  <StaticPageLayout title="Frequently Asked Questions" path="/faq">
    <p>Answers to the questions we hear most. Can't find what you're looking for?</p>
    <div className="not-prose mt-6">
      <Accordion variant="separated" radius="lg">
        {faqs.map((faq) => (
          <Accordion.Item key={faq.question} value={faq.question}>
            <Accordion.Control className="font-semibold text-gray-800">{faq.question}</Accordion.Control>
            <Accordion.Panel className="text-gray-600">{faq.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  </StaticPageLayout>
)

export default FaqPage
