import React, { useEffect, useState } from "react";
import { searchTools } from "../api";

const ToolSection = ({ selectedTag, searchQuery }) => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationNumbers, setPaginationNumbers] = useState([]);

  const toolsPerPage = 16; // Adjustable (16-20)

  // 🔹 Fetch Tools Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchQuery.trim() === "") {
          response = await searchTools(""); // Fetch all tools if no query
        } else {
          response = await searchTools(searchQuery);
        }

        console.log("API Response:", response); // Debugging

        setTools(response.results || []);
        setFilteredTools(response.results || []);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    fetchData();
  }, [searchQuery]); // Ensures update when searchQuery changes




  useEffect(() => {
    if (selectedTag === "All") {
      setFilteredTools(tools || []);
    } else {
      setFilteredTools(
        tools.filter((tool) =>
          (tool["Useable For"] || "").toLowerCase().includes(selectedTag.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  }, [selectedTag, tools]);



  // 🔹 Pagination Logic
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);

  // 🔹 Generate Pagination Numbers with "..." when needed
  useEffect(() => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Show only 5 numbered pages at a time

    if (totalPages <= maxPageButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    setPaginationNumbers(pageNumbers);
  }, [currentPage, totalPages]);

  return (
    <div className="container mx-auto px-6 py-10 text-black bg-white">
      <h2 className="text-3xl font-bold mb-6">AI Tools</h2>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentTools.map((tool, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
            <img src="https://via.placeholder.com/150" alt={tool["AI Tool Name"]} className="w-full h-32 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold">{tool["AI Tool Name"]}</h3>
              <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full inline-block mt-2">
                {tool["Major Category"] || "Other"}
              </span>
              <p className="my-5 text-sm text-gray-600">
                {tool["Description"]?.length > 100 ? tool["Description"].substring(0, 100) + "..." : tool["Description"]}
              </p>
              <a
                href={tool["Tool Link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full bg-purple-500 text-white text-sm py-2 rounded-lg hover:bg-purple-600 transition block text-center"
              >
                TRY NOW
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {paginationNumbers.map((page, index) => (
            <button
              key={index}
              className={`btn ${currentPage === page ? "btn-primary" : "btn-outline"} 
              ${page === "..." ? "text-gray-500 pointer-events-none cursor-default border-none" : ""}`}
              onClick={() => page !== "..." && setCurrentPage(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolSection;
