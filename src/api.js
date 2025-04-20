export const searchTools = async (query) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/search/?query=${query}`);
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging output
        return data;
    } catch (error) {
        console.error("Error fetching tools:", error);
        return [];
    }
};
