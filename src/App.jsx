import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolSection from "./components/ToolSection";

const App = () => {
  const [selectedTag, setSelectedTag] = useState("All"); // State for filtering tools

  return (
    <div className="w-screen min-h-screen bg-[#2b2b2b]">
      <Navbar />
      <Hero setSelectedTag={setSelectedTag} />
      <ToolSection selectedTag={selectedTag} />
    </div>
  );
};

export default App;
