import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoGuides from "./pages/VideoGuides";
import TextGuides from "./pages/TextGuides";
import SpeciesDictionary from "./pages/SpeciesDictionary";
import CommunityForum from "./pages/CommunityForum";
import CommunityChat from "./pages/CommunityChat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./store/store";
import PublicRoute from "./routes/publicRoute";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/privateRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import { authApi } from "./api/modules/auth";
import { useEffect } from "react";
import { setRole } from "./store/userSlice";
import ViewTextGuide from "./pages/ViewTextGuide";

const queryClient = new QueryClient();

const App = () => {
  const userid = localStorage.getItem("userid");
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    const createGuest = async () => {
      try {
        const res = authApi.createGuest();
      } catch (error) {}
    };

    if (!userid) {
      createGuest();
    }
  }, []);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await authApi.getRole(userid);
        console.log(res?.data?.role || "user");
        dispatch(setRole(res?.data?.role || "user"));
      } catch (error) {
        return "user";
      }
    };

    if (userid) {
      getRoles();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/video-guides"
              element={
                <Layout>
                  <VideoGuides />
                </Layout>
              }
            />
            <Route
              path="/text-guides"
              element={
                <Layout>
                  <TextGuides />
                </Layout>
              }
            />
            <Route
              path="/species-dictionary"
              element={
                <Layout>
                  <SpeciesDictionary />
                </Layout>
              }
            />
            <Route
              path="/community-forum"
              element={
                <Layout>
                  <CommunityForum />
                </Layout>
              }
            />

            <Route element={<PrivateRoute />}>
              <Route
                path="/profile"
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
            </Route>
            {role === "admin" || role === "support" ? (
              <Route element={<PrivateRoute />}>
                <Route
                  path="/admin"
                  element={
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  }
                />
              </Route>
            ) : (
              <Route
                path="/admin"
                element={<div className="bg-green-500/10 h-100vh"></div>}
              />
            )}

            <Route
              path="/community-chat"
              element={
                <Layout>
                  <CommunityChat />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/view/text/:textIds"
              element={
                <Layout>
                  <ViewTextGuide />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
            <Route
              path="/faq"
              element={
                <Layout>
                  <FAQ />
                </Layout>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
