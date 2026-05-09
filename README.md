Inventory SaaS - Project Documentation
  Overview
 #######################################
A high-performance inventory management dashboard built with Next.js 15, Supabase, and Tailwind CSS. Designed for real-time tracking, revenue metrics, and stock auditing.

 Tech Stack
#######################################
• Framework: Next.js (App Router)

• Database/Auth: Supabase

• Styling: Tailwind CSS + Framer Motion (Animations)

• Charts: Recharts

• Icons: Lucide-React

 Current Features
 #######################################
• Revenue Metrics: Dynamic chart with Daily (AM/PM), Weekly (Calendar-based), Monthly, and Yearly (2026 base) views.

• Stock Management: Stat cards for total products, units, and low-stock alerts.

• Transaction History: Real-time capture of latest sales with product details and price formatting.

• Currency Context: Global currency formatting for consistent pricing across the UI.

Future Updates & Roadmap
#######################################
• Advanced Audit Mode: Detailed stock discrepancy reporting.

• Multi-Currency Support: Expand beyond the primary currency context.

• Batch Operations: Bulk upload/edit for product inventory.

• User Role Permissions: Admin vs. Staff access levels.

Environment Setup
Required keys in `.env.local` and Vercel:

• `NEXT_PUBLIC_SUPABASE_URL`

• `NEXT_PUBLIC_SUPABASE_ANON_KEY`

 Deployment
 #######################################
Deployed via Vercel. Ensure environment variables are configured in the Vercel Project Settings before building.
