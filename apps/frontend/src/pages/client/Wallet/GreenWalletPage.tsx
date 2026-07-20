import { useGetGreenWallet } from '@api'
import { useAuth } from '@hooks/useAuth'
import { Anchor, Badge, Breadcrumbs, RingProgress, Table, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { BiLeaf } from 'react-icons/bi'
import { FiArrowUpRight } from 'react-icons/fi'
import { MdOutlineShoppingBag } from 'react-icons/md'
import { Link } from 'react-router'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Green Wallet', href: '/green-wallet' },
].map((item) => (
  <Anchor href={item.href} key={item.href} size="sm">
    {item.title}
  </Anchor>
))

const GreenWalletPage = () => {
  const { user } = useAuth()
  const userId = (user as { id?: string })?.id ?? ''

  const { data: wallet, isLoading } = useGetGreenWallet(userId, {
    query: { enabled: !!userId },
  })

  const progress = wallet ? Math.min((wallet.balance / Math.max(wallet.earnedTotal, 1)) * 100, 100) : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <div className="flex items-center gap-3 mb-6">
        <BiLeaf className="text-2xl text-primary" />
        <h1 className="text-2xl font-bold text-gray-800">Green Wallet</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading wallet…</div>
      ) : !wallet ? (
        <div className="text-center py-16 text-gray-400">Wallet not found.</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Balance Card */}
            <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white col-span-1 sm:col-span-1 flex flex-col justify-between">
              <p className="text-green-100 text-sm font-medium">Current Balance</p>
              <div className="flex items-end justify-between mt-4">
                <span className="text-4xl font-bold">{wallet.balance.toLocaleString()}</span>
                <BiLeaf size={32} className="text-green-200 mb-1" />
              </div>
              <p className="text-green-100 text-xs mt-1">Green Points</p>
            </div>

            {/* Total Earned */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <p className="text-gray-400 text-sm font-medium">Total Earned</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{wallet.earnedTotal.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">All-time points</p>
            </div>

            {/* Progress */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
              <RingProgress
                size={90}
                thickness={8}
                sections={[{ value: progress, color: 'green' }]}
                label={
                  <Text ta="center" size="xs" fw={700} c="green">
                    {Math.round(progress)}%
                  </Text>
                }
              />
              <p className="text-gray-400 text-xs mt-2 text-center">Balance vs. Total Earned</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <BiLeaf size={20} className="text-green-500 mt-0.5 shrink-0" />
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
                Shop now <FiArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <MdOutlineShoppingBag className="text-gray-400" />
              <p className="font-semibold text-gray-700 text-sm">Transaction History</p>
              <Badge size="xs" variant="light" color="green" radius="xl" ml="auto">
                {wallet.transactions.length} records
              </Badge>
            </div>

            {wallet.transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No transactions yet.</div>
            ) : (
              <Table
                verticalSpacing={10}
                horizontalSpacing={14}
                highlightOnHover
                classNames={{
                  th: '!text-xs font-semibold! !uppercase !tracking-wide !text-gray-400 !bg-gray-50',
                  td: '!text-sm',
                }}
              >
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
                        <Table.Td className="text-gray-600!">{tx.description || '—'}</Table.Td>
                        <Table.Td className="text-gray-400!">{dayjs(tx.createdAt).format('DD/MM/YYYY HH:mm')}</Table.Td>
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
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default GreenWalletPage
