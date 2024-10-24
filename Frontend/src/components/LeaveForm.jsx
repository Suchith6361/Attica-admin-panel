import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from './constants'

const LeaveForm = () => {
  const { employeeId, name, mobileNumber } = useParams();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const employeeResponse = await axios.get(
          `${BASE_URL}/employees/${employeeId}/attendance-list`
        );
        setEmployee(employeeResponse.data);

        const leaveRequestsResponse = await axios.get(
          `${BASE_URL}/employees/${employeeId}/attendance-list/leaves`
        );
        setLeaveRequests(leaveRequestsResponse.data);
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const sortedLeaveRequests = leaveRequests.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-6 bg-gradient-to-b from-blue-100 to-blue-200 min-h-screen absolute top-20 right-10 left-[275px]">
      {/* Employee Information */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-white">Employee Information</h2>
        <p className="text-lg text-white">ID: {employee.employeeId || employeeId}</p>
        <p className="text-lg text-white">Name: {employee.name || name}</p>
        <p className="text-lg text-white">Number: {employee.mobileNumber || mobileNumber}</p>
      </div>

      {/* Leave Requests Section */}
      <h2 className="text-3xl font-bold text-black text-center mb-6">Leave Requests Inbox</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : sortedLeaveRequests.length > 0 ? (
        <div className="space-y-4">
          {sortedLeaveRequests.map((request, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-600 relative transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-blue-700">
                <span className="text-red-600">Leave Type: {request.leaveType}</span>
                <br />
                <span>Reason: {request.reason}</span>
              </h3>

              <p className="text-gray-700">
                Start Date: {new Date(request.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                End Date: {new Date(request.endDate).toLocaleDateString()}
              </p>

              <p className="text-gray-700 absolute right-4 top-4">
                Applied Date: {new Date(request.createdAt).toLocaleDateString()}
                <br />
                Applied Time: {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black">No leave requests found.</p>
      )}
    </div>
  );
};

export default LeaveForm;
