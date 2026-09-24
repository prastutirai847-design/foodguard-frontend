"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getAuthLabels, type AuthLabels } from "@/data/auth-labels";
import { AuthTabs, type AuthTab } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { useAuth } from "@/components/AuthProvider";
import { apiUrl } from "@/lib/network/api-url";

const LANGUAGE_STORAGE_KEY = "app-preferred-language";

function getInitialLabels(): AuthLabels {
  try {
    const stored = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return getAuthLabels(stored);
  } catch {
    /* sessionStorage may be unavailable */
  }
  return getAuthLabels("en");
}

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [labels] = useState<AuthLabels>(getInitialLabels);
  const router = useRouter();
  const { login, firebaseMode, continueAsGuest: continueAsGuestFirebase } = useAuth();
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState("");

  const continueAsGuest = useCallback(async () => {
    setGuestLoading(true);
    setGuestError("");
    try {
      if (firebaseMode) {
        await continueAsGuestFirebase();
        router.push("/");
        return;
      }
      const response = await fetch(apiUrl("/api/auth/guest"), { method: "POST" });
      const json = (await response.json()) as {
        success: boolean;
        data?: { token: string };
        error?: { message?: string } | null;
      };
      if (!response.ok || !json.success || !json.data?.token) {
        setGuestError(json.error?.message ?? labels.guest.error);
        return;
      }
      login(json.data.token);
      router.push("/");
    } catch {
      setGuestError(labels.guest.error);
    } finally {
      setGuestLoading(false);
    }
  }, [login, router, labels.guest.error, firebaseMode, continueAsGuestFirebase]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Desktop side panel with soft branding backdrop */}
        <div className="hidden flex-1 items-center justify-center border-r border-border/60 bg-gradient-to-br from-primary/8 via-accent/40 to-background p-12 lg:flex">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/25 shadow-sm">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-11"
                aria-hidden="true"
              >
                <path
                  d="M24 8c-2.5 0-4.5 2-4.5 4.5v2.2c-6.2 1.4-10.5 7-10.5 13.3 0 7.7 6.3 14 14 14s14-6.3 14-14c0-6.3-4.3-11.9-10.5-13.3V12.5C28.5 10 26.5 8 24 8z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 22h8M24 18v8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="34"
                  cy="34"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  d="M38.5 38.5L42 42"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {labels.sidePanel.heading}
            </h1>
            <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
              {labels.sidePanel.description}
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                Barcode Scanner
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                FSSAI Checks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                Health Ratings
              </span>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:max-w-xl lg:py-16">
          <div className="w-full max-w-sm">
            {/* Back link */}
            <Link
              href="/"
              className="group mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              Back to Home
            </Link>

            {/* Mobile logo (visible on mobile only) */}
            <div className="mb-6 flex items-center gap-3 sm:hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  aria-hidden="true"
                >
                  <path
                    d="M24 8c-2.5 0-4.5 2-4.5 4.5v2.2c-6.2 1.4-10.5 7-10.5 13.3 0 7.7 6.3 14 14 14s14-6.3 14-14c0-6.3-4.3-11.9-10.5-13.3V12.5C28.5 10 26.5 8 24 8z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 22h8M24 18v8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="34"
                    cy="34"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M38.5 38.5L42 42"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                FoodGuard
              </span>
            </div>

            <AuthTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              loginLabel="Sign In"
              signupLabel="Create Account"
            />

            <div className="mt-7">
              {activeTab === "login" ? (
                <LoginForm
                  labels={labels.login}
                  validationLabels={labels.validation}
                  onCreateAccount={() => setActiveTab("signup")}
                />
              ) : (
                <SignupForm
                  labels={labels.signup}
                  validationLabels={labels.validation}
                  strengthLabels={labels.passwordStrength}
                  onSignIn={() => setActiveTab("login")}
                />
              )}
            </div>

            {/* Guest bypass: prominent, welcoming instant access */}
            <div className="mt-8">
              <AuthDivider text={labels.guest.orDivider} className="my-5" />
              <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-card via-card to-accent/30 p-5 shadow-xs transition-all hover:border-primary/40">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {labels.guest.heading}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Instant
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {labels.guest.note}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  disabled={guestLoading}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {guestLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      {labels.guest.loading}
                    </span>
                  ) : (
                    labels.guest.button
                  )}
                </button>
                {guestError && (
                  <p role="alert" className="mt-2.5 text-center text-xs text-destructive">
                    {guestError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
