import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fish } from "lucide-react";
import { authApi } from "@/api/modules/auth";
import { toast } from "sonner";
import { setAuthData } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import SecondaryNav from "@/components/SecondaryNav";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle login logic here
    try {
      const res = await authApi.login({ email, password });
      dispatch(setAuthData(res.data.user));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SecondaryNav />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Fish className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold mb-2">Welcome Back, Aquarist!</h1>
            <p className="text-muted-foreground">
              Dive back into your aquatic community
            </p>
          </div>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Email or Username</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="ocean">
                  {loading ? "Loading....." : "Dive in"}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/register"
                    className="text-primary hover:underline font-medium"
                  >
                    Join the reef
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
