import React, { useState, useEffect } from "react";
import axios from "axios";
let backend_url = "http://localhost:3000/api/v1";
import AppNavBarUser from '../components/navbarUser';
import { useCustomization } from "../contexts/CustomizationContext";

const FaqPage = () => {
  const { customization, updateCustomization } = useCustomization();

  const [faqs, setFaqs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResultsMessage, setSearchResultsMessage] = useState("");

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${backend_url}/getFAQs`, {
        withCredentials: true,
      });
      setFaqs(response.data.faqs);
    } catch (error) {
      console.error("Error fetching FAQs", error.message);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${backend_url}/searchFAQ`, {
        params: { search: searchText },
        withCredentials: true,
      });
      const searchResults = response.data;
      setFaqs(searchResults);
      setSearchResultsMessage(searchResults.length === 0 ? "No results found" : "");
    } catch (error) {
      console.error("Error searching FAQs", error.message);
    }
  };

  const resetSearch = async () => {
    fetchFaqs(); // Fetch all FAQs again
    setSearchResultsMessage("");
  };

  return (
    < div style={{ 
      backgroundColor: customization.backgroundColor, 
      color: customization.fontColor, 
      fontSize: `${customization.fontSize} px`,
      minHeight: '100vh'
  }}
  >
    <AppNavBarUser />
    <div>
      <nav className="navbar bg-body-tertiary-dark">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
          <div>
            <button className="btn btn-outline-primary" onClick={resetSearch}>
              Show All FAQs
            </button>
          </div>
        </div>
      </nav>
      <h2>Frequently Asked Questions</h2>
      {searchResultsMessage ? (
        <p>{searchResultsMessage}</p>
      ) : (
        <div className="accordion accordion-borderless" id="accordionflushExampleX">
          {faqs.map((faq, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`flush-heading${index}X`}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#flush-collapse${index}X`}
                  aria-expanded="false"
                  aria-controls={`flush-collapse${index}X`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`flush-collapse${index}X`}
                className="accordion-collapse collapse"
                aria-labelledby={`flush-heading${index}X`}
                data-bs-parent="#accordionflushExampleX"
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    </div>

  );
};

export default FaqPage;
