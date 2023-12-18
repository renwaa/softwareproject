// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  useEffect(() => {
    // Fetch FAQs from the backend when the component mounts
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${backend_url}/faqs`);
        setFaqs(response.data); // Assuming your backend API returns an array of FAQs
        setFilteredFaqs(response.data); // Initially, set filtered FAQs to all FAQs
      } catch (error) {
        console.error("Error fetching FAQs", error.message);
      }
    };

    fetchFaqs();
  }, []); // Empty dependency array to fetch FAQs only once when the component mounts

  const handleSearch = () => {
    // Filter FAQs based on the search query
    const filteredResults = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaqs(filteredResults);
  };

  return (
    <>
      <div className="search-bar">
        <h2>Search FAQs</h2>
        <input
          type="text"
          placeholder="Search for FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="faq-list">
        <h2>Frequently Asked Questions</h2>
        {filteredFaqs.length === 0 ? (
          <p>No FAQs found.</p>
        ) : (
          <ul>
            {filteredFaqs.map((faq) => (
              <li key={faq.id}>
                <strong>Q: {faq.question}</strong>
                <p>A: {faq.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Link to="/">Back to Home</Link>
      </div>
    </>
  );
};

export default FaqPage;
