import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASE_URL } from './constants'

const AttendanceTable = () => {
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState(null); // State to hold employee details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchEmployeeAttendance = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/employees/${employeeId}/attendance-list`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        console.log(data); // Inspect the data structure
        setAttendance(data);
      } catch (err) {
        setError("Error fetching employee data. Please try again later.");
        console.error("Error fetching employee data:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/employees/${employeeId}`
        );
        setEmployee(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    };

    fetchEmployeeAttendance();
    fetchEmployeeDetails();
  }, [employeeId]);

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
    const record = (attendance || []).find(
      (att) => new Date(att.time).toDateString() === day.toDateString()
    );
    let status = "Absent";
    if (record) {
      if (record.AttendanceStatus.isPresent) {
        status = "Present";
      } else if (record.AttendanceStatus.isHalfDay) {
        status = "Half Day";
      } else if (record.AttendanceStatus.isLeave) {
        status = "Leave";
      }
    }

    return {
      date: day,
      status,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg absolute top-20 right-10 left-[275px]">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Employee Attendance
      </h2>

      {/* Employee Details Section */}
      {employee && (
        <div className="bg-blue-500 text-white p-4 rounded-lg mb-6">
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
      )}

      {/* Buttons for Leave Request and Complaints */}
      <div className="flex justify-center space-x-4 mb-6">
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
      ) : (
        <div className="mb-8">
          <table className="min-w-full bg-white mt-4 border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {fullMonthAttendance.map(({ date, status }) => (
                <tr
                  key={date.toDateString()}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {date.toDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        status === "Present"
                          ? "bg-green-100 text-green-600"
                          : status === "Half Day"
                          ? "bg-yellow-100 text-yellow-600"
                          : status === "Leave"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
