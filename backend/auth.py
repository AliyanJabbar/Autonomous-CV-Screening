from fastapi import Header, HTTPException, status
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET") or os.getenv("NEXTAUTH_SECRET")
ALGORITHM = "HS256"

if not BETTER_AUTH_SECRET:
    raise RuntimeError("BETTER_AUTH_SECRET is not set in environment variables")

def verify_jwt_token(token: str) -> str:
    """
    Cryptographically verifies the Better Auth JWT using BETTER_AUTH_SECRET.
    Validates signature, expiration, and extracts the user identifier from the 'sub' claim.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing"
        )
    try:
        payload = jwt.decode(
            token,
            BETTER_AUTH_SECRET,
            algorithms=[ALGORITHM],
            options={"verify_signature": True, "verify_exp": True}
        )
        user_id = payload.get("sub") or payload.get("id") or payload.get("email")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: 'sub' claim missing"
            )
        return user_id
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

def get_current_user(authorization: str = Header(None)) -> str:
    """
    FastAPI dependency for HTTP endpoints.
    Expects Bearer <token> in Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Missing or invalid Authorization header"
        )

    token = authorization.split(" ")[1]
    return verify_jwt_token(token)

def verify_websocket_token(token: str) -> str:
    """
    Verification helper for WebSocket connections.
    """
    return verify_jwt_token(token)
