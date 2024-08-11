import ButtonCustomerPortal from "@/components/ButtonCustomerPortal";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout mx-auto">
        <ButtonCustomerPortal />
        <div className="main-content bg-base-100">{children}</div>
    </div>
  );
}