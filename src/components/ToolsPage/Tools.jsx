import React, { useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../HeroSection/Hero";
import ToolSection from "../ToolsSection/ToolSection";

const Tools = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");

  const toolsSectionRef = useRef(null);

  const handleSearchAndScroll = (query) => {
    setSelectedSearchQuery(query);
  
    if (toolsSectionRef.current) {
      const yOffset = -80; // Adjust this offset to match your navbar height (e.g., -80 for 80px tall navbar)
      const y =
        toolsSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
  
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  

  return (
    <div className="bg-[#2b2b2b]">
      <Navbar />
      <Hero
        setSelectedTag={setSelectedTag}
        onSearch={handleSearchAndScroll}
      />
      <div ref={toolsSectionRef}>
        <ToolSection
          selectedTag={selectedTag}
          searchQuery={selectedSearchQuery}
        />
      </div>
    </div>
  );
};

export default Tools;
