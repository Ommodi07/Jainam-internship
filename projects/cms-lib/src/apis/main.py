from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query, Path
from contextlib import asynccontextmanager

class Card(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    bankName: str
    maxCredit: float
    active: bool
    recommendedScore: str
    interestRate: float
    annualFee: float
    termsAndConditions: str

def get_db_connection():
    conn = sqlite3.connect("CardDetails.db")
    conn.row_factory = sqlite3.Row
    return conn

@asynccontextmanager
async def lifespan(app: FastAPI):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        bankName TEXT NOT NULL,
        maxCredit REAL NOT NULL,
        active BOOLEAN NOT NULL,
        recommendedScore TEXT NOT NULL,
        interestRate REAL NOT NULL,
        annualFee REAL NOT NULL,
        termsAndConditions TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()
    yield
    
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/cards", response_model=Card)
def create_card(card: Card):
    conn = get_db_connection()
    cursor = conn.cursor()
    print("Card details got ",card)
    cursor.execute("""
        INSERT INTO items (id, name, description, bankName, maxCredit, active, recommendedScore, interestRate, annualFee, termsAndConditions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        card.id,
        card.name,
        card.description,
        card.bankName,
        card.maxCredit,
        card.active,
        card.recommendedScore,
        card.interestRate,
        card.annualFee,
        card.termsAndConditions
    ))
    conn.commit()
    conn.close()
    return card

@app.get("/cards", response_model=List[Card])
def get_cards():
    conn = get_db_connection()
    items = conn.execute("SELECT * FROM items").fetchall()
    conn.close()
    return [Card(**dict(item)) for item in items]

@app.get("/cards/{card_id}", response_model=Card)
def get_card(card_id: int):
    conn = get_db_connection()
    item = conn.execute("SELECT * FROM items WHERE id = ?", (card_id,)).fetchone()
    conn.close()
    if item is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return Card(**dict(item))

@app.put("/cards/{card_id}", response_model=Card)
def update_card(card_id: int, card: Card):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE items SET
            name = ?, description = ?, bankName = ?, maxCredit = ?, 
            active = ?, recommendedScore = ?, interestRate = ?, annualFee = ?, termsAndConditions = ?
        WHERE id = ?
    """, ( card.name, card.description, card.bankName, card.maxCredit, card.active,
          card.recommendedScore, card.interestRate, card.annualFee, card.termsAndConditions, card_id))
    conn.commit()
    conn.close()
    return card

@app.delete("/cards/{card_id}")
def delete_card(card_id: int):
    conn = get_db_connection()
    conn.execute("DELETE FROM items WHERE id = ?", (card_id,))
    conn.commit()
    conn.close()
    return {"message": f"Card with id {card_id} deleted successfully"}

@app.get("/cards/search/name={name}", response_model=List[Card])
def search_cards(name: str = Path(..., min_length=1)):
    print(name)
    conn = get_db_connection()
    cursor = conn.cursor()
    pattern = f"%{name}%"
    results = cursor.execute("SELECT * FROM items WHERE name LIKE ?", (pattern,)).fetchall()
    conn.close()
    return [Card(**dict(row)) for row in results]
