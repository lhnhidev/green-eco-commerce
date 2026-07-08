import { FaMoneyBillAlt } from 'react-icons/fa'
import CardDisplayNumber from '../../components/features/cards/CardDisplayNumber'

const Dashboard = () => {
  return (
    <div className="px-8 py-5 bg-[#f9f9f9]">
      <div className="italic text-gray-600 mb-4 text-lg">Here is what happen with GreenEcoCommerce today</div>
      <div className="flex gap-7">
        <CardDisplayNumber
          icon={<FaMoneyBillAlt />}
          title="Total Revenue"
          subtitle="123.456.789"
          isGrowth={true}
          showDolarIcon={true}
          showPercentIcon={true}
          growthValue={16.5}
        />
        <CardDisplayNumber
          icon={<FaMoneyBillAlt />}
          title="Total Revenue"
          subtitle="123.456.789"
          isGrowth={true}
          showDolarIcon={true}
          showPercentIcon={true}
          growthValue={16.5}
        />
        <CardDisplayNumber
          icon={<FaMoneyBillAlt />}
          title="Total Revenue"
          subtitle="123.456.789"
          isGrowth={true}
          showDolarIcon={true}
          showPercentIcon={true}
          growthValue={16.5}
        />
        <CardDisplayNumber
          icon={<FaMoneyBillAlt />}
          title="Total Revenue"
          subtitle="123.456.789"
          isGrowth={true}
          showDolarIcon={true}
          showPercentIcon={true}
          growthValue={16.5}
        />
      </div>
    </div>
  )
}

export default Dashboard
