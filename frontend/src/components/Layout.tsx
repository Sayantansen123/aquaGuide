import { ReactNode } from "react";
import Navbar from "./Navbar";
import SecondaryNav from "./SecondaryNav";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SecondaryNav />
      <div className="h-[40px]"></div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
