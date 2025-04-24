from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import pandas as pd
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from database import SessionLocal, engine
from models import Base, User
from schemas import UserCreate, UserLogin

from jose import JWTError, jwt
from datetime import datetime, timedelta

# === JWT config ===

SECRET_KEY = "very-very-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# === Setup Section ===

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === AI Search Section ===

nltk.download("stopwords")
df = pd.read_csv("converted_file.csv")
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["Description"].fillna(""))


@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

# @app.get("/search/")
# def search_tools(query: str = ""):
#     if not query:
#         results = df[["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")
#         return {"query": query, "results": results}

#     query_tfidf = vectorizer.transform([query])
#     similarities = cosine_similarity(query_tfidf, tfidf_matrix).flatten()
#     top_indices = similarities.argsort()[-20:][::-1]
#     results = df.iloc[top_indices][["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")

#     return {"query": query, "results": results}



# @app.get("/search/")
# def search_tools(query: str = ""):
#     if not query:
#         results = df[["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")
#         return {"query": query, "results": results}

#     major_category_matches = df[df["Major Category"].str.contains(query, case=False, na=False)]
    
#     if not major_category_matches.empty:
#         results = major_category_matches[["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")
#         return {"query": query, "results": results}
    
#     query_tfidf = vectorizer.transform([query])
#     similarities = cosine_similarity(query_tfidf, tfidf_matrix).flatten()
#     top_indices = similarities.argsort()[-20:][::-1]
#     results = df.iloc[top_indices][["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")

#     return {"query": query, "results": results}

@app.get("/search/")
def search_tools(query: str = "", role: str = ""):
    if not role:
        raise HTTPException(status_code=400, detail="The 'role' parameter is required.")

    # Filter the DataFrame for the given role
    role_filtered_df = df[df["Category"].str.lower() == role.lower()]

    if role_filtered_df.empty:
        raise HTTPException(status_code=404, detail=f"No tools available for role: {role}")

    # Case 1: No search query — return all tools for the role
    if not query:
        results = role_filtered_df[["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")
        return {"query": query, "results": results, "matched_on": "All tools for role", "role": role}

    # Case 2: Search query provided — match on One Word column
    one_word_matches = role_filtered_df[role_filtered_df["One Word"].str.contains(query, case=False, na=False)]

    if not one_word_matches.empty:
        results = one_word_matches[["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")
        return {"query": query, "results": results, "matched_on": "One Word", "role": role}

    # Case 3: Fallback to cosine similarity on description
    vectorizer_role = TfidfVectorizer(stop_words="english")
    tfidf_matrix_role = vectorizer_role.fit_transform(role_filtered_df["Description"].fillna(""))

    query_tfidf = vectorizer_role.transform([query])
    similarities = cosine_similarity(query_tfidf, tfidf_matrix_role).flatten()
    top_indices = similarities.argsort()[-20:][::-1]
    results = role_filtered_df.iloc[top_indices][["AI Tool Name", "Description", "Tool Link", "One Word"]].to_dict(orient="records")

    return {"query": query, "results": results, "matched_on": "Description Cosine Similarity", "role": role}

# === Auth Section ===

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/create-user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    if not user.email.endswith("@tcetmumbai.in"):
        raise HTTPException(status_code=400, detail="Only @tcetmumbai.in emails are allowed.")
    
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_pw, role=user.role.lower())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created", "user": db_user.email}


@app.post("/login")
def login(user: UserLogin, role: str, db: Session = Depends(get_db)):
    if not user.email.endswith("@tcetmumbai.in"):
        raise HTTPException(status_code=400, detail="Only @tcetmumbai.in emails are allowed.")
    
    db_user = db.query(User).filter(User.email == user.email, User.role == role.lower()).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials or role")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": f"Login successful as {role}"
    }



# === Run App ===

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
