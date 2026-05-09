import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Changed bg-zinc-50 to bg-zinc-100 for better contrast against white cards
    <div className="relative flex min-h-screen bg-zinc-100 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 w-full transition-all duration-300 lg:ml-[280px]">
        {/* 
          The contrast between the bg-zinc-100 here and the bg-white 
          on your StatCards and Activity container will make them 
          look like they are floating.
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