import AuthLayout from '@/components/AuthLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check password match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
  

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      console.log(res.data)

      // Store token
      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ Success toast
      toast.success(res.data.message);

      // ✅ Redirect after a short delay
      setTimeout(() => {
        router.push("/posts"); // or "/login"
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <h1 className="text-5xl font-bold mb-12 font-serif">Register</h1>

        <form onSubmit={handleSubmit} className="text-black flex flex-col w-82">
          <label htmlFor="fullName" className="mb-1 ml-1">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={form.name}
            className="bg-[#E8DFCA] focus:outline-none rounded-lg h-10 w-full text-black font-semibold mb-3 px-4 py-2"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label htmlFor="email" className="mb-1 ml-1">Email</label>
          <input
            type="email"
            id="email"
            value={form.email}
            className="bg-[#E8DFCA] focus:outline-none rounded-lg h-10 w-full text-black font-semibold mb-3 px-4 py-2"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label htmlFor="password" className="mb-1 ml-1">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            className="bg-[#E8DFCA] focus:outline-none rounded-lg h-10 w-full text-black font-semibold mb-3 px-4 py-2"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label htmlFor="confirmPassword" className="mb-1 ml-1">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={`bg-[#E8DFCA] focus:outline-none border rounded-lg h-10 w-full text-black font-semibold mb-3 px-4 py-2 ${
              error ? "border-red-500" : "border-none"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            className="bg-[#AEBDCA] px-4 py-2 text-black text-lg font-semibold rounded-lg mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <span className="flex items-center w-full my-3">
            <div className="flex-grow h-[1px] bg-zinc-400"></div>
            <p className="mx-2 text-zinc-400">OR</p>
            <div className="flex-grow h-[1px] bg-zinc-400"></div>
          </span>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post("/api/auth/google", {
                  token: credentialResponse.credential,
                });
                localStorage.setItem("token", res.data.token);
                toast.success("Welcome " + res.data.user.name);
                router.push('/posts');
              } catch (err) {
                console.error("Google login error:", err.response?.data || err);
                toast.error("Google login failed");
              }
            }}
            onError={() => toast.error("Google login failed")}
          />


          <p className="ml-1 mt-3">
            Back for more?{" "}
            <Link href="/auth/login" className="font-medium text-sky-800 hover:text-sky-950 underline">
              Login
            </Link>
          </p>
        </form>
    </AuthLayout>
  );
}
