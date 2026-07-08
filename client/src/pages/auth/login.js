import AuthLayout from "@/components/AuthLayout";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      router.push("/posts");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-5xl font-bold mb-18 font-serif w-96">
        Welcome Back!
      </h1>

      {/* --- Email/Password login --- */}
      <form onSubmit={handleSubmit} className="text-black flex flex-col w-82">
        <label htmlFor="email" className="mb-1 ml-1">
          Email
        </label>
        <input
          type="text"
          id="email"
          value={form.email}
          className="bg-[#E8DFCA] focus:outline-none rounded-lg h-10 w-full text-black font-semibold mb-3 px-[1.2rem] py-[0.75rem]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label htmlFor="password" className="mb-1 ml-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={form.password}
          className="bg-[#E8DFCA] focus:outline-none rounded-lg h-10 w-full text-black font-semibold mb-3 px-[1.2rem] py-[0.75rem]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="bg-[#AEBDCA] px-[1.2rem] py-[0.75rem] text-black text-lg font-semibold rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <span className="flex items-center w-full my-3">
          <div className="flex-grow h-[2px] bg-zinc-400"></div>
          <p className="mx-2 text-zinc-400">OR</p>
          <div className="flex-grow h-[2px] bg-zinc-400"></div>
        </span>
      </form>

      {/* --- Google login --- */}
      <div className="w-82">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await axios.post("/api/auth/google", {
                token: credentialResponse.credential,
              });

              localStorage.setItem("token", res.data.token);
              toast.success("Welcome back " + (res.data.user?.name || ""));
              router.push("/posts");
            } catch (err) {
              console.error(err);
              toast.error("Google login failed");
            }
          }}
          onError={() => toast.error("Google login failed")}
        />

        <p className="ml-1 mt-1 self-start">
          New here?{" "}
          <Link
            href="/auth/register"
            className="font-medium underline text-sky-800 hover:text-sky-950"
          >
            Join us today!
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
