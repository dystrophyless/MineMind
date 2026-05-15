import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useRef, useState, type ClipboardEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon } from "hugeicons-react";
import { Hexagon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { CityPicker } from "./CityPicker";

type Props = {
  onRegister: () => void;
  onGoLogin: () => void;
};

type RegisterStep = "credentials" | "code" | "username" | "city";

type FormData = {
  email: string;
  password: string;
  username: string;
  code: string;
  city: string;
};

const CODE_LENGTH = 6;

export function BrandMark() {
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

export function StyledInput({
  label,
  id,
  type = "text",
  placeholder,
  hint,
  error,
  registration,
  showToggle,
  onToggle,
  showPass,
  inputMode,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  hint?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  showToggle?: boolean;
  onToggle?: () => void;
  showPass?: boolean;
  inputMode?: "text" | "email" | "numeric";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} style={{ color: "var(--mm-text-2)", fontSize: "13px", fontWeight: 600 }}>
          {label}
        </label>
        {hint && <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{hint}</span>}
      </div>
      <div className="relative">
        <input
          id={id}
          type={showToggle ? (showPass ? "text" : "password") : type}
          inputMode={inputMode}
          placeholder={placeholder}
          autoComplete={type === "password" ? "new-password" : type === "email" ? "email" : "off"}
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

export function RegisterPage({ onRegister, onGoLogin }: Props) {
  const [step, setStep] = useState<RegisterStep>("credentials");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeDigits, setCodeDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [verifiedUserId, setVerifiedUserId] = useState<string | null>(null);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { register, handleSubmit, getValues, setValue, clearErrors, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { city: "" },
  });

  useEffect(() => {
    if (step !== "code") {
      return;
    }

    const focusTimer = window.setTimeout(() => codeInputRefs.current[0]?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [step]);

  const updateCodeDigits = (nextDigits: string[]) => {
    setCodeDigits(nextDigits);
    setValue("code", nextDigits.join(""), { shouldDirty: true });
    clearErrors("code");
  };

  const handleCodeChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");
    const nextDigits = [...codeDigits];
    nextDigits[index] = digits ? digits[digits.length - 1] : "";

    updateCodeDigits(nextDigits);

    if (digits && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      codeInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);

    if (!pastedDigits) {
      return;
    }

    event.preventDefault();

    const nextDigits = Array(CODE_LENGTH).fill("");
    pastedDigits.split("").forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    updateCodeDigits(nextDigits);
    codeInputRefs.current[Math.min(pastedDigits.length, CODE_LENGTH - 1)]?.focus();
  };

  const onSubmit = async (data: FormData) => {
    setAuthError(null);

    if (step === "credentials") {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      setIsLoading(false);
      if (error) { setAuthError(error.message); return; }
      setPendingEmail(data.email);
      setStep("code");
      return;
    }

    if (step === "code") {
      setIsLoading(true);
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: data.code,
        type: "email",
      });
      setIsLoading(false);
      if (verifyError) {
        setAuthError(verifyError.message);
        return;
      }

      const userId = verifyData.user?.id;
      if (!userId) {
        setAuthError("Could not confirm your account. Please try again.");
        return;
      }

      setVerifiedUserId(userId);
      setStep("username");
      return;
    }

    if (step === "username") {
      setStep("city");
      return;
    }

    // step === "city"
    const userId = verifiedUserId;
    if (!userId) {
      setAuthError("Could not finish registration. Please verify your email again.");
      setStep("code");
      return;
    }

    setIsLoading(true);
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({ user_id: userId, username: data.username, city: data.city });
    setIsLoading(false);
    if (profileError) {
      setAuthError("Username taken or invalid.");
      setStep("username");
      return;
    }

    onRegister();
  };

  const email = getValues("email");
  const city = watch("city");

  return (
    <div className="min-h-screen flex" style={{ background: "var(--mm-bg)", fontFamily: "var(--font-mabry)" }}>
      <aside
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          width: "420px",
          flexShrink: 0,
          background: "var(--mm-surface-1)",
          borderRight: "1px solid var(--mm-border)",
        }}
      >
        <div>
          <div className="mb-14">
            <BrandMark />
          </div>

          <h2 style={{ color: "var(--mm-text)", fontSize: "30px", fontWeight: 800, lineHeight: 1.2, marginBottom: "14px" }}>
            Your mind is your<br />
            <span style={{ color: "var(--mm-amber)" }}>greatest weapon.</span>
          </h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "14px", lineHeight: 1.7 }}>
            Create your account and start training your strategic instincts with daily challenges, saved stats, and global competition.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-9">
            {[
              { value: "Free", label: "Forever", color: "var(--mm-green)" },
              { value: "Live", label: "Real rankings", color: "var(--mm-blue)" },
              { value: "Daily", label: "New challenge", color: "var(--mm-amber)" },
              { value: "Stats", label: "Progress saved", color: "var(--mm-purple)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4"
                style={{
                  background: "var(--mm-surface-2)",
                  border: "1px solid var(--mm-border)",
                }}
              >
                <p style={{ color: stat.color, fontSize: "20px", fontWeight: 800 }}>{stat.value}</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <BrandMark />
          </div>

          <div className="mb-8">
            <h1 style={{ color: "var(--mm-text)", fontSize: "28px", fontWeight: 800, marginBottom: "6px" }}>
              Create your account
            </h1>
            <p style={{ color: "var(--mm-text-3)", fontSize: "14px" }}>
              {step === "credentials" && "Enter your email and password"}
              {step === "code" && `Confirm the code sent to ${email || "your email"}`}
              {step === "username" && "Choose the name other players will see"}
              {step === "city" && "Pick the city for your local leaderboard"}
            </p>
          </div>

          {step === "credentials" && (
            <>
              <button
                type="button"
                onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })}
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
                <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>or use email</span>
                <div className="flex-1 h-px" style={{ background: "var(--mm-border-2)" }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {step === "credentials" && (
              <>
                <StyledInput
                  label="Email address"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  inputMode="email"
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
                  placeholder="Create a password"
                  error={errors.password?.message}
                  registration={register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                  showToggle
                  onToggle={() => setShowPass((value) => !value)}
                  showPass={showPass}
                />
              </>
            )}

            {step === "username" && (
              <StyledInput
                label="Username"
                id="username"
                placeholder="strategist_42"
                hint="Shown on leaderboards"
                error={errors.username?.message}
                registration={register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                  maxLength: { value: 20, message: "Max 20 characters" },
                  pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Letters, numbers and _ only" },
                })}
              />
            )}

            {step === "city" && (
              <>
                <input
                  type="hidden"
                  {...register("city", { required: "City is required" })}
                />
                <CityPicker
                  value={city}
                  onChange={(nextCity) => {
                    setValue("city", nextCity, { shouldDirty: true, shouldValidate: true });
                    clearErrors("city");
                  }}
                  error={errors.city?.message}
                />
              </>
            )}

            {step === "code" && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label id="code-label" style={{ color: "var(--mm-text-2)", fontSize: "13px", fontWeight: 600 }}>
                    Email code
                  </label>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>6 digits</span>
                </div>

                <input
                  type="hidden"
                  {...register("code", {
                    required: "Code is required",
                    pattern: { value: /^\d{6}$/, message: "Enter the 6 digit code" },
                  })}
                />

                <div className="grid grid-cols-6 gap-2" aria-labelledby="code-label">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        codeInputRefs.current[index] = element;
                      }}
                      type="text"
                      value={digit}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      aria-label={`Code digit ${index + 1}`}
                      onChange={(event) => handleCodeChange(index, event)}
                      onKeyDown={(event) => handleCodeKeyDown(index, event)}
                      onPaste={handleCodePaste}
                      className="h-14 min-w-0 rounded-xl text-center outline-none transition-colors duration-200"
                      style={{
                        background: "var(--mm-surface-3)",
                        border: `1px solid ${errors.code ? "var(--mm-red)" : "var(--mm-border-2)"}`,
                        color: "var(--mm-text)",
                        fontSize: "20px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mabry)",
                      }}
                    />
                  ))}
                </div>

                {errors.code?.message && <p style={{ color: "var(--mm-red)", fontSize: "12px" }}>{errors.code.message}</p>}
              </div>
            )}

            {authError && (
              <p style={{ color: "var(--mm-red)", fontSize: "13px", textAlign: "center", marginBottom: "8px" }}>
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || (step === "city" && !city)}
              className="w-full rounded-xl py-3.5 mt-1 transition-colors duration-200 disabled:opacity-60"
              style={{
                background: "var(--mm-action-bg)",
                color: "var(--mm-action-fg)",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "var(--font-mabry)",
              }}
            >
              {step === "credentials" && "Continue"}
              {step === "code" && (isLoading ? "Verifying..." : "Verify Code")}
              {step === "username" && "Continue"}
              {step === "city" && (isLoading ? "Finishing..." : "Finish Registration")}
            </button>
          </form>

          <p className="text-center mt-8" style={{ color: "var(--mm-text-3)", fontSize: "14px" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onGoLogin}
              style={{ color: "var(--mm-amber)", fontWeight: 700, fontFamily: "var(--font-mabry)" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
