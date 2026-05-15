import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, FlashIcon, BrainIcon, CrownIcon, ChartUpIcon } from "hugeicons-react";
import { Hexagon } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Props = {
  onLogin: () => void;
  onGoRegister: () => void;
};

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{
          background: "var(--mm-brand-mark-bg)",
          border: "1px solid var(--mm-brand-mark-border)",
          color: "var(--mm-brand-mark-color)",
        }}
      >
        <Hexagon size={16} strokeWidth={2.2} />
      </div>
      <span style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800 }}>
        Mine<span style={{ color: "var(--mm-brand-text-accent)" }}>Mind</span>
      </span>
    </div>
  );
}

function StyledInput({
  label,
  id,
  type = "text",
  placeholder,
  error,
  registration,
  showToggle,
  onToggle,
  showPass,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
  showToggle?: boolean;
  onToggle?: () => void;
  showPass?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} style={{ color: "var(--mm-text-2)", fontSize: "13px", fontWeight: 600 }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showToggle ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
          {...registration}
          className={`w-full rounded-xl px-4 py-3 outline-none transition-colors duration-200 ${showToggle ? "auth-password-input pr-10" : ""}`}
          style={{
            background: "var(--mm-surface-3)",
            border: `1px solid ${error ? "var(--mm-red)" : "var(--mm-border-2)"}`,
            color: "var(--mm-text)",
            fontSize: "14px",
            fontFamily: "var(--font-mabry)",
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={showPass ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--mm-text-3)" }}
          >
            <EyeIcon size={16} color="var(--mm-text-3)" />
          </button>
        )}
      </div>
      {error && <p style={{ color: "var(--mm-red)", fontSize: "12px" }}>{error}</p>}
    </div>
  );
}

export function LoginPage({ onLogin, onGoRegister }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    onLogin();
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--mm-bg)", fontFamily: "var(--font-mabry)" }}>
      <aside
        className="hidden lg:flex flex-col p-12"
        style={{
          width: "420px",
          flexShrink: 0,
          background: "var(--mm-surface-1)",
          borderRight: "1px solid var(--mm-border)",
        }}
      >
        <div>
          <div className="mb-16">
            <BrandMark />
          </div>

          <h2 style={{ color: "var(--mm-text)", fontSize: "32px", fontWeight: 800, lineHeight: 1.15, marginBottom: "16px" }}>
            Think strategically.<br />
            <span style={{ color: "var(--mm-amber)" }}>Play differently.</span>
          </h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "15px", lineHeight: 1.7, marginBottom: "40px" }}>
            Sign in to keep your streaks, daily challenge history, and training stats in sync.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { icon: <FlashIcon size={15} color="var(--mm-amber)" />, text: "Daily challenge progress" },
              { icon: <BrainIcon size={15} color="var(--mm-blue)" />, text: "AI Coach preferences" },
              { icon: <CrownIcon size={15} color="var(--mm-purple)" />, text: "Leaderboard identity" },
              { icon: <ChartUpIcon size={15} color="var(--mm-green)" />, text: "Mode records and streak stats" },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
                  {feature.icon}
                </div>
                <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 mt-12" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}>
          <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>Welcome back</p>
          <p style={{ color: "var(--mm-text-3)", fontSize: "12px", lineHeight: 1.6 }}>
            Your profile unlocks saved sessions, rankings, and progress across devices.
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <BrandMark />
          </div>

          <div className="mb-8">
            <h1 style={{ color: "var(--mm-text)", fontSize: "28px", fontWeight: 800, marginBottom: "6px" }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--mm-text-3)", fontSize: "14px" }}>Sign in to continue your streak</p>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3 transition-colors duration-200"
            style={{
              background: "var(--mm-surface-2)",
              border: "1px solid var(--mm-border-2)",
              color: "var(--mm-text)",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-mabry)",
            }}
          >
            <GoogleIcon fontSize="small" />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--mm-border-2)" }} />
            <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "var(--mm-border-2)" }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <StyledInput
              label="Email address"
              id="email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              registration={register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />

            <StyledInput
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              registration={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              showToggle
              onToggle={() => setShowPass((value) => !value)}
              showPass={showPass}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--mm-amber)" }}
                />
                <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>Remember me</span>
              </label>
              <button type="button" style={{ color: "var(--mm-amber)", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-mabry)" }}>
                Forgot password?
              </button>
            </div>

            {authError && (
              <p style={{ color: "var(--mm-red)", fontSize: "13px", textAlign: "center" }}>
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-3.5 mt-1 transition-colors duration-200 disabled:opacity-60"
              style={{
                background: "var(--mm-action-bg)",
                color: "var(--mm-action-fg)",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "var(--font-mabry)",
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8" style={{ color: "var(--mm-text-3)", fontSize: "14px" }}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onGoRegister}
              style={{ color: "var(--mm-amber)", fontWeight: 700, fontFamily: "var(--font-mabry)" }}
            >
              Create one
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
