"""
Compatibility re-export for backend/routers/payments.py
Delegates to routes.payments
"""
from routes.payments import (
    router,
    webhook_router,
    create_checkout_session,
    get_session_status,
    stripe_webhook_endpoint,
    handle_stripe_webhook,
    PRICE_ID_MAP,
)

__all__ = [
    "router",
    "webhook_router",
    "create_checkout_session",
    "get_session_status",
    "stripe_webhook_endpoint",
    "handle_stripe_webhook",
    "PRICE_ID_MAP",
]
