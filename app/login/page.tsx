//@ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase"; // ✅ make sure this file exports these

export default function StudyCommunityLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ User logged in successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (name) {
          await updateProfile(user, { displayName: name });
        }

        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          email: user.email,
          name: name || "",
          bio: "",
          profilePicture: "",
          role: "student",
          createdAt: serverTimestamp(),
        });

        console.log("✅ User registered successfully!");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication Error:", error);
      alert(`Authentication failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handles Google Sign-In
  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // --- Check if user exists ---
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          userId: user.uid,
          email: user.email,
          name: user.displayName || "",
          bio: "",
          profilePicture: user.photoURL || "",
          role: "student",
          createdAt: serverTimestamp(),
        });
      }

      console.log("✅ Google login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Google Auth Error:", error);
      alert(`Google Sign-In failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-600 to-purple-300 relative overflow-hidden">
      {/* Background visuals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-10">📚</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-10">✏️</div>
        <div className="absolute bottom-1/4 left-1/3 text-7xl opacity-10">🎓</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-10">💡</div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Study<span className="text-orange-400">Buddy</span>
            </h1>
            <p className="text-orange-300 text-sm font-medium">Your Learning Community Awaits</p>
          </div>

          {/* Auth Card */}
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-500/20 overflow-hidden">
            {/* Tabs */}
            <div className="flex bg-gray-900/50 p-1 m-4 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                    : "text-gray-400 hover:text-orange-300"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                    : "text-gray-400 hover:text-orange-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? "Welcome Back, Scholar! 👋" : "Join Our Community! 🚀"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isLogin
                    ? "Continue your learning journey"
                    : "Start learning with thousands of students"}
                </p>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-orange-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 hover:scale-105 disabled:opacity-50 transition-all duration-300"
                >
                  {isLoading
                    ? "Processing..."
                    : isLogin
                    ? "Sign In to Learn"
                    : "Create Account"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-center text-gray-400 text-sm mb-4">
                  {isLogin ? "Or continue with" : "Quick signup with"}
                </p>
                <button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white hover:border-orange-500 hover:bg-gray-900 transition-all duration-300"
                >
                  Continue with Google
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-xs mt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
