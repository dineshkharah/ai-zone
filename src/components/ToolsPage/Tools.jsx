import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../HeroSection/Hero";
import ToolSection from "../ToolsSection/ToolSection";

const Tools = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
  return (
    <div className="bg-[#2b2b2b]">
      <Navbar />
      <Hero
        setSelectedTag={setSelectedTag}
        setSelectedSearchQuery={setSelectedSearchQuery}
      />
      <ToolSection
        selectedTag={selectedTag}
        searchQuery={selectedSearchQuery}
      />
    </div>
  );
};

export default Tools;
