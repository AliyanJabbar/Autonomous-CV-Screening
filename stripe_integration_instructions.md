# Instructions for Antigravity: Stripe Embedded Checkout Integration

## 🎯 Goal
Implement Stripe's **Embedded Checkout** for a SaaS application. The architecture consists of a Next.js frontend and a FastAPI backend. 
The backend handles business logic, Stripe secrets, and webhooks. The frontend strictly handles rendering the pre-built Stripe UI using a publishable key and a client secret.

## 🛠 Tech Stack & Tooling
- **Frontend**: Next.js (React)
- **Backend**: FastAPI (Python)
- **Backend Package Manager**: `uv`
- **Database**: PostgreSQL (for subscription state)
- **Payment Gateway**: Stripe (Embedded UI Mode)

---

## 📋 Phase 1: Environment & Dependencies Setup

### 1. Backend (FastAPI) Setup
Use `uv` to manage the Python dependencies. Execute the following to install Stripe and related packages:
```bash
uv add stripe pydantic-settings
```
**Environment Variables (`.env` in backend):**
```env
STRIPE_SECRET_KEY=sk_test_...         # OR sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...       # For verifying webhook signatures
FRONTEND_URL=http://localhost:3000    # Your Next.js URL
```

### 2. Frontend (Next.js) Setup
Install Stripe's official React and JS libraries:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```
**Environment Variables (`.env.local` in frontend):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # OR pk_live_...
NEXT_PUBLIC_API_URL=http://localhost:8000      # Your FastAPI URL
```

---

## ⚙️ Phase 2: Backend Implementation (FastAPI)

### 1. Create Checkout Session Endpoint
Create a `POST /payments/create-checkout-session` endpoint.
- **Responsibility**: Initialize a Stripe Checkout Session in `embedded` mode.
- **Requirements**:
  - Set `ui_mode="embedded"`.
  - Set `return_url="{FRONTEND_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}"`.
  - Return exactly the `client_secret` (extracted from the session object).

**Instruction for AI**: Implement the endpoint handling user context (e.g., fetching their internal user ID to attach to `client_reference_id` or `metadata` so it can be tracked in the webhook).

### 2. Stripe Webhook Endpoint (Critical)
Create a `POST /webhooks/stripe` endpoint.
- **Responsibility**: Securely listen for Stripe events (specifically `checkout.session.completed`) and update PostgreSQL to provision the SaaS subscription.
- **Requirements**:
  - You **MUST** read the raw request body (`await request.body()`) to verify the Stripe signature. Do not use standard Pydantic JSON parsing for this endpoint.
  - Verify the signature using `stripe.Webhook.construct_event()`.
  - Handle the `checkout.session.completed` event asynchronously to avoid Stripe timeouts.
  - Update the user's subscription status in PostgreSQL based on the `client_reference_id` or `metadata`.

---

## 🖥 Phase 3: Frontend Implementation (Next.js)

### 1. The Checkout Component
Instead of vanilla DOM mounting, use Stripe's official React wrappers for a clean Next.js integration.
- **Responsibility**: Fetch the `clientSecret` from FastAPI and render the embedded UI.
- **Requirements**:
  - Initialize Stripe using `loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)`.
  - Create a `fetchClientSecret` function that calls the FastAPI `/payments/create-checkout-session` endpoint via `POST` and returns the `clientSecret` string.
  - Wrap the checkout area in `<EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>`.
  - Inside the provider, render `<EmbeddedCheckout />`.

### 2. The Return/Success Page
Create a route at `/checkout/return`.
- **Responsibility**: Display the success state after the user completes the embedded checkout.
- **Requirements**: 
  - Grab the `session_id` from the URL query parameters.
  - (Optional) Call a FastAPI endpoint to get the session status (`GET /payments/session-status?session_id=...`) to display a personalized "Thank you" message. 
  - **Note**: Do *not* provision the database from this page. Database provisioning is strictly handled by the Webhook.

---

## 🚨 Strict Rules & Constraints for Antigravity

1. **Zero Secret Leakage**: NEVER put `sk_live_...` or `STRIPE_SECRET_KEY` in the Next.js environment. Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is allowed on the frontend.
2. **Source of Truth**: The Webhook is the ONLY valid trigger to activate a user's subscription in PostgreSQL. The frontend return URL is purely cosmetic.
3. **Webhook Raw Body**: In FastAPI, webhooks will fail signature verification if the body is parsed as JSON before validation. Extract the raw bytes using `request.body()`.
4. **React Best Practices**: On the Next.js side, ensure the `stripePromise` is initialized *outside* of component render cycles so it doesn't recreate the Stripe instance on every render.

## 📝 Example File Structure Output Expected from AI

Generate the code for the following files based on the instructions above:

1. `backend/requirements.txt` (or equivalent `pyproject.toml` managed by `uv`)
2. `backend/routers/payments.py` (Contains `/create-checkout-session` and `/webhooks/stripe`)
3. `frontend/app/checkout/page.tsx` (Contains the `EmbeddedCheckout` implementation)
4. `frontend/app/checkout/return/page.tsx` (Contains the return URL logic)