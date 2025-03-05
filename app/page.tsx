"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "./utils/services/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Show success message
      toast.success(`Welcome back, ${response.user.name}!`);

      // Redirect based on role
      if (response.user.role === "admin") {
        router.push("/admin/students");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center animated-gradient">
      <form
        onSubmit={handleLogin}
        className="glass-effect p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Welcome Back
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FiEyeOff color="#666" size={20} />
              ) : (
                <FiEye color="#666" size={20} />
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30"
            } text-white font-semibold transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50`}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <p className="text-white/70 text-sm text-center mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-white hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
