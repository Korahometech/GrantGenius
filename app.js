// frontend/src/App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';  // Optional styling

function App() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [proposal, setProposal] = useState({ title: "", executive_summary: "", budget: "", impact: "" });
  const [proposals, setProposals] = useState([]);
  const [grants, setGrants] = useState([]);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleProposalChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const registerUser = async () => {
    try {
      const response = await axios.post("http://localhost:8000/register", user);
      alert(response.data.message);
      setLoggedIn(true);
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const createProposal = async () => {
    try {
      const response = await axios.post("http://localhost:8000/proposals/create", {
        ...proposal,
        id: "",
        status: "draft",
      });
      alert(`Proposal created with ID: ${response.data.id}`);
    } catch (error) {
      alert("Error creating proposal");
    }
  };

  const fetchProposals = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/proposals/user/${user.email}`);
      setProposals(Object.values(response.data));
    } catch (error) {
      alert("Error fetching proposals: " + error.response.data.detail);
    }
  };

  const searchGrants = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/grants/search?category=${category}`);
      setGrants(response.data);
    } catch (error) {
      alert("Error fetching grants: " + error.response.data.detail);
    }
  };

  const getSuggestions = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/proposals/suggestions`, {
        section: "executive_summary",
        content: proposal.executive_summary,
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      alert("Error getting suggestions");
    }
  };

  return (
    <div className="App">
      <h1>GrantGenius</h1>

      {!loggedIn ? (
        <div>
          <h2>Register User</h2>
          <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
          <button onClick={registerUser}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Create Grant Proposal</h2>
          <input type="text" name="title" placeholder="Proposal Title" onChange={handleProposalChange} />
          <textarea name="executive_summary" placeholder="Executive Summary" onChange={handleProposalChange}></textarea>
          <textarea name="budget" placeholder="Budget" onChange={handleProposalChange}></textarea>
          <textarea name="impact" placeholder="Impact" onChange={handleProposalChange}></textarea>
          <button onClick={createProposal}>Create Proposal</button>

          <h2>Your Proposals</h2>
          <button onClick={fetchProposals}>View Proposals</button>
          <ul>
            {proposals.map((proposal) => (
              <li key={proposal.id}>
                <h3>{proposal.title}</h3>
                <p>Executive Summary: {proposal.executive_summary}</p>
                <p>Budget: {proposal.budget}</p>
                <p>Impact: {proposal.impact}</p>
              </li>
            ))}
          </ul>

          <h2>Search for Grants</h2>
          <input type="text" placeholder="Grant Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button onClick={searchGrants}>Search Grants</button>
          <ul>
            {grants.map((grant) => (
              <li key={grant.id}>
                <h3>{grant.name}</h3>
                <p>Category: {grant.category}</p>
                <p>Amount: {grant.amount}</p>
                <p>Deadline: {grant.deadline}</p>
              </li>
            ))}
          </ul>

          <h2>Get GPT-4 Suggestions</h2>
          <button onClick={getSuggestions}>Get Suggestions for Executive Summary</button>
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
}

export default App;
