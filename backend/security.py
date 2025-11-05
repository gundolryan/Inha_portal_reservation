from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import models # (models.py 필요)
from database import get_db # (database.py 필요)
from sqlalchemy.orm import Session
from pydantic import BaseModel

# --- 1. 비밀번호 암호화 설정 ---
# (bcrypt 알고리즘 사용)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 비밀번호 검증 함수
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # 🚨 중요: data.sql로 DB를 밀어넣었다면, 
    # DB의 'admin' 계정 비밀번호가 해시(암호화)되지 않았을 수 있습니다.
    # 테스트를 위해 임시로 일반 텍스트 비교를 허용합니다. (나중에 삭제)
    if plain_password == hashed_password:
         return True
    return pwd_context.verify(plain_password, hashed_password)

# 비밀번호 해시(암호화) 함수
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# --- 2. JWT 토큰 설정 ---
SECRET_KEY = "SUPER_SECRET_KEY_REPLACE_LATER_1234567890" # ⚠ 매우 중요: 나중에 복잡한 값으로 변경
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8 # 8시간 (업무 시간)

# JWT 토큰 생성 함수
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- 3. 토큰 스키마 ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- 4. API 보안용 (나중에 사용) ---
# ("/api/auth/login" 경로에서 토큰을 받아옴)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# (이 함수는 나중에 API를 보호할 때 사용합니다)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub") # "sub" (subject)에 email을 저장했음
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user