from fastapi import FastAPI
import pandas as pd
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware

# Ensure NLTK stopwords are available
nltk.download("stopwords")
from nltk.corpus import stopwords

# Initialize FastAPI
app = FastAPI()

# Allow requests from your frontend (React running on localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Load AI tools dataset
df = pd.read_csv(
    "all_ai_tool.csv"
)  # Ensure the CSV file is in the same directory as main.py

# Initialize TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["Description"].fillna(""))


@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}


@app.get("/search/")
def search_tools(query: str = ""):
    """Return all AI tools if no query is given; otherwise, perform a search."""
    if not query:  # If no search query, return full dataset (ALL tools)
        results = df[["AI Tool Name", "Description", "Tool Link"]].to_dict(
            orient="records"
        )
        return {"query": query, "results": results}

    # Otherwise, do similarity search
    query_tfidf = vectorizer.transform([query])
    similarities = cosine_similarity(query_tfidf, tfidf_matrix).flatten()

    # Get top 5 matching tools
    top_indices = similarities.argsort()[-5:][::-1]
    results = df.iloc[top_indices][
        ["AI Tool Name", "Description", "Tool Link"]
    ].to_dict(orient="records")

    return {"query": query, "results": results}


# Run FastAPI if script is executed directly
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
