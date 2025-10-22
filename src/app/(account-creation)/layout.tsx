import Header from "@/app/ui/account-creation/Header/Header";
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
