import ButtonCustomerPortal from "@/components/ButtonCustomerPortal";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout mx-auto">
        <ButtonCustomerPortal />
        <div className="main-content">{children}</div>
    </div>
  );
}