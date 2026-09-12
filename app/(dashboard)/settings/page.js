"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    async function fetchSubscription() {
      try {
        const response = await fetch(
          `/api/subscription-status?email=${user.email}`,
        );
        const data = await response.json();
        setSubscription(data);
      } catch (err) {
        console.log("Error fetching subscription:", err.message);
      }
    }

    fetchSubscription();
  }, [user, router]);

  function getDaysLeft(timestamp) {
    if (!timestamp) return null;
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = timestamp - now;
    const daysLeft = Math.ceil(secondsLeft / 86400);
    return daysLeft > 0 ? daysLeft : 0;
  }

  function getPlanLabel(priceId) {
    if (priceId === "price_1UEgq6Gm3PCZpJoNqcQV0nBD") {
      return "Summarist Premium — Annual Plan";
    }
    if (priceId === "price_1UEgmLGm3PCZpJoNtx7zyNxf") {
      return "Summarist Premium — Monthly Plan";
    }
    return "Basic";
  }

  function getRenewalDaysLeft(sub) {
    if (!sub?.trialEnd) return null;
    const isAnnual = sub.priceId === "price_1UEgq6Gm3PCZpJoNqcQV0nBD";
    const planDurationInSeconds = isAnnual ? 365 * 86400 : 30 * 86400;
    const renewalTimestamp = sub.trialEnd + planDurationInSeconds;
    return getDaysLeft(renewalTimestamp);
  }

  if (!user) return null;

  return (
    <div className="settings__wrapper">
      <h1 className="settings__title">Settings</h1>
      <div className="settings__block">
        <div className="settings__label">Your Subscription plan</div>
        <div className="settings__value">
          {subscription?.status === "basic" || !subscription
            ? "Basic"
            : getPlanLabel(subscription.priceId)}
        </div>
        {subscription?.trialEnd && (
          <div className="settings__value">
            {getRenewalDaysLeft(subscription)} days until renewal
          </div>
        )}
        {(subscription?.status === "basic" || !subscription) && (
          <Link href="/choose-plan" className="btn settings__upgrade-btn">
            Upgrade to Premium
          </Link>
        )}
      </div>
      <div className="settings__block">
        <div className="settings__label">Email</div>
        <div className="settings__value">{user.email}</div>
      </div>
    </div>
  );
}
