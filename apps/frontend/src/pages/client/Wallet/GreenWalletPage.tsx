import { useGetGreenWallet } from '@api'
import Container from '@components/ui/primitives/Container'
import PageHeader from '@components/ui/primitives/PageHeader'
import Panel from '@components/ui/primitives/Panel'
import { Badge, RingProgress, Skeleton, Table, Text } from '@mantine/core'
import { ArrowUpRightIcon, LeafIcon, ShoppingBagIcon } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { Link } from 'react-router'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Green Wallet', href: '/green-wallet' },
]

const GreenWalletPage = () => {
  const { data: wallet, isLoading } = useGetGreenWallet()

  const progress = wallet ? Math.min((wallet.balance / Math.max(wallet.earnedTotal, 1)) * 100, 100) : 0

  return (
    <Container className="py-6">
      <PageHeader breadcrumbItems={breadcrumbItems} icon={LeafIcon} title="Green Wallet" />

      {isLoading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <Skeleton height={110} radius="lg" />
            <Skeleton height={110} radius="lg" />
            <Skeleton height={110} radius="lg" />
          </div>
          <Skeleton height={180} radius="lg" />
        </>
      ) : !wallet ? (
        <div className="text-center py-10 text-gray-400">Wallet not found.</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {/* Balance Card */}
            <div className="bg-primary rounded-lg p-5 text-white flex flex-col justify-between">
              <p className="text-white/80 text-sm font-medium">Current Balance</p>
              <div className="flex items-end justify-between mt-3">
                <span className="text-2xl font-semibold">{wallet.balance.toLocaleString()}</span>
                <LeafIcon size={24} className="text-white/70" />
              </div>
              <p className="text-white/80 text-xs mt-1">Green Points</p>
            </div>

            {/* Total Earned */}
            <Panel padding="md" className="flex flex-col justify-between">
              <p className="text-gray-400 text-sm font-medium">Total Earned</p>
              <p className="text-2xl font-semibold text-gray-800 mt-2">{wallet.earnedTotal.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">All-time points</p>
            </Panel>

            {/* Progress */}
            <Panel padding="md" className="flex flex-col items-center justify-center">
              <RingProgress
                size={72}
                thickness={6}
                sections={[{ value: progress, color: 'primary' }]}
                label={
                  <Text ta="center" size="xs" fw={700} c="primary">
                    {Math.round(progress)}%
                  </Text>
                }
              />
              <p className="text-gray-400 text-xs mt-2 text-center">Balance vs. Total Earned</p>
            </Panel>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-5 flex items-start gap-3">
            <LeafIcon size={18} className="text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">How to earn more points?</p>
              <p className="text-xs text-green-600 mt-0.5">
                Every eco-friendly purchase earns you Green Points. Use them at checkout to get discounts on your next
                order!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-xs text-green-700 font-medium mt-2 hover:underline"
              >
                Shop now <ArrowUpRightIcon size={12} />
              </Link>
            </div>
          </div>

          {/* Transaction History */}
          <Panel className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <ShoppingBagIcon className="text-gray-400" size={16} />
              <p className="font-semibold text-gray-700 text-sm">Transaction History</p>
              <Badge size="xs" variant="light" color="primary" ml="auto">
                {wallet.transactions.length} records
              </Badge>
            </div>

            {wallet.transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No transactions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Description</Table.Th>
                      <Table.Th w={130}>Date</Table.Th>
                      <Table.Th w={100} ta="right">
                        Points
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {[...wallet.transactions]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((tx) => (
                        <Table.Tr key={tx.id}>
                          <Table.Td className="text-gray-600">{tx.description || '—'}</Table.Td>
                          <Table.Td className="text-gray-400">
                            {dayjs(tx.createdAt).format('DD/MM/YYYY HH:mm')}
                          </Table.Td>
                          <Table.Td ta="right">
                            <span className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {tx.amount >= 0 ? '+' : ''}
                              {tx.amount}
                            </span>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </Panel>
        </>
      )}
    </Container>
  )
}

export default GreenWalletPage
