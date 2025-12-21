import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Fish } from "lucide-react";
import { Toast } from "@radix-ui/react-toast";
import { authApi } from "@/api/modules/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthData } from "@/store/userSlice";
import SecondaryNav from "@/components/SecondaryNav";
import UsernameSuggestionPopover from "@/components/UsernameSuggestionPopover";
import PasswordValidationPopover from "@/components/PasswordValidationPopover";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    userid: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    role: "user",
  });
  const [termsAccepted, setTermsAccepted] = useState<Boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showUsernamePopover, setShowUsernamePopover] = useState(false);
  const [showPasswordPopover, setShowPasswordPopover] = useState(false);
  const [usernamePopoverShown, setUsernamePopoverShown] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);

  useEffect(() => {
    if (formData.userid.length >= 6 && !usernamePopoverShown) {
      setShowUsernamePopover(true);
      setUsernamePopoverShown(true);
    }
  }, [formData.userid, usernamePopoverShown]);

  const handleUsernameSelect = (userid: string) => {
    setFormData({ ...formData, userid });
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    setPasswordConfirmed(false);
    if (value.length > 0) {
      setShowPasswordPopover(true);
    } else {
      setShowPasswordPopover(false);
    }
  };

  const handlePasswordConfirm = () => {
    setPasswordConfirmed(true);
    setShowPasswordPopover(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(formData);

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Fish className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">Join Our School of Fish!</h1>
          <p className="text-muted-foreground">
            Start your aquatic journey with fellow enthusiasts
          </p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to join the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="aquarist123"
                    value={formData.userid}
                    onChange={(e) => {
                      setFormData({ ...formData, userid: e.target.value });
                      if (e.target.value.length < 6) {
                        setUsernamePopoverShown(false);
                        setShowUsernamePopover(false);
                      }
                    }}
                    required
                    minLength={6}
                  />
                  {formData.userid.length > 0 && formData.userid.length < 6 && (
                    <p className="text-xs text-muted-foreground">
                      {6 - formData.userid.length} more characters needed
                    </p>
                  )}
                  {showUsernamePopover && formData.userid.length >= 6 && (
                    <UsernameSuggestionPopover
                      baseUsername={formData.userid}
                      onSelect={handleUsernameSelect}
                      onClose={() => setShowUsernamePopover(false)}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="rather_not_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    className={
                      passwordConfirmed ? "border-green-500 pr-10" : ""
                    }
                  />
                  {passwordConfirmed && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs font-medium">
                      ✓ Valid
                    </span>
                  )}
                </div>
                {showPasswordPopover && formData.password.length > 0 && (
                  <PasswordValidationPopover
                    password={formData.password}
                    onConfirm={handlePasswordConfirm}
                    onClose={() => setShowPasswordPopover(false)}
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted as boolean}
                  onCheckedChange={() => setTermsAccepted((prev) => !prev)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the terms and conditions
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="ocean"
                disabled={!termsAccepted}
              >
                {loading ? "Loading....." : "Join the Reef"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
