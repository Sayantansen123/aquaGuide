import { ReactNode } from "react";
import Navbar from "./Navbar";
import SecondaryNav from "./SecondaryNav";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default AdminLayout;
