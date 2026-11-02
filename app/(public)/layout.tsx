import MainNavbar from "@/components/main-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <MainNavbar />
      {children}
    </main>
  );
}
