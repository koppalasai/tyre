import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

export default function Signup() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setForm((s: FormState) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user) {
        setMessage("Signup successful — you can now sign in.");
      } else {
        setMessage(
          "Check your email for a confirmation link (if email confirmations are enabled)."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create an Account
          </h2>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>

            <Link
              to="/signin"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {message && (
            <p className="text-sm text-green-600 text-center">{message}</p>
          )}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Footer */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}