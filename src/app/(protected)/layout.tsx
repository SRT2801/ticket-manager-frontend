import AuthGuard from "@/components/auth/auth-guard";
import Sidebar from "@/components/ui/sidebar";
import Topbar from "@/components/ui/topbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <Topbar />
        <main className="ml-64 flex-1 px-8 pb-12 pt-24">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
