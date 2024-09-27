# backend/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
import openai

app = FastAPI()

users_db = {}
proposals_db = {}
grants_db = [
    {"id": "1", "name": "Healthcare Grant", "category": "Healthcare", "amount": "$50,000", "deadline": "2024-10-31"},
    {"id": "2", "name": "Education Grant", "category": "Education", "amount": "$30,000", "deadline": "2024-12-01"},
    {"id": "3", "name": "Environmental Grant", "category": "Environment", "amount": "$75,000", "deadline": "2024-11-15"}
]

# User Registration
class User(BaseModel):
    username: str
    email: str
    password: str

@app.post("/register")
def register_user(user: User):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.email] = user
    return {"message": "User registered successfully"}

# Grant Proposal Models
class GrantProposal(BaseModel):
    id: str
    title: str
    executive_summary: str
    budget: str
    impact: str
    status: str = "draft"

@app.post("/proposals/create")
def create_proposal(proposal: GrantProposal):
    proposal_id = str(uuid4())
    proposal.id = proposal_id
    proposals_db[proposal_id] = proposal
    return {"message": "Proposal created", "id": proposal_id}

# Fetch all user proposals
@app.get("/proposals/user/{email}")
def get_user_proposals(email: str):
    user_proposals = {pid: proposal for pid, proposal in proposals_db.items() if proposal.email == email}
    if not user_proposals:
        raise HTTPException(status_code=404, detail="No proposals found for this user")
    return user_proposals

# Grant Search Endpoint
@app.get("/grants/search")
def search_grants(category: str = None):
    if category:
        filtered_grants = [grant for grant in grants_db if grant["category"].lower() == category.lower()]
        if not filtered_grants:
            raise HTTPException(status_code=404, detail="No grants found for this category")
        return filtered_grants
    return grants_db
