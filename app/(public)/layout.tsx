import MainNavbar from "@/components/main-navbar";

export default function PublicLayout({
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
