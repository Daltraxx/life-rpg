import Header from "@/app/ui/account-creation/Header/Header";
import Footer from "@/app/ui/account-creation/Footer/Footer";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
