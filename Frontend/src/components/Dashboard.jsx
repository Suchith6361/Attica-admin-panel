import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from './constants';

const Dashboard = () => {
  const { employeeId } = useParams(); // Get employeeId from URL
  const [inputEmployeeId, setInputEmployeeId] = useState(employeeId || ""); // State for Employee ID input
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState("N/A");
  const [employee, setEmployee] = useState({});
  const [basicSalary, setBasicSalary] = useState("N/A");
  const [numberOfLeaves, setNumberOfLeaves] = useState("N/A");
  const [actualSalary, setActualSalary] = useState("N/A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch employee data
  const fetchEmployeeData = async (id) => {
    setLoading(true);
    setError(null);

    // Reset states to avoid showing old data
    setEmployee({});
    setTotalCalls(0);
    setTotalMessages(0);
    setAttendanceStatus("N/A");
    setBasicSalary("N/A");
    setNumberOfLeaves("N/A");
    setActualSalary("N/A");

    try {
      // Fetch employee data
      const employeeResponse = await axios.get(
        `${BASE_URL}/employees/${id}`
      );
      setEmployee(employeeResponse.data);

      // Fetch total calls
      const callResponse = await axios.get(
        `${BASE_URL}/employees/${id}/total-calls`
      );
      setTotalCalls(callResponse.data.totalCalls || 0);

      // Fetch total messages
      const messageResponse = await axios.get(
        `${BASE_URL}/employees/${id}/total-messages`
      );
      setTotalMessages(messageResponse.data.totalMessages || 0);

      // Fetch attendance data
      const attendanceResponse = await axios.get(
        `${BASE_URL}/employees/${id}/attendance-list`
      );
      setAttendanceStatus(attendanceResponse.data.status || "N/A");

      // Fetch salary details
      const salaryResponse = await axios.get(
        `${BASE_URL}/employees/${id}/salaries`
      );
      setBasicSalary(salaryResponse.data.basicSalary || "N/A");
      setNumberOfLeaves(salaryResponse.data.noOfLeaves || "N/A");
      setActualSalary(salaryResponse.data.actualSalary || "N/A");

    } catch (err) {
      setError("Error fetching employee data. Please check the Employee ID.");
      console.error("Error fetching employee data:", err);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch data if there's an employeeId in the URL
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);

  // Handling search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (inputEmployeeId) {
      fetchEmployeeData(inputEmployeeId);
    } else {
      setError("Please enter a valid Employee ID.");
      setEmployee({ name: "", employeeId: "", mobileNumber: "" }); // Reset employee data if ID is invalid
    }
  };

  return (
    <div className="p-4 absolute top-16 left-[270px] right-0">
      {/* Search Bar and Submit Button */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 flex items-center justify-center"
      >
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:border-blue-500"
          placeholder="Enter Employee ID"
          value={inputEmployeeId} // Bind input field value
          onChange={(e) => setInputEmployeeId(e.target.value)} // Update state
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Employee Info Card */}
      <div className="bg-gray-300 shadow-lg hover:shadow-xl transition-shadow shadow-violet-700 rounded-lg p-6 mb-6 flex flex-col">
        <h2 className="text-3xl font-bold mb-2">Employee Info</h2>
        <p className="text-gray-700 text-xl">Name: {employee.name || "N/A"}</p>
        <p className="text-gray-700 text-xl">
          Employee ID: {employee.employeeId || inputEmployeeId}
        </p>
        <p className="text-gray-700 text-xl">
          Phone Number: {employee.mobileNumber || "N/A"}
        </p>
        <p className="text-gray-700 text-xl">
          Basic Salary: {basicSalary || "N/A"}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Calls Card */}
        <Link
          to={`/employees/${employee.employeeId || inputEmployeeId}/call-logs`}
        >
          <div className="bg-gray-300 shadow-md rounded-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow shadow-blue-600">
            <div>
              <h2 className="text-2xl font-bold">Total Calls</h2>
              <p className="text-gray-800 mt-1">{totalCalls} calls</p>
            </div>
            <FaPhone className="text-blue-500 text-3xl" />
          </div>
        </Link>

        {/* Total Messages Card */}
        <Link
          to={`/employees/${employee.employeeId || inputEmployeeId}/messages`}
        >
          <div className="bg-gray-300 shadow-lg rounded-lg p-6 flex items-center justify-between hover:shadow-xl shadow-green-500 transition-shadow">
            <div>
              <h2 className="text-2xl font-bold">Messages</h2>
              <p className="text-gray-800 mt-1">{totalMessages} messages</p>
            </div>
            <FaEnvelope className="text-green-500 text-3xl" />
          </div>
        </Link>

        {/* Salary Details Card */}
        <div className="bg-gray-300 shadow-lg rounded-lg p-6 flex items-center justify-between shadow-yellow-300 hover:shadow-xl transition-shadow">
          <div>
            <h2 className="text-2xl font-bold">Salary Details</h2>
            <p className="text-gray-800 mt-1">Basic Salary: {basicSalary}</p>
            <p className="text-gray-800 mt-1">
              Number of Leaves: {numberOfLeaves}
            </p>
            <p className="text-gray-800 mt-1">Actual Salary: {actualSalary}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-3xl" />
        </div>

        {/* Location Updates Card */}
        <div className="bg-gray-300 shadow-lg rounded-lg p-6 flex items-center justify-between shadow-red-500 hover:shadow-xl transition-shadow">
          <div>
            <h2 className="text-2xl font-bold">Location Updates</h2>
            <p className="text-gray-800 mt-1">50 updates</p> {/* Hardcoded for now */}
          </div>
          <FaMapMarkerAlt className="text-red-500 text-3xl" />
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center text-blue-500 mt-4">Fetching data...</p>
      )}
    </div>
  );
};

export default Dashboard;
