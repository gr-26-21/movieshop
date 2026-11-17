// A layout component for the public pages of the application
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
