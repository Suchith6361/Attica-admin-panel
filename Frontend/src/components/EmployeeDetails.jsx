import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from './constants';

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    _id: "",
    employeeId: "",
    userName: "",
    name: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    password: "",
    confirmPassword: "",
    branch: "",
    designation: "",
    dateOfBirth: "",
    address: "",
    joinDate: "",
    fatherName: "",
    spouseName: "",
    salary: "",
    gender: "",
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproved, setIsApproved] = useState(false); // State to track approval status

  useEffect(() => {
    const storedApprovalStatus = localStorage.getItem(`approval-${employeeId}`);
    if (storedApprovalStatus) {
      setIsApproved(JSON.parse(storedApprovalStatus)); // Retrieve approval status from local storage
    }
    fetchEmployeeData();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employees/${employeeId}/details`);
      setEmployee(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  // Save approval status to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(`approval-${employeeId}`, JSON.stringify(isApproved));
  }, [isApproved, employeeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-8 rounded-lg mx-auto shadow-lg text-white absolute top-20 left-[400px] right-40">
      <h1 className="text-2xl font-bold text-center mb-6">Employee Form</h1>
      <form>
        {/* Render employee details as read-only inputs here */}
        <label className="flex flex-col mb-4 font-semibold">
          Employee ID
          <input type="text" value={employee.employeeId} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
        </label>
        {/* Other employee fields here... */}
        <label className="flex flex-col mb-4 font-semibold"> 
          User Name
          <input type="text" value={employee.userName} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
        </label>
        <label className="flex flex-col mb-4 font-semibold">
          Mobile Number
          <input type="text" value={employee.mobileNumber} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
        </label>
        <label className="flex flex-col mb-4 font-semibold">
        Alternate Mobile Number
        <input type="text" value={employee.alternateMobileNumber} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
     
      <label className="flex flex-col mb-4 font-semibold">
        Branch
        <input type="text" value={employee.branch} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Designation
        <input type="text" value={employee.designation} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Date of Birth
        <input type="date" value={employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : ''} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Address
        <input type="text" value={employee.address} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Join Date
        <input type="date" value={employee.joinDate ? employee.joinDate.split('T')[0] : ''} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Father Name
        <input type="text" value={employee.fatherName} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Spouse Name
        <input type="text" value={employee.spouseName} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
      <label className="flex flex-col mb-4 font-semibold">
        Salary
        <input type="text" value={employee.salary} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
      </label>
     
        <label className="flex flex-col mb-4 font-semibold">
          Gender
          <input type="text" value={employee.gender} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
        </label>
        <label className="flex flex-col mb-4 font-semibold">
          Created At
          <input type="text" value={new Date(employee.createdAt).toLocaleString()} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
        </label>
        <label className="flex flex-col mb-4 font-semibold">
          Updated At
          <input type="text" value={new Date(employee.updatedAt).toLocaleString()} readOnly className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" />
        </label>

        <label className="flex flex-col mb-4 font-semibold">
          Approval Status
          <select
            value={isApproved ? 'Approved' : 'Not Approved'}
            onChange={(e) => setIsApproved(e.target.value === 'Approved')}
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          >
            <option value="Not Approved">Not Approved</option>
            <option value="Approved">Approved</option>
          </select>
        </label>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full p-3 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EmployeeDetails;
