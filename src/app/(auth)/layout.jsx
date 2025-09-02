
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function AuthLayout({ children }) {
  return (
    <>
      <AuthRedirect>{children}</AuthRedirect>
    </>
  );
}
