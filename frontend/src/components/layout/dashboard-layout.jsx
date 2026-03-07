// components/layout/dashboard-layout.jsx
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}