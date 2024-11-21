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
      type: Boolean,
      required: true,
      default: false,
    },
    isLeave: {
      type: Boolean,
      required: true,
      default: false,
    },
    isHalfDay: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  location: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90, // Valid latitude range
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180, // Valid longitude range
    },
  },
 
locationName: {
    type: String,
    required: true, // Ensure location name is provided if necessary
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
  },
});


// Optional: Add a method to validate mutually exclusive attendance statuses
// attendanceSchema.methods.setAttendanceStatus = function (statusType) {
//   this.AttendanceStatus = {
//     isPresent: statusType === "isPresent",
//     isLeave: statusType === "isLeave",
//     isHalfDay: statusType === "isHalfDay",
//   };
// };

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
  leaveType: {
    type: String,
    required: true,
    enum: ["Sick", "Vacation", "Personal", "Other"], // Optional: define allowed leave types
  },
  to: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ApproveStatus: {
    type: String,
    enum: ["Approved", "Rejected", "Pending"], // Use strings to define approval status
    default: "Pending", // Default status when an employee is created
  },
});

const locationSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const salarySchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  actualSalary: { type: Number, required: true },
  advanceSalary:{ type: Number, required: true },
  perDaySalary:{ type: Number, required: true },
  deductedSalary:{ type: Number, required: true },
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

const userDetailsSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Basic validation for a 10-digit number
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  alternateMobileNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /\d{10}/.test(v); // Optional, 10-digit number if provided
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
  },
  designation: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  address: {
    type: String,
  },
  joinDate: {
    type: Date,
  },
  fatherName: {
    type: String,
  },
  spouseName: {
    type: String,
  },
  salary: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"], // Limiting to specific gender options
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
locationName:{
    type: String,
    required: true, // Ensure location name is provided if necessary
},
  ApproveStatus: {
    type: String,
    enum: ["Approved", "Rejected", "Pending"], // Use strings to define approval status
    default: "Pending", // Default status when an employee is created
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
const Complaint = mongoose.model("complaints", complaintSchema, "complaints");
const Leaves = mongoose.model("leaves", leaveSchema, "leaves");
const Salary = mongoose.model("salaries", salarySchema, "salaries");
const AttendanceList = mongoose.model("attendances", attendanceSchema);
const userDetails = mongoose.model("users", userDetailsSchema);

// Export all models
module.exports = {
  // CallLog,
  // Message,
  Location,
  User,
  Employee,
  Complaint,
  Leaves,
  Salary,
  AttendanceList,
  userDetails,
};
