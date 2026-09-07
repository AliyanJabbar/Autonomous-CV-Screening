from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoints():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert any("create-checkout-session" in ep for ep in data["endpoints"])
    assert any("webhooks/stripe" in ep for ep in data["endpoints"])

def test_webhook_missing_signature():
    response = client.post(
        "/webhooks/stripe",
        content=b"{}",
        headers={"Content-Type": "application/json"}
    )
    # Must reject without signature
    assert response.status_code == 400
    assert "Missing stripe-signature header" in response.json()["detail"]

def test_webhook_alias_missing_signature():
    response = client.post(
        "/payments/webhook",
        content=b"{}",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 400
    assert "Missing stripe-signature header" in response.json()["detail"]

def test_session_status_invalid():
    # Will attempt to retrieve from Stripe with key or error
    response = client.get("/payments/session-status?session_id=cs_test_invalid123")
    # If key is not configured, returns 500 or 400
    assert response.status_code in (400, 500)

def test_create_hosted_checkout_session():
    response = client.post("/payments/create-checkout-session", json={"plan": "pro", "interval": "month"})
    assert response.status_code == 200
    data = response.json()
    assert "url" in data and data["url"] is not None
    assert data["url"].startswith("https://checkout.stripe.com/")
    assert "sessionId" in data

def test_profile_usage():
    # Test default anonymous / new user profile usage
    response = client.get("/payments/profile-usage")
    assert response.status_code == 200
    data = response.json()
    assert data["plan"] == "starter"
    assert data["total_credits"] == 10
    assert data["credits_remaining"] >= 0

    # Test record usage endpoint
    rec_res = client.post("/payments/record-usage", json={"user_id": "test_user_profile_123"})
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["status"] == "success"
    assert rec_data["credits_used"] >= 1

if __name__ == "__main__":
    test_root_endpoints()
    test_webhook_missing_signature()
    test_webhook_alias_missing_signature()
    test_session_status_invalid()
    test_create_hosted_checkout_session()
    test_profile_usage()
    print("All payment endpoint tests passed!")


