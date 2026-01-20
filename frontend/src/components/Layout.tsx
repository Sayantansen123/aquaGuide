import { ReactNode } from "react";
import Navbar from "./Navbar";
import SecondaryNav from "./SecondaryNav";
import Footer from "./Footer";
import SupportChat from "./SupportChat";

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
      <SupportChat />
    </div>
  );
};

export default Layout;
