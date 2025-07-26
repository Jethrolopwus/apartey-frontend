   // app/admin/layout.tsx
   import Sidebar from '@/components/organisms/AdminSidebar';
   import Header from '@/components/organisms/AdminHeader';

   export default function AdminLayout({ children }: { children: React.ReactNode }) {
     return (
       <div className="flex min-h-screen bg-[#F8F9FB]">
         <Sidebar />
         <div className="flex flex-col flex-1 min-h-screen w-0 lg:ml-[20px]  bg-[#F8F9FB]">
           <Header />
           <main className="flex-1 w-full max-w-full px-0 pt-8 pb-8 mx-auto">{children}</main>
         </div>
       </div>
     );
   }