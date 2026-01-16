import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import VideoGuides from "./pages/VideoGuides";
import TextGuides from "./pages/TextGuides";
import SpeciesDictionary from "./pages/SpeciesDictionary";
import CommunityForum from "./pages/CommunityForum";
import CommunityChat from "./pages/CommunityChat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/privateRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import { authApi } from "./api/modules/auth";
import { useEffect } from "react";
import { setRole, setAuthData } from "./store/userSlice"; // Added setAuthData
import ViewTextGuide from "./pages/ViewTextGuide";
import ViewFish from "./pages/ViewFish";
import ViewForum from "./pages/ViewForum";
import PhGuide from "./pages/PhGuide";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  // Always select from Redux, not localStorage, for reactivity
  const { role, userid, isLoggedIn } = useSelector((state: RootState) => state.user);

  // 1. Handle Guest Creation
  useEffect(() => {
    const initGuest = async () => {
      if (!userid && !isLoggedIn) {
        try {
          await authApi.createGuest();
        } catch (error) {
          console.error("Failed to create guest session", error);
        }
      }
    };
    initGuest();
  }, [userid, isLoggedIn]);

  // 2. Sync Role on Refresh
  useEffect(() => {
    const verifySession = async () => {
      if (userid && isLoggedIn) {
        try {
          const res = await authApi.getRole(userid);
          if (res?.data?.role) {
            dispatch(setRole(res.data.role));
          }
        } catch (error) {
          console.error("Session verification failed");
          // If the token is invalid or user not found, you might want to logout here
        }
      }
    };
    verifySession();
  }, [userid, isLoggedIn, dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes inside Layout */}
            <Route element={<Layout><Home /></Layout>} path="/" />
            <Route element={<Layout><VideoGuides /></Layout>} path="/video-guides" />
            <Route element={<Layout><TextGuides /></Layout>} path="/text-guides" />
            <Route element={<Layout><SpeciesDictionary /></Layout>} path="/species-dictionary" />
            <Route element={<Layout><CommunityForum /></Layout>} path="/community-forum" />
            <Route element={<Layout><CommunityChat /></Layout>} path="/community-chat" />
            <Route element={<Layout><About /></Layout>} path="/about" />
            <Route element={<Layout><Contact /></Layout>} path="/contact" />
            <Route element={<Layout><FAQ /></Layout>} path="/faq" />
            <Route element={<Layout><PhGuide /></Layout>} path="/phguide" />
            
            {/* Dynamic Public Routes */}
            <Route element={<Layout><ViewFish /></Layout>} path="/view/fish/:id" />
            <Route element={<Layout><ViewForum /></Layout>} path="/view/forum/:id" />
            <Route element={<Layout><ViewTextGuide /></Layout>} path="/view/text/:textIds" />

            {/* PROTECTED ROUTES (Logged in Users Only) */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout><Profile /></Layout>} path="/profile" />
              
              {/* ADMIN ONLY ROUTES */}
              {(role === "admin" || role === "support") ? (
                <Route
                  path="/admin"
                  element={
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  }
                />
              ) : (
                // If they are logged in but NOT admin, redirect them away from /admin
                <Route path="/admin" element={<Navigate to="/" replace />} />
              )}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;