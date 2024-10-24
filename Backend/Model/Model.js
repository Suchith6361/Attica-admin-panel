const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define schemas
const callLogSchema = new mongoose.Schema({
  type: { type: String, required: true },
  // rawType: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
  phoneNumber: { type: String, required: true },
});

const messageSchema = new mongoose.Schema({
  type: { type: String, required: true },
  body: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  service_center: { type: String, required: true },
  // timestamp: { type: Date, default: Date.now },
  date: {
    type: Date,
    default: Date.now,
  },
});

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  AttendanceStatus: {
    isPresent: {
      // Change to Boolean
      type: Boolean,
      required: true,
    },
    isLeave: {
      // Change to Boolean
      type: Boolean,
      required: true,
    },
    isHalfDay: {
      // Change to Boolean
      type: Boolean,
      required: true,
    },
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  locationName: {
    type: String,
    // required: true, // Make required if necessary
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const leaveSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  leaveType: { type: String, required: true },
  to: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const locationSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const salarySchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  nuOfLeaves: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  // contact: { type: String, required: true },
  callLogs: [callLogSchema],
  messages: [messageSchema],
  // Nested call logs
});

// Create models
// const CallLog = mongoose.model("callLog", callLogSchema, "callLog");

const Location = mongoose.model("Location", locationSchema, "locations");
const User = mongoose.model("adminuser", userSchema, "adminuser");
const Employee = mongoose.model("employees", employeeSchema, "employees");
const Attendance = mongoose.model(
  "attendanceList",
  attendanceSchema,
  "attendanceList"
);
const Complaint = mongoose.model("complaints", complaintSchema, "complaints");
const Leaves = mongoose.model("leaves", leaveSchema, "leaves");
const Salary = mongoose.model("salaries", salarySchema, "salaries");

// Export all models
module.exports = {
  // CallLog,
  // Message,
  Location,
  User,
  Employee,
  Attendance,
  Complaint,
  Leaves,
  Salary,
};
