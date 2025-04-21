import React, { useState } from "react";
import "./Hero.css";

const Hero = ({ setSelectedTag, setSelectedSearchQuery }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagLocal, setSelectedTagLocal] = useState("All");

  const tags = [
    "All", "AI Detection", "Aggregators", "Avatar", "Chat", "Copywriting", "Finance", "For Fun",
    "Gaming", "Generative Art", "Generative Code", "Generative Video", "Image Improvement",
    "Image Scanning", "Inspiration", "Marketing", "Motion Capture", "Music", "Podcasting",
    "Productivity", "Prompt Guides", "Research", "Self Improvement", "Social Media",
    "Speech To Text", "Text To Speech", "Text To Video", "Translation", "Video Editing", "Voice Modulation"
  ];

  const handleTagClick = (tag) => {
    if (tag === "All") {
        window.location.reload();
      } else {
        setSearchQuery(tag);
        // setSelectedTag(tag);
        // setSelectedTagLocal(tag);
      }
  }

  const handleSearch = () => {
    setSelectedSearchQuery(searchQuery);
  };

  return (
    <div className="bg-[#2b2b2b] text-white text-center py-12 px-4 w-full h-[100vh] pt-28">
      <div className="container mx-auto px-6 mt-10">
        <h1 className="text-5xl font-bold mb-4">Go from Zero to Productivity</h1>
        <p className="text-lg m-6 p-6">Find the best AI tools to enhance your work.</p>

        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
          <div className="rainbow-shadow-search w-full md:w-1/2">
            <div className="flex items-center w-full bg-gray-700 rounded-full px-4 h-14 pr-0">
              <input
                type="text"
                placeholder="Type Something..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent outline-none text-white placeholder-gray-300 pl-3"
              />
              <button
                className="btn btn-primary h-14 w-28 rounded-full text-base"
                onClick={handleSearch}
              >
                SEARCH
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-14">
          {tags.map((tag) => (
            <span
              key={tag}
              className="badge badge-outline p-5 cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
