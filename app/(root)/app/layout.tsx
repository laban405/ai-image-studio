import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      
      <Sidebar />
      <MobileNav />

      <div className="root-container bg-gray-100 dark:bg-black">
        <header className='p-4 flex justify-end'> <ThemeToggle/></header>
        <div className="wrapper">
          {children}
        </div>
      </div>
      
      <Toaster />
    </main>
  )
}

export default Layout