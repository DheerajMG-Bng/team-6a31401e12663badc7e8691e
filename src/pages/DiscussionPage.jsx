// src/pages/DiscussionPage.jsx
import { useState } from "react";
import { ChevronUp, ChevronDown, MessageSquare, ArrowLeft, Plus, X, BluetoothConnected } from "lucide-react";
import "../styles/DiscussionPage.css";

const AVAILABLE_TAGS = ["account", "security", "general", "meta", "feature", "notifications", "voting", "moderation", "bug", "help"];

const INITIAL_QUESTIONS = [
  {
    id: 1,
    author: "amara_k",
    avatar: "AK",
    title: "How do I reset my password if I no longer have access to my email?",
    body: "My old email was deactivated and now I can't receive the reset link. I still remember my username. Is there any other way to recover the account?",
    tags: ["account", "security"],
    time: "2h ago",
    upvotes: 14,
    downvotes: 2,
    userVote: null,
    expanded: false,
    answers: [
      {
        id: 1,
        author: "devmod",
        avatar: "DM",
        text: "Contact support directly with your username and any previous billing info if applicable. They can verify ownership through alternative means.",
        votes: 34,
        hasVoted: false,
        time: "1h ago",
      },
      {
        id: 2,
        author: "rishi_p",
        avatar: "RP",
        text: "If you linked a phone number during signup, there might be an SMS recovery option on the login page. Check for a 'Try another way' link.",
        votes: 18,
        hasVoted: false,
        time: "45m ago",
      },
    ],
  },
  {
    id: 2,
    author: "leon_wd",
    avatar: "LW",
    title: "What's the difference between a FAQ post and a discussion post?",
    body: "I see both types on the platform but I'm not sure which one to use when I have a question. Can someone clarify the intended use case for each?",
    tags: ["general", "meta"],
    time: "5h ago",
    upvotes: 22,
    downvotes: 1,
    userVote: null,
    expanded: false,
    answers: [
      {
        id: 1,
        author: "okonkwo_j",
        avatar: "OJ",
        text: "FAQ posts are curated, evergreen answers for common questions — they go through editorial review. Discussion posts are open-ended threads where the community can debate, refine, and vote on answers in real time.",
        votes: 52,
        hasVoted: false,
        time: "4h ago",
      },
    ],
  },
  {
    id: 3,
    author: "sana_mir",
    avatar: "SM",
    title: "Is there a way to follow specific tags or topics?",
    body: "I want to be notified only about questions in my area of expertise so I can actually contribute useful answers. Does the platform support tag subscriptions?",
    tags: ["feature", "notifications"],
    time: "1d ago",
    upvotes: 8,
    downvotes: 5,
    userVote: null,
    expanded: false,
    answers: [],
  },
];

