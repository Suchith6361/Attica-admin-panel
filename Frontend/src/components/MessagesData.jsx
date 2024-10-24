import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MessagesData = () => {
  const { employeeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const navigate = useNavigate();

  // Fetch messages from backend API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/employees/${employeeId}/messages`
        );
        setMessages(response.data);
        setFilteredMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [employeeId]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle delete a single message with confirmation
  const handleDelete = async (messageId) => {
    if (window.confirm("Do you really want to delete this message?")) {
      try {
        await axios.delete(
          `http://localhost:3005/Delete-message/${employeeId}/${messageId}`
        );
        // Update local state to reflect the deleted message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        setFilteredMessages((prevFiltered) =>
          prevFiltered.filter((msg) => msg._id !== messageId)
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  // Handle delete all messages with confirmation
  const handleDeleteAllMessages = async () => {
    if (
      window.confirm(
        "Do you really want to delete all messages? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3005/Delete-all-messages/${employeeId}`
        );

        // Clear the messages in the state
        setMessages([]); // Empty the messages state
        alert("All messages deleted successfully.");
      } catch (error) {
        console.error("Error deleting all messages:", error);
        alert("Error deleting all messages. Please try again.");
      }
    }
  };

  // Filter messages based on search term
  useEffect(() => {
    const filtered = messages.filter((msg) => {
      const address = msg.address || "";
      const body = msg.body || "";
      const serviceCenter = msg.service_center || "";
      const date = msg.date || "";

      return (
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serviceCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredMessages(filtered);
  }, [searchTerm, messages]);

  return (
    <div className="p-4 ">
      <input
        type="text"
        placeholder="Search messages..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded mb-4 border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 p-2 rounded-lg w-1/3 shadow-sm"
      />
      <button
        onClick={handleDeleteAllMessages}
        className="ml-4 bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-6 py-2 rounded-lg"
      >
        Delete All Messages
      </button>
      <h2 className="text-xl font-bold mb-4">
        Messages for Employee ID: {employeeId}
      </h2>
      {filteredMessages.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300  border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-purple-600 to-purple-400 text-white  ">
            <tr className="text-white text-xl">
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Sl No
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Address
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Message Body
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Service Center
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Received Date
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Received Time
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left  font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg, index) => (
              <tr
                key={msg._id}
                className="hover:bg-gray-100 transition-colors duration-200 "
              >
                <td className="border border-gray-300 px-6 py-4">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {msg.address}
                </td>
                <td className="border border-gray-300 px-6 py-4">{msg.body}</td>
                <td className="border border-gray-300 px-6 py-4">
                  {msg.service_center}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {new Date(msg.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {new Date(msg.date).toLocaleTimeString()}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No messages available</p>
      )}
    </div>
  );
};

export default MessagesData;
