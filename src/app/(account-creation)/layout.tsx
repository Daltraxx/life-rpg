
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Create Account</h1>
      {children}
    </div>
  );
}
