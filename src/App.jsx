import { useState } from "react";
import HomePage from "./pages/homePage";
import DiscussionPage from "./pages/DiscussionPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="size-full">
      {page === "home" && <HomePage onNavigate={setPage} />}
      {page === "discussion" && <DiscussionPage onNavigate={setPage} />}
      {page === "profile" && <ProfilePage onNavigate={setPage} />}
    </div>
  );
}