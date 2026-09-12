"use client";

async function handleCheckout(priceId, isAnnual) {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, isAnnual }),
    });

    const data = await response.json();
    window.location.href = data.url;
  } catch (err) {
    console.log("Checkout error:", err.message);
  }
}

export default function ChoosePlanPage() {
  return (
    <div className="container">
      <h1 className="subscription__header">Choose Your Plan</h1>
      <div className="subscription__wrapper">
        <div className="subscription__card">
          <h2>Monthly</h2>
          <p className="subscription__price">$9.99 / month</p>
          <p className="subscription__desc">
            Full access, billed every month. Cancel anytime.
          </p>
          <button
            className="btn subscription__btn"
            onClick={() =>
              handleCheckout("price_1UEgmLGm3PCZpJoNtx7zyNxf", false)
            }
          >
            Select
          </button>
        </div>
        <div className="subscription__card">
          <h2>Annual</h2>
          <p className="subscription__price">$59.99 / year</p>
          <p className="subscription__desc">
            Save over 50% compared to monthly billing. Includes a 7-day free
            trial.
          </p>
          <button
            className="btn subscription__btn"
         onClick={() => handleCheckout("price_1UEgq6Gm3PCZpJoNqcQV0nBD", true)}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
