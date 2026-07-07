import HeaderAdmin from '../components/features/header-admin/HeaderAdmin'
import TheNavigation from '../components/features/navigation/TheNavigation'

const RootLayoutAdmin = () => {
  return (
    <div className="flex">
      <TheNavigation />
      <div className="px-8 pt-3 w-full h-15 bg-(--color-background) border-b border-b-[#e5e7e0]">
        <HeaderAdmin />
      </div>
    </div>
  )
}

export default RootLayoutAdmin
