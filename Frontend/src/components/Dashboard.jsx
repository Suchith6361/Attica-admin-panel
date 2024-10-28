import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from './constants';

const Dashboard = () => {
  const { employeeId } = useParams();
  const [inputEmployeeId, setInputEmployeeId] = useState(employeeId || "");
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState("N/A");
  const [employee, setEmployee] = useState({});
  const [basicSalary, setBasicSalary] = useState("N/A");
  const [numberOfLeaves, setNumberOfLeaves] = useState("N/A");
  const [actualSalary, setActualSalary] = useState("N/A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeData = async (id) => {
    setLoading(true);
    setError(null);
    setEmployee({});
    setTotalCalls(0);
    setTotalMessages(0);
    setAttendanceStatus("N/A");
    setBasicSalary("N/A");
    setNumberOfLeaves("N/A");
    setActualSalary("N/A");

    try {
      const employeeResponse = await axios.get(`${BASE_URL}/employees/${id}`);
      setEmployee(employeeResponse.data);

      const callResponse = await axios.get(`${BASE_URL}/employees/${id}/total-calls`);
      setTotalCalls(callResponse.data.totalCalls || 0);

      const messageResponse = await axios.get(`${BASE_URL}/employees/${id}/total-messages`);
      setTotalMessages(messageResponse.data.totalMessages || 0);

      const attendanceResponse = await axios.get(`${BASE_URL}/employees/${id}/attendance-list`);
      setAttendanceStatus(attendanceResponse.data.status || "N/A");

      const salaryResponse = await axios.get(`${BASE_URL}/employees/${id}/salaries`);
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

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputEmployeeId) {
      fetchEmployeeData(inputEmployeeId);
    } else {
      setError("Please enter a valid Employee ID.");
      setEmployee({ name: "", employeeId: "", mobileNumber: "" });
    }
  };

  return (
    <div className="p-4 xs:p-5 sm:p-6 md:p-8 absolute md:left-[270px] lg:top-20 lg:right-0 xs:top-20">
      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 flex flex-col xs:flex-row items-center justify-center gap-2"
      >
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-full xs:w-48 sm:w-64 focus:outline-none focus:border-blue-500"
          placeholder="Enter Employee ID"
          value={inputEmployeeId}
          onChange={(e) => setInputEmployeeId(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full xs:w-auto"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="bg-gray-300 shadow-lg hover:shadow-xl transition-shadow shadow-violet-700 rounded-lg p-4 xs:p-5 sm:p-6 mb-6 flex flex-col">
        <h2 className="text-2xl xs:text-2xl sm:text-3xl font-bold mb-2 ">Employee Info</h2>
        <p className="text-gray-700 text-lg xs:text-xl">Name: {employee.name || "N/A"}</p>
        <p className="text-gray-700 text-lg xs:text-xl">
          Employee ID: {employee.employeeId || inputEmployeeId}
        </p>
        <p className="text-gray-700 text-lg xs:text-xl">
          Phone Number: {employee.mobileNumber || "N/A"}
        </p>
        <p className="text-gray-700 text-lg xs:text-xl">
          Basic Salary: {basicSalary || "N/A"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xs:grid-cols-1 md:grid-cols-2">
        <Link to={`/employees/${employee.employeeId || inputEmployeeId}/call-logs`}>
          <div className="bg-gray-300 shadow-md rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between hover:shadow-xl transition-shadow shadow-blue-600">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Total Calls</h2>
              <p className="text-gray-800 mt-1 text-lg">{totalCalls} calls</p>
            </div>
            <FaPhone className="text-blue-500 text-2xl sm:text-3xl" />
          </div>
        </Link>

        <Link to={`/employees/${employee.employeeId || inputEmployeeId}/messages`}>
          <div className="bg-gray-300 shadow-lg rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between hover:shadow-xl shadow-green-500 transition-shadow">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Messages</h2>
              <p className="text-gray-800 mt-1 text-lg">{totalMessages} messages</p>
            </div>
            <FaEnvelope className="text-green-500 text-2xl sm:text-3xl" />
          </div>
        </Link>

        <div className="bg-gray-300 shadow-lg rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between shadow-yellow-300 hover:shadow-xl transition-shadow">
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Salary Details</h2>
            <p className="text-gray-800 mt-1 text-lg">Basic Salary: {basicSalary}</p>
            <p className="text-gray-800 mt-1 text-lg">Number of Leaves: {numberOfLeaves}</p>
            <p className="text-gray-800 mt-1 text-lg">Actual Salary: {actualSalary}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-2xl sm:text-3xl" />
        </div>

        <div className="bg-gray-300 shadow-lg rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between shadow-red-500 hover:shadow-xl transition-shadow">
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Location Updates</h2>
            <p className="text-gray-800 mt-1 text-lg">50 updates</p>
          </div>
          <FaMapMarkerAlt className="text-red-500 text-2xl sm:text-3xl" />
        </div>
      </div>

      {loading && (
        <p className="text-center text-blue-500 mt-4">Fetching data...</p>
      )}
    </div>
  );
};

export default Dashboard;