export default function DiscussionPage({ onNavigate }) {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTags, setNewTags] = useState([]);
  const [answerText, setAnswerText] = useState({});
  const [sortBy, setSortBy] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("recent");

  const SORT_OPTIONS = [
    { value: "recent", label: "Recent" },
    { value: "upvotes", label: "Most Upvotes" },
    { value: "downvotes", label: "Most Downvotes" },
  ];

  function getSorted() {
    const qs = [...questions];
    if (sortBy === "upvotes")
      return qs.sort((a, b) => b.upvotes - a.upvotes);
    if (sortBy === "downvotes")
      return qs.sort((a, b) => b.downvotes - a.downvotes);
    return qs.sort((a, b) => b.id - a.id);
  }

  function toggleExpand(id) {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, expanded: !q.expanded } : q))
    );
  }

  function voteQuestion(id, direction) {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== id) return q;
        if (q.userVote === direction) {
          return {
            ...q,
            userVote: null,
            upvotes:
              direction === "up" ? q.upvotes - 1 : q.upvotes,
            downvotes:
              direction === "down"
                ? q.downvotes - 1
                : q.downvotes,
          };
        }
        return {
          ...q,
          userVote: direction,
          upvotes:
            direction === "up"
              ? q.upvotes + 1
              : q.userVote === "up"
                ? q.upvotes - 1
                : q.upvotes,
          downvotes:
            direction === "down"
              ? q.downvotes + 1
              : q.userVote === "down"
                ? q.downvotes - 1
                : q.downvotes,
        };
      }),
    );
  }

  function upvoteAnswer(qId, aId) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === aId && !a.hasVoted
                  ? { ...a, votes: a.votes + 1, hasVoted: true }
                  : a
              ),
            }
          : q
      )
    );
  }

  function submitAnswer(qId) {
    const text = (answerText[qId] || "").trim();
    if (!text) return;
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: Date.now(),
                  author: "you",
                  avatar: "YU",
                  text,
                  votes: 0,
                  hasVoted: false,
                  time: "just now",
                },
              ],
            }
          : q
      )
    );
    setAnswerText((prev) => ({ ...prev, [qId]: "" }));
  }

  function toggleTag(tag) {
    setNewTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag],
    );
  }

  function submitQuestion() {
    if (!newTitle.trim()) return;
    const q = {
      id: Date.now(),
      author: "you",
      avatar: "YU",
      title: newTitle.trim(),
      body: newBody.trim(),
      tags: newTags,
      time: "just now",
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      expanded: false,
      answers: [],
    };
    setQuestions((prev) => [q, ...prev]);
    setNewTitle("");
    setNewBody("");
    setNewTags([]);
    setShowForm(false);
  }

  return (
    <div className="discussion-page">
      <header className="discussion-page__header">
        <div className="discussion-page__header-container">
          <div className="discussion-page__header-left">
            <button
              onClick={() => onNavigate("home")}
              className="discussion-page__back-btn"
            >
              <ArrowLeft className="discussion-page__back-icon" />
            </button>
            <span className="discussion-page__logo">
              VINS<span className="discussion-page__logo-highlight"> FAQ SERVER</span>
            </span>
            <span className="discussion-page__header-badge">/ DISCUSSION</span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="discussion-page__new-question-btn"
          >
            <Plus className="discussion-page__new-question-icon" />
            New Question
          </button>
        </div>
      </header>

      <main className="discussion-page__main">
        {/* New Question Form */}
        {showForm && (
          <div className="question-form">
            <div className="question-form__header">
              <h2 className="question-form__title">Post a Question</h2>
              <button
                onClick={() => setShowForm(false)}
                className="question-form__close"
              >
                <X className="question-form__close-icon" />
              </button>
            </div>

            <div className="question-form__body">
              <div className="question-form__field">
                <label className="question-form__label">TITLE *</label>
                <input
                  type="text"
                  placeholder="Be specific and clear..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="question-form__input"
                />
              </div>

              <div className="question-form__field">
                <label className="question-form__label">DETAILS</label>
                <textarea
                  rows={4}
                  placeholder="Provide context, what you've already tried, etc..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="question-form__textarea"
                />
              </div>

              <div className="question-form__field">
                <label className="question-form__label">TAGS</label>
                <div className="tag-selector">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`tag-selector__btn ${
                        newTags.includes(tag) ? "tag-selector__btn--selected" : ""
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {newTags.length > 0 && (
                  <p className="selected-tags-info">
                    Selected: {newTags.join(", ")}
                  </p>
                )}
              </div>

              <div className="question-form__actions">
                <button
                  onClick={() => setShowForm(false)}
                  className="question-form__cancel-btn"
                >
                  CANCEL
                </button>
                <button
                  onClick={submitQuestion}
                  disabled={!newTitle.trim()}
                  className="question-form__submit-btn"
                >
                  POST
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions header */}
        <div className="discussion-page__questions-header">
          <p className="discussion-page__questions-count">
            {questions.length} QUESTIONS
          </p>
          <div className="discussion-page__sort">
            <button
              className="discussion-page__sort-button"
              onClick={() => setSortOpen(!sortOpen)}
            >
              SORTED BY : <span className="discussion-page__sort-active">{sortLabel.toUpperCase()}</span>
              <ChevronDown
                className={`discussion-page__sort-chevron ${sortOpen ? "discussion-page__sort-chevron--open" : ""}`}
              />
            </button>

            {sortOpen && (
              <div className="discussion-page__sort-dropdown">
                {SORT_OPTIONS.map((opt) => (
                  <button 
                    key={opt.value}
                    className={`discussion-page__sort-option ${
                      sortBy === opt.value ? "discussion-page__sort-option--active" : ""
                    }`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortLabel(opt.label);
                      setSortOpen(false);
                    }}
                  >
                    {opt.label.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Questions list */}
        <div className="discussion-page__questions-list">
          {getSorted().map((q) => (
            <div key={q.id} className="question-card">
              <button
                className="question-card__trigger"
                onClick={() => toggleExpand(q.id)}
              >
                <div className="question-card__avatar">
                  <span className="question-card__avatar-text">{q.avatar}</span>
                </div>
                <div className="question-card__content">
                  <p className="question-card__title">{q.title}</p>
                  <div className="question-card__meta">
                    {q.tags.map((tag) => (
                      <span key={tag} className="question-card__tag">{tag}</span>
                    ))}
                    <span className="question-card__info">
                      {q.author} · {q.time}
                    </span>
                    <span className="question-card__answers-count">
                      <MessageSquare className="question-card__answers-icon" />
                      {q.answers.length}
                    </span>
                    <span className="question-card__vote-group" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => voteQuestion(q.id, "up")}
                        className={`question-card__vote-btn ${q.userVote === "up" ? "question-card__vote-btn--up-active" : ""}`}
                      >
                        <ChevronUp className="question-card__vote-icon" />
                        {q.upvotes}
                      </button>
                      <button
                        onClick={() => voteQuestion(q.id, "down")}
                        className={`question-card__vote-btn ${q.userVote === "down" ? "question-card__vote-btn--down-active" : ""}`}
                      >
                        <ChevronDown className="question-card__vote-icon" />
                        {q.downvotes}
                      </button>
                    </span>
                  </div>
                </div>
              </button>

              {q.expanded && (
                <div className="question-card__expanded">
                  {q.body && (
                    <div className="question-card__body">
                      <p className="question-card__body-text">{q.body}</p>
                    </div>
                  )}

                  {q.answers.length > 0 && (
                    <div className="answers-list">
                      {q.answers
                        .slice()
                        .sort((a, b) => b.votes - a.votes)
                        .map((ans) => (
                          <div key={ans.id} className="answer-item">
                            <div className="answer-item__vote">
                              <button
                                onClick={() => upvoteAnswer(q.id, ans.id)}
                                disabled={ans.hasVoted}
                                className={`answer-item__vote-btn ${
                                  ans.hasVoted ? "answer-item__vote-btn--voted" : ""
                                }`}
                              >
                                <ChevronUp className="answer-item__vote-icon" />
                              </button>
                              <span
                                className={`answer-item__vote-count ${
                                  ans.hasVoted ? "answer-item__vote-count--voted" : ""
                                }`}
                              >
                                {ans.votes}
                              </span>
                            </div>
                            <div className="answer-item__content">
                              <p className="answer-item__text">{ans.text}</p>
                              <p className="answer-item__meta">
                                {ans.author} · {ans.time}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="answer-form">
                    <p className="answer-form__label">YOUR ANSWER</p>
                    <textarea
                      rows={3}
                      placeholder="Write a clear, helpful answer..."
                      value={answerText[q.id] || ""}
                      onChange={(e) =>
                        setAnswerText((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      className="answer-form__textarea"
                    />
                    <button
                      onClick={() => submitAnswer(q.id)}
                      disabled={!(answerText[q.id] || "").trim()}
                      className="answer-form__submit-btn"
                    >
                      POST ANSWER
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}