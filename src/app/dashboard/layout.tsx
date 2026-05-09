import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Ensure the root container is the light color
    <div className="relative flex min-h-screen bg-zinc-50 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 w-full transition-all duration-300 lg:ml-[280px]">
        {/* 
          Added w-full and removed any horizontal overflow 
          to ensure it fills the gap left by the hidden sidebar
        */}
        <div className="min-h-screen px-4 py-20 sm:px-8 lg:py-10 text-zinc-900">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}