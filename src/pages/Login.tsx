import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Siren, Mail, KeyRound, User, ArrowRight, RefreshCw } from "lucide-react";
import { loginUser, DUMMY_OTP } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

type Step = "form" | "otp";

const Login = () => {
  const [step, setStep] = useState<Step>("form");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSentAt, setOtpSentAt] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (mode === "signup" && !name) return;
    setLoading(true);
    setTimeout(() => {
      setStep("otp");
      setOtpSentAt(Date.now());
      setLoading(false);
      toast({
        title: "OTP Sent!",
        description: `A dummy OTP (123456) has been sent to ${email}`,
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join("");
    if (entered.length !== 6) return;

    // Check expiry (5 min)
    if (Date.now() - otpSentAt > 5 * 60 * 1000) {
      toast({ title: "OTP Expired", description: "Please resend the OTP", variant: "destructive" });
      return;
    }

    if (entered !== DUMMY_OTP) {
      toast({ title: "Invalid OTP", description: "Please enter the correct OTP (hint: 123456)", variant: "destructive" });
      return;
    }

    loginUser(email, name || email.split("@")[0]);
    toast({ title: "Welcome!", description: "You have been logged in successfully" });
    navigate("/");
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpSentAt(Date.now());
    toast({ title: "OTP Resent", description: "A new OTP has been sent (hint: 123456)" });
  };

  const remainingSeconds = Math.max(0, Math.ceil((otpSentAt + 5 * 60 * 1000 - Date.now()) / 1000));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl mb-2">
            <Siren className="w-8 h-8 text-primary" />
            EmergencyLocator
          </a>
          <p className="text-muted-foreground">Secure access with email OTP verification</p>
        </div>

        <div className="glass-card p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-secondary p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setStep("form"); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("signup"); setStep("form"); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "signup" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                🔒 Dummy mode — use OTP <span className="font-mono font-bold text-primary">123456</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center">
                <KeyRound className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit OTP sent to <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:brightness-110 transition-all"
              >
                Verify & {mode === "login" ? "Login" : "Sign Up"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={handleResend} className="flex items-center gap-1 text-primary hover:underline">
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
                <span className="text-muted-foreground">
                  Expires in {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, "0")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Change email
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
