# team-6a31401e12663badc7e8691e
FAQ Crowdsourcing project — Thota Venkata Avinash Naidu

# Crowd-Sourced FAQ Server

An Integrated Community FAQ, Discussion & AI Chatbot Platform developed for the VINS Internship Programme at IIT Ropar (Vicharanashala Lab).

## 📖 Overview

Every cohort of interns faces recurring questions regarding attendance, leave policies, Spurti Points, certificates, and platform usage. This often results in repetitive mentor workloads and inconsistent or delayed answers. 

The **Crowd-Sourced FAQ Server** solves this by centralizing knowledge into a self-sustaining, community-driven platform. It allows interns to self-serve accurate answers 24/7 through a browsable FAQ base, participate in a community discussion board, and interact with an intelligent semantic-search chatbot called the "VINS Assistant". High-quality peer discussions are ranked via a multi-factor algorithm and can be promoted by administrators into official, searchable FAQ entries.

---

## ✨ Key Features

* **Semantic Search Chatbot (VINS Assistant):** Uses NLP to understand the intent behind a question rather than relying on literal keyword matching. It returns confidence-tiered responses and honestly declines to guess when no match exists.
* **Community Discussion Board:** A forum where users can post questions, submit threaded answers, and upvote/downvote content.
* **Intelligent Answer Ranking:** Instead of raw vote counts, answers are scored using a weighted algorithm factoring in response time, user experience, reputation (SP points), and community upvotes.
* **Duplicate Issue Prevention:** Checks the semantic similarity of new questions against existing FAQs before submission to prevent duplicate threads.
* **Automated FAQ Promotion Pipeline:** Administrators can review highly-rated discussions and officially convert them into verified FAQ entries.
* **Gamified User Profiles:** Users have personal dashboards displaying avatars, earned badges, and statistics like questions asked, answers provided, and net upvotes.
* **Role-Based Access Control:** Secure JWT-based authentication distinguishing standard Users and platform Administrators.
* **Dynamic UI Theming:** A fully responsive React interface featuring a persistent dark/light neon theme with smooth CSS-driven animations.

---

## 🏗️ System Architecture

The project operates on a distributed, service-oriented architecture divided into three primary layers to handle distinct workloads:

1. **Presentation Layer (Frontend):** A React 18 single-page application handling the UI/UX, user profiles, discussion boards, and admin interfaces.
2. **Core Application Layer (Backend):** A Node.js and Express REST API backed by MongoDB. It manages transactional logic, including user authentication, voting, and the FAQ promotion workflow.
3. **AI/NLP Layer (Microservice):** An independent Python and FastAPI microservice handling compute-heavy operations like semantic embedding, cosine-similarity search, and duplicate-question detection.

---

## 💻 Technology Stack

### Frontend
* **Core:** React 18, Vite
* **Routing:** React Router DOM
* **Styling/UI:** CSS3 (custom variables for dark/light mode), Lucide React (icons)
* **Auth:** Client-side JWT storage

### Core Backend (REST API)
* **Runtime & Framework:** Node.js, Express.js
* **Database & ORM:** MongoDB, Mongoose
* **Security:** JWT (Stateless authentication), BCrypt (Password hashing)

### AI/ML Microservice
* **Framework:** Python 3, FastAPI, Uvicorn
* **Data Validation:** Pydantic v2
* **Database & ORM:** SQLAlchemy 2.0 (SQLite in dev, PostgreSQL in prod)
* **Machine Learning:** `sentence-transformers` (`all-MiniLM-L6-v2`), NumPy
* **Data Processing:** `pyspellchecker` (query cleaning), Selenium + BeautifulSoup4 (live FAQ scraping)

---

## 🔮 Future Enhancements
* **Vector Database Integration:** Migrating from JSON-stored embeddings to PostgreSQL's `pgvector` for scalable similarity search.
* **Multi-Turn Conversation:** Enabling session context so the chatbot can ask clarifying follow-up questions.
* **Automated Scraper Scheduling:** Running the Selenium scraper on a periodic schedule to keep the AI knowledge base automatically synced with official VINS pages.
* **Streaming Responses:** Implementing token-by-token streaming for a natural, typewriter-style chat UI.
