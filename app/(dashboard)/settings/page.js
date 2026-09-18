"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useState, useEffect } from "react";
import Skeleton from "../../components/Skeleton";
import { openModal } from "../../../store/slices/modalSlice";
import loginImage from "../../assets/login.png";

export default function SettingsPage() {
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.authLoading);
  const dispatch = useDispatch();
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchSubscription() {
      try {
        const response = await fetch(
          `/api/subscription-status?email=${user.email}`,
        );
        const data = await response.json();
        setSubscription(data);
      } catch (err) {
        console.log("Error fetching subscription:", err.message);
      } finally {
        setSubscriptionLoading(false);
      }
    }

    fetchSubscription();
  }, [user, authLoading]);

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

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="settings__wrapper">
        <h1 className="settings__title">Settings</h1>
        <div className="settings__logged-out">
          <img
            src={loginImage.src}
            alt="Log in required"
            className="settings__logged-out-img"
          />
          <p className="settings__logged-out-text">
            Log in to your account to see your details.
          </p>
          <button
            className="btn settings__login-btn"
            onClick={() => dispatch(openModal())}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings__wrapper">
      <h1 className="settings__title">Settings</h1>
      <div className="settings__block">
        <div className="settings__label">Your Subscription plan</div>
        {subscriptionLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Skeleton width="180px" height="20px" />
            <Skeleton width="140px" height="16px" />
            <Skeleton width="160px" height="36px" borderRadius="6px" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
      <div className="settings__block">
        <div className="settings__label">Email</div>
        {subscriptionLoading ? (
          <Skeleton width="200px" height="20px" />
        ) : (
          <div className="settings__value">{user.email}</div>
        )}
      </div>
    </div>
  );
}