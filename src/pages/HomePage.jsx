// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, User, Sun, Moon } from "lucide-react";
import "../styles/HomePage.css";

const FAQS = [
  {
    id: 1,
    category: "General",
    question: "What is this platform and how does it work?",
    answer:
      "This is a crowd-sourced FAQ platform where the community posts questions, provides answers, and upvotes the most helpful responses. Think of it as a living knowledge base — the best answers rise to the top through collective voting.",
    votes: 142,
    answers: 3,
  },
  {
    id: 2,
    category: "Account",
    question: "How do I create an account and get started?",
    answer:
      "Click the Profile button in the top-right corner to set up your account. Once registered, you can post questions, write answers, and start accumulating upvotes from the community.",
    votes: 98,
    answers: 5,
  },
  {
    id: 3,
    category: "Voting",
    question: "How does the upvote system work?",
    answer:
      "Any logged-in user can upvote an answer they find helpful. Upvotes signal quality to other readers and contribute to the answerer's reputation score. You cannot upvote your own answers.",
    votes: 76,
    answers: 2,
  },
  {
    id: 4,
    category: "Moderation",
    question: "What content is not allowed on this platform?",
    answer:
      "Spam, duplicate questions, off-topic posts, and abusive content are not permitted. The community can flag posts for moderator review. Repeated violations may result in account restrictions.",
    votes: 61,
    answers: 4,
  },
  {
    id: 5,
    category: "General",
    question: "Can I edit or delete my questions and answers?",
    answer:
      "Yes. You can edit your own posts at any time from your profile page. Deletion is available as long as your answer has not been accepted as the top response, to preserve discussion integrity.",
    votes: 54,
    answers: 1,
  },
  {
    id: 6,
    category: "Account",
    question: "How is my reputation score calculated?",
    answer:
      "Your reputation is the sum of all upvotes received on your answers. Each upvote counts as +1. High-reputation users gain additional privileges such as the ability to close duplicate questions.",
    votes: 49,
    answers: 2,
  },
];

const CATEGORIES = ["All", "General", "Account", "Voting", "Moderation"];

export default function HomePage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = FAQS.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesQuery =
      query.trim() === "" ||
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const onToggleTheme = () => setDark(prev => !prev);

  return (
    <div className="home-page">
      <header className="home-page__header">
        <div className="home-page__header-container">
          <span className="home-page__logo">
            VINS<span className="home-page__logo-highlight"> FAQ SERVER</span>
          </span>

          <div className="home-page__search-wrapper">
            <Search className="home-page__search-icon" />
            <input
              type="text"
              placeholder="Search existing questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="home-page__search-input"
            />
          </div>

          <button
            onClick={() => onNavigate("discussion")}
            className="home-page__ask-btn"
          >
            Ask Question
          </button>

          <button
            onClick={onToggleTheme}
            className="home-page__theme-toggle"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="home-page__theme-icon" /> : <Moon className="home-page__theme-icon" />}
          </button>

          <button
            onClick={() => onNavigate("profile")}
            className="home-page__profile-btn"
            title="Profile"
          >
            <User className="home-page__profile-icon" />
          </button>
        </div>
      </header>

      <div className="home-page__hero">
        <div className="home-page__hero-container">
          <p className="home-page__hero-badge">Community Knowledge Base</p>
          <h1 className="home-page__hero-title">Crowd-Sourced FAQ</h1>
          <p className="home-page__hero-description">
            Answers written and voted on by the community. If your question
            isn't here, post it in the discussion board.
          </p>
        </div>
      </div>

      <div className="home-page__filters">
        <div className="home-page__filters-container">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`home-page__filter-btn ${
                activeCategory === cat ? "home-page__filter-btn--active" : ""
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <main className="home-page__main">
        {filtered.length === 0 ? (
          <div className="home-page__empty">
            <p className="home-page__empty-message">
              No matches found for "{query}"
            </p>
            <button
              onClick={() => onNavigate("discussion")}
              className="home-page__empty-action"
            >
              Post this question →
            </button>
          </div>
        ) : (
          <div className="home-page__faq-list">
            {filtered.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className="faq-item__trigger"
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                >

                <div className="faq-item__content">
                  <div className="faq-item__meta">
                    <span className="faq-item__category">
                      {faq.category.toUpperCase()}
                    </span>
                  </div>
                  <p className="faq-item__question">{faq.question}</p>
                </div>

                  <div className="faq-item__expand-icon">
                    {expandedId === faq.id ? (
                      <ChevronUp className="faq-item__chevron" />
                    ) : (
                      <ChevronDown className="faq-item__chevron" />
                    )}
                  </div>
                </button>

                {expandedId === faq.id && (
                  <div className="faq-item__answer">
                    <p className="faq-item__answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="home-page__cta">
          <p className="home-page__cta-text">Can't find your answer?</p>
          <button
            onClick={() => onNavigate("discussion")}
            className="home-page__cta-btn"
          >
            Post a New Question
          </button>
        </div>
      </main>
    </div>
  );
}