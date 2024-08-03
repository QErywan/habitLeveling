import { NextAuthProvider } from "@/components/Auth/AuthProvider";

export default function DashboardLayout({ children }) {
  return (
  <NextAuthProvider>{children}</NextAuthProvider>);
}