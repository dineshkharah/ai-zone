import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolSection from "./components/ToolSection";

const App = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");

  return (
    <div className="w-screen min-h-screen bg-[#2b2b2b]">
      <Navbar />
      <Hero setSelectedTag={setSelectedTag} setSelectedSearchQuery={setSelectedSearchQuery} />
      <ToolSection selectedTag={selectedTag} searchQuery={selectedSearchQuery} />
    </div>
  );
};

export default App;
