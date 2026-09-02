import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/lib/adminAuth";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = adminLogin(email, password);
      if (result.success) {
        toast.success("Welcome back");
        navigate("/admin");
      } else {
        setError(result.error || "Invalid credentials.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--brand-charcoal))] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="brand-name text-3xl text-white tracking-[0.2em]">
            LINE<sup className="text-[0.55em] align-super">°</sup>
          </span>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-xs font-medium tracking-wider uppercase text-white/70 block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              autoComplete="email"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-terracotta))] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium tracking-wider uppercase text-white/70 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[hsl(var(--brand-terracotta))] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-1"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-3">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[hsl(var(--brand-terracotta))] text-white py-3.5 text-xs font-semibold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
