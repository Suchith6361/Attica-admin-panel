import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASE_URL } from './constants';

const AttendanceDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(""); // Employee ID state
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate(); // For navigation if needed

  // Function to handle fetching employee attendance based on the entered employeeId
  const fetchEmployeeAttendance = async (id) => {
    setLoading(true);
    setError(null); // Reset the error
    try {
      const response = await axios.get(
        `${BASE_URL}/employees/${id}/attendance-list`
      );
      setEmployee(response.data);
      setAttendance(response.data.attendanceRecords || []);
    } catch (err) {
      setError("Error fetching employee data. Please try again later.");
      console.error("Error fetching employee data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate days for the current selected month
  const generateMonthDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const fullMonthAttendance = generateMonthDays(
    date.getFullYear(),
    date.getMonth()
  ).map((day) => {
    const record = attendance.find(
      (att) => new Date(att.location.time).toDateString() === day.toDateString()
    );
    let status = null;
    if (record) {
      if (record.AttendanceStatus.isPresent) {
        status = "Present";
      } else if (record.AttendanceStatus.isHalfDay) {
        status = "Half Day";
      } else if (record.AttendanceStatus.isLeave) {
        status = "Leave";
      } else {
        status = "Absent";
      }
    }
    return {
      date: day,
      status,
    };
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (employeeId.trim()) {
      fetchEmployeeAttendance(employeeId); // Fetch attendance when search is submitted
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg absolute top-20 md:right-10 xs:right-0 xs:left-0 md:left-[275px]">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Employee Attendance
      </h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4 text-center">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      <div className="mb-6">
        <Calendar onChange={setDate} value={date} className="mx-auto" />
        <p className="text-center text-gray-600 mt-2">
          Selected Month:{" "}
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading attendance...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : employee ? (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            {/* Leave Request Button */}
            <Link to={`/employees/${employeeId}/attendance-list/leaves`}>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
                View Leave Requests
              </button>
            </Link>

            <Link to={`/employees/${employeeId}/attendance-list/complaints`}>
              <button className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300">
                View Complaints
              </button>
            </Link>
          </div>

          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <h3 className="text-2xl font-semibold">Employee Details</h3>
            <p>
              <strong>ID:</strong> {employee.employeeId}
            </p>
            <p>
              <strong>Name:</strong> {employee.name}
            </p>
            <p>
              <strong>Mobile Number:</strong> {employee.mobileNumber}
            </p>
            <p>
              <strong>Selected Month:</strong>{" "}
              {date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Attendance Records</h3>
            <ul className="space-y-2">
              {fullMonthAttendance.map((record, index) => (
                <li key={index} className="flex justify-between bg-white p-2 rounded shadow">
                  <span>{record.date.toLocaleDateString()}</span>
                  <span
                    className={`font-bold ${
                      record.status === "Present"
                        ? "text-green-600"
                        : record.status === "Half Day"
                        ? "text-yellow-600"
                        : record.status === "Leave"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {record.status || "Absent"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AttendanceDetails;
