import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authApi } from "@/api/modules/auth";
import { toast } from "sonner";
import { setAuthData } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Mail, Calendar, UserCircle, CheckCircle2 } from "lucide-react";
import PasswordValidationPopover from "@/components/PasswordValidationPopover";
import UsernameSuggestionPopover from "@/components/UsernameSuggestionPopover";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: "login" | "register";
}

const AuthModal = ({ isOpen, onOpenChange, defaultView = "login" }: AuthModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [registerData, setRegisterData] = useState({
    name: "",
    userid: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    role: "user",
  });
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showPasswordPopover, setShowPasswordPopover] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showUsernamePopover, setShowUsernamePopover] = useState(false);
  const [usernamePopoverShown, setUsernamePopoverShown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(defaultView === "register");
    }
  }, [isOpen, defaultView]);

  // Ported Username Logic
  useEffect(() => {
    if (registerData.userid.length >= 6 && !usernamePopoverShown) {
      setShowUsernamePopover(true);
      setUsernamePopoverShown(true);
    }
  }, [registerData.userid, usernamePopoverShown]);

  const handleUsernameSelect = (userid: string) => {
    setRegisterData({ ...registerData, userid });
    setShowUsernamePopover(false);
  };

  const handlePasswordChange = (value: string) => {
    setRegisterData({ ...registerData, password: value });
    setPasswordConfirmed(false);
    setShowPasswordPopover(value.length > 0);
  };

  const handlePasswordConfirm = () => {
    setPasswordConfirmed(true);
    setShowPasswordPopover(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email: loginEmail, password: loginPassword });
      dispatch(setAuthData(res.data.user));
      toast.success("Login successful!");
      onOpenChange(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(registerData);
      toast.success("Registration successful! Please log in.");
      setIsFlipped(false);
      setLoginEmail(registerData.email);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for input styling to keep it DRY
  const inputClasses = "h-[50px] rounded-[30px] bg-background border border-border text-foreground px-6 pr-12 focus-visible:ring-0";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 w-auto max-w-none overflow-visible">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>{isFlipped ? "Register Account" : "Login to Your Account"}</DialogTitle>
          </DialogHeader>
        </VisuallyHidden.Root>

        <div className="perspective-1000 w-[450px] sm:w-[500px] h-[750px] relative">
          <div className="relative h-full bg-card/95 backdrop-blur-xl border border-border rounded-[25px] shadow-2xl text-foreground overflow-hidden">
            
            {/* Top Header Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center bg-muted w-[140px] h-[60px] rounded-b-[20px] shadow-sm z-10">
              <span className="text-xl font-bold tracking-tight">{isFlipped ? "Register" : "Login"}</span>
            </div>
            
            <div className="pt-24 p-8 h-full">
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                
                {/* LOGIN SIDE */}
                <div className="absolute w-full h-full backface-hidden flex flex-col justify-center">
                   <form onSubmit={handleLogin} className="space-y-5 w-full">
                      <div className="relative">
                        <Input
                          type="text"
                          className={inputClasses}
                          placeholder="Email or Username"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                        <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="relative">
                        <Input
                          type={showLoginPassword ? "text" : "password"}
                          className={inputClasses}
                          placeholder="Password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>

                      <Button type="submit" className="w-full h-[50px] rounded-[30px] text-lg font-semibold" variant="ocean" disabled={loading}>
                        {loading ? "Loading..." : "Login"}
                      </Button>

                      <div className="text-center mt-4 text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <button type="button" className="text-primary font-bold hover:underline ml-1" onClick={() => setIsFlipped(true)}>Register</button>
                      </div>
                   </form>
                </div>

                {/* REGISTER SIDE */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col">
                   <form onSubmit={handleRegister} className="space-y-4 w-full overflow-y-auto pr-2 custom-scrollbar">
                      {/* Name */}
                      <div className="relative">
                        <Input
                          className={inputClasses}
                          placeholder="Full Name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                          required
                        />
                        <UserCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>

                      {/* Username + Popover */}
                      <div className="relative">
                        <Input
                          className={`${inputClasses} ${registerData.userid.length >= 6 ? "border-green-500/50" : ""}`}
                          placeholder="Username (min 6 chars)"
                          value={registerData.userid}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, userid: e.target.value });
                            if (e.target.value.length < 6) {
                              setUsernamePopoverShown(false);
                              setShowUsernamePopover(false);
                            }
                          }}
                          required
                        />
                        <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        {showUsernamePopover && (
                          <div className="absolute z-50 w-full top-full mt-1">
                             <UsernameSuggestionPopover 
                                baseUsername={registerData.userid} 
                                onSelect={handleUsernameSelect}
                                onClose={() => setShowUsernamePopover(false)}
                             />
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Input
                          type="email"
                          className={inputClasses}
                          placeholder="Email Address"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                        />
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>

                      {/* DOB & Gender Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Input
                            type="date"
                            className="h-[50px] rounded-[30px] bg-background border border-border px-4 text-xs"
                            value={registerData.dob}
                            onChange={(e) => setRegisterData({...registerData, dob: e.target.value})}
                            required
                          />
                        </div>
                        <Select 
                          value={registerData.gender} 
                          onValueChange={(v) => setRegisterData({...registerData, gender: v})}
                        >
                          <SelectTrigger className="h-[50px] rounded-[30px] bg-background border border-border px-4">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Password + Popover */}
                      <div className="relative">
                        <Input
                          type={showRegisterPassword ? "text" : "password"}
                          className={`${inputClasses} ${passwordConfirmed ? "border-green-500 pr-16" : ""}`}
                          placeholder="Password"
                          value={registerData.password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          required
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                           {passwordConfirmed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                           <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="text-muted-foreground">
                             {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                           </button>
                        </div>
                        {showPasswordPopover && (
                           <div className="absolute z-50 w-full top-full mt-1">
                             <PasswordValidationPopover 
                                password={registerData.password}
                                onConfirm={handlePasswordConfirm}
                                onClose={() => setShowPasswordPopover(false)}
                             />
                           </div>
                        )}
                      </div>

                      {/* Terms */}
                      <div className="flex items-center space-x-2 px-2 py-1">
                        <Checkbox 
                          id="terms-modal" 
                          checked={termsAccepted} 
                          onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                        />
                        <label htmlFor="terms-modal" className="text-[11px] leading-tight text-muted-foreground">
                          I agree to the terms and conditions
                        </label>
                      </div>

                      <Button type="submit" className="w-full h-[50px] rounded-[30px] text-lg font-semibold" variant="ocean" disabled={!termsAccepted || loading}>
                        {loading ? "Creating Account..." : "Join the Reef"}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground pb-4">
                        Already have an account?{" "}
                        <button type="button" className="text-primary font-bold hover:underline ml-1" onClick={() => setIsFlipped(false)}>Login</button>
                      </div>
                   </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </Dialog>
  );
};

export default AuthModal;