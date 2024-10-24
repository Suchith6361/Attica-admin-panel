import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CallLogTable = () => {
  const { employeeId } = useParams(); // Get employeeId from URL parameters
  const [callLogs, setCallLogs] = useState([]); // State to store call logs
  const [filteredCallLogs, setFilteredCallLogs] = useState([]); // State for filtered call logs
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sortOrder, setSortOrder] = useState(""); // State for sorting order
  const [filterType, setFilterType] = useState("All"); // State for filtering by type

  // Fetch call logs when the component is mounted or employeeId changes
  useEffect(() => {
    if (employeeId) {
      const fetchCallLogs = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/employees/${employeeId}/call-logs`
          );
          setCallLogs(response.data); // Set call logs in the state
          setFilteredCallLogs(response.data); // Set filtered logs initially
        } catch (error) {
          console.error("Error fetching call logs:", error);
        }
      };

      fetchCallLogs();
    }
  }, [employeeId]);

  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle sorting by duration
  const handleSort = (order) => {
    setSortOrder(order);
    const sortedLogs = [...filteredCallLogs].sort((a, b) => {
      if (order === "ascending") {
        return a.duration - b.duration;
      } else if (order === "descending") {
        return b.duration - a.duration;
      }
      return 0;
    });
    setFilteredCallLogs(sortedLogs);
  };

  // Handle deleting a single call log
  const handleDeleteCallLog = async (callLogId) => {
    if (window.confirm("Do you really want to delete this call log?")) {
      try {
        await axios.delete(
          `http://localhost:3005/Delete-call-log/${employeeId}/${callLogId}`
        );
        setCallLogs((prevLogs) =>
          prevLogs.filter((log) => log._id !== callLogId)
        );
        setFilteredCallLogs((prevFiltered) =>
          prevFiltered.filter((log) => log._id !== callLogId)
        );
      } catch (error) {
        console.error("Error deleting call log:", error);
      }
    }
  };

  // Handle deleting all call logs
  const handleDeleteAllCallLogs = async () => {
    if (
      window.confirm(
        "Do you really want to delete all call logs? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3005/Delete-all-call-logs/${employeeId}`
        );
        setCallLogs([]); // Clear call logs state
        setFilteredCallLogs([]); // Clear filtered logs
        alert("All call logs deleted successfully.");
      } catch (error) {
        console.error("Error deleting all call logs:", error);
        alert("Error deleting all call logs. Please try again.");
      }
    }
  };

  // Search and filter logic
  useEffect(() => {
    const filtered = callLogs.filter((log) => {
      const name = log.name || "";
      const phoneNumber = log.phoneNumber || "";
      const type = log.type || "";
      const duration = log.duration;
      const date = new Date(log.dateTime).toLocaleDateString();

      return (
        (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          phoneNumber.includes(searchTerm) ||
          duration.toString().includes(searchTerm) ||
          type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          date.includes(searchTerm)) &&
        (filterType === "All" || log.type === filterType)
      );
    });
    setFilteredCallLogs(filtered);
  }, [searchTerm, callLogs, filterType]);

  return (
    <div className="p-6 absolute top-20 right-10 left-[270px]">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
        Call Logs for Employee ID: {employeeId}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Name or Phone Number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 p-2 rounded-lg w-1/3 shadow-sm"
        />
        <select
          className="border border-purple-500 p-2 rounded-lg focus:outline-none focus:border-purple-700"
          value={sortOrder}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort by Duration</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
        <button
          onClick={handleDeleteAllCallLogs} // Handle Delete All logic
          className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-6 py-2 rounded-lg"
        >
          Delete All Call Logs
        </button>
      </div>

      {filteredCallLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-400 text-white text-xl">
                <th className="p-4">Sl. No.</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Duration (minutes)</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredCallLogs.map((log, index) => (
                <tr
                  key={`${log.timestamp}-${index}`}
                  className="bg-white border-b border-purple-200 hover:bg-purple-50 transition duration-300"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{log.name || "N/A"}</td>
                  <td className="p-4">{log.type}</td>
                  <td className="p-4">{(log.duration / 60).toFixed(2)} </td>
                  <td className="p-4">
                    {new Date(log.dateTime).toLocaleString()}
                  </td>
                  <td className="p-4">{log.phoneNumber}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteCallLog(log._id)}
                      className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">
          No call logs available
        </p>
      )}
    </div>
  );
};

export default CallLogTable;
