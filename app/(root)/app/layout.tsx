import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      
      <Sidebar />
      <MobileNav />
      <div className="root-container bg-white dark:bg-black h-full max-h-screen">
        <header className='p-4 flex justify-end h-[72px] '> 
          {/* <ThemeToggle/> */}
          </header>
        <div className="wrapper bg-gray-100 dark:bg-black h-[calc(100vh-72px)] overflow-y-scroll">
          {children}
        </div>
      </div>
      
      <Toaster />
    </main>
  )
}

export default Layout