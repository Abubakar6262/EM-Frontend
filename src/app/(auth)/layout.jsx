export default function AuthLayout({
  children,
}) {
  return (
    <>
      {/* Auth pages use only RootLayout wrapper */}
      {children}
    </>
  );
}
