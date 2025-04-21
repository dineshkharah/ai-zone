import React, { useEffect, useState } from "react";
import { searchTools } from "../../api";

const ToolSection = ({ selectedTag, searchQuery }) => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationNumbers, setPaginationNumbers] = useState([]);
  const currentRole = localStorage.getItem("role");
  // const currentRole = "";

  const toolsPerPage = 16; // Adjustable (16-20)

  // 🔹 Fetch Tools Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchQuery.trim() === "" && currentRole) {
          response = await searchTools({ currentRole }); // Fetch all tools if no query
        } else {
          response = await searchTools(searchQuery);
        }

        // console.log("API Response:", response);

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
          (tool["Useable For"] || "")
            .toLowerCase()
            .includes(selectedTag.toLowerCase())
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
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    setPaginationNumbers(pageNumbers);
  }, [currentPage, totalPages]);

  return (
    <div className="container mx-auto px-6 py-10 text-black bg-white">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-end space-x-4">
          <h2 className="text-3xl font-bold">AI Tools</h2>
          <h2 className="text-xl">for {currentRole}</h2>
        </div>
        <h2 className="text-xl font-semibold">{searchQuery}</h2>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentTools.map((tool, index) => (
          <div
            key={index}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col"
          >
            {/* Trending Badge */}
            {index < 3 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Trending
              </div>
            )}

            {/* <img
              src={`https://api.screenshotbuddy.io/v1/snap?url=${encodeURIComponent(tool["Tool Link"])}&token=9Et36ciJPmAU21HipnxRxigPM0p3gnENQuqXURxU0298ea08`}
              alt={tool["AI Tool Name"]}
              className="w-full h-32 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/300x200?text=No+Preview";
              }}
            /> */}

            {/* <img
              src={`https://screenshotbase.com/api?url=${encodeURIComponent(tool["Tool Link"])}`}
              alt={tool["AI Tool Name"]}
              className="w-full h-32 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=No+Preview";
              }}
            /> */}
            
            <div className="flex justify-center items-center p-4">
              <img
                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool["Tool Link"]}`}
                alt={`${tool["AI Tool Name"]} favicon`}
                className="w-16 h-16"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold">{tool["AI Tool Name"]}</h3>
              <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full inline-block mt-2">
                {tool["Major Category"] || "Other"}
              </span>
              <p className="my-5 text-sm text-gray-600">
                {tool["Description"]?.length > 100
                  ? tool["Description"].substring(0, 100) + "..."
                  : tool["Description"]}
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
              className={`btn ${
                currentPage === page ? "btn-primary" : "btn-outline"
              } 
              ${
                page === "..."
                  ? "text-gray-500 pointer-events-none cursor-default border-none"
                  : ""
              }`}
              onClick={() => page !== "..." && setCurrentPage(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
