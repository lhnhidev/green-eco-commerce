import StaticPageLayout from '@layouts/StaticPageLayout'
import { LeafIcon, RecycleIcon, ShieldCheckIcon, TruckIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

const impactStats = [
  { icon: LeafIcon, label: 'Kilograms of CO₂e saved', value: 'Tracked on every order' },
  { icon: RecycleIcon, label: 'Recycled & biodegradable materials', value: 'Flagged on every product' },
  { icon: ShieldCheckIcon, label: 'Quality guarantee', value: '30 days on every order' },
  { icon: TruckIcon, label: 'Shipping', value: 'Free on every order' },
]

const AboutPage = () => (
  <StaticPageLayout title="About GreenCart" path="/about">
    <p>
      GreenCart exists to make sustainable living an easy, everyday choice. We source and sell products with a lower
      environmental footprint than their conventional counterparts — and we show you the numbers behind that claim, not
      just the marketing.
    </p>
    <p>
      Every product on GreenCart carries a carbon footprint index compared against a conventional baseline, along with
      how much of it is biodegradable or recyclable. When you check out, we total up the CO₂ your order avoided and add
      it to your order history — sustainability you can actually track, order by order.
    </p>

    <h2 id="impact" className="scroll-mt-24">
      Our Impact
    </h2>
    <p>
      We believe transparency is the most useful thing we can offer. That's why every product page shows its carbon
      footprint next to the conventional baseline, and every order confirmation shows the CO₂ saved on that specific
      purchase — not a vague company-wide estimate.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {impactStats.map((stat) => (
        <div key={stat.label} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
            <stat.icon size={18} weight="fill" className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>

    <h2>What we stand for</h2>
    <ul>
      <li>Every product discloses its materials and their end-of-life impact.</li>
      <li>We favor recycled, biodegradable, and organic materials wherever a viable option exists.</li>
      <li>We'd rather show a modest, honest number than an inflated marketing claim.</li>
    </ul>

    <p>
      Have a question about a specific product's sourcing or impact numbers?{' '}
      <Link to="/contact">Reach out to our team</Link> — we're happy to talk through it.
    </p>
  </StaticPageLayout>
)

export default AboutPage
