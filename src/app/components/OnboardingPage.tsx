import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPinIcon, StarIcon } from "hugeicons-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { CityPicker } from "./CityPicker";
import { BrandMark, StyledInput } from "./RegisterPage";

type OnboardingStep = "username" | "city";

type FormData = {
  username: string;
  city: string;
};

type Props = {
  onComplete?: () => void;
};

export function OnboardingPage({ onComplete }: Props) {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("username");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, clearErrors, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { city: "" },
  });
  const city = watch("city");

  const onSubmit = async (data: FormData) => {
    setAuthError(null);

    if (step === "username") {
      setStep("city");
      return;
    }

    if (!user) {
      setAuthError("Your session expired. Please sign in again.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from("user_profiles")
      .insert({ user_id: user.id, username: data.username, city: data.city });
    setIsLoading(false);

    if (error) {
      setAuthError("Username taken or invalid.");
      setStep("username");
      return;
    }

    completeOnboarding();
    onComplete?.();
  };

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
            Finish setting up<br />
            <span style={{ color: "var(--mm-amber)" }}>your player profile.</span>
          </h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "14px", lineHeight: 1.7 }}>
            Choose a public username and home city so MineMind can place you on local and global leaderboards.
          </p>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--mm-pro-bg)", border: "1px solid var(--mm-border)" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
              <StarIcon size={15} color="var(--mm-purple)" />
            </div>
            <div>
              <p style={{ color: "var(--mm-purple)", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                One last move
              </p>
              <p style={{ color: "var(--mm-text-3)", fontSize: "12px", lineHeight: 1.5 }}>
                Your city can be changed later from your account data in Supabase.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <BrandMark />
          </div>

          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}>
              <MapPinIcon size={18} color="var(--mm-amber)" />
            </div>
            <h1 style={{ color: "var(--mm-text)", fontSize: "28px", fontWeight: 800, marginBottom: "6px" }}>
              Complete onboarding
            </h1>
            <p style={{ color: "var(--mm-text-3)", fontSize: "14px" }}>
              {step === "username" && "Choose the name other players will see"}
              {step === "city" && "Pick the city for your local leaderboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {step === "username" && (
              <StyledInput
                label="Username"
                id="onboarding-username"
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
              {step === "username" && "Continue"}
              {step === "city" && (isLoading ? "Finishing..." : "Enter MineMind")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
