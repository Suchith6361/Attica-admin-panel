const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
console.log("Setting up server...");
require("./Config/Config"); // MongoDB configuration loaded here
console.log("MongoDB Config Loaded.");

app.use(cors()); // Always use CORS before defining routes
app.use(express.json()); // Middleware to parse JSON
console.log("Middleware setup done.");

// Load Models
const {
  CallLog,
  Message,
  Location,
  Employee,
  User,
  Complaint,
  Leaves,
  Salary,
  userDetails,
  AttendanceList,
} = require("./Model/Model");
console.log("Models loaded.");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// User Registration
// User Registration
app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already registered. Please login." });
    }

    const user = new User(req.body);
    const result = await user.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne(req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const employees = await userDetails.find();
    console.log(employees); // Log the employees fetched
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// Get employee details by employeeId
app.get("/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await userDetails.findOne({ employeeId }); // Adjust if `employeeId` is stored differently

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

// Backend route to fetch employee details
// app.get("/employees/:employeeId", async (req, res) => {
//   try {
//     // Fetch the employee using employeeId from the request params
//     const employee = await userDetails.findOne({
//       employeeId: req.params.employeeId,
//     });

//     // If employee not found, return 404
//     if (!employee) {
//       return res.status(404).json({ error: "Employee not found" });
//     }

//     // Return employee details if found
//     res.status(200).json(employee);

//   } catch (error) {
//     console.error("Error fetching employee details:", error);
//     res.status(500).json({ error: "Error fetching employee details" });
//   }
// });

// Fetch employee's total call logs count by employeeId
app.get("/employees/:employeeId/total-calls", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch the employee using employeeId from the request params
    const employee = await Employee.findOne({ employeeId });

    // If employee not found, return 404
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Get the total number of calls
    const totalCalls = employee.callLogs ? employee.callLogs.length : 0;

    // Return the total number of calls
    res.status(200).json({
      employeeId: employee.employeeId,
      name: employee.name,
      totalCalls: totalCalls,
    });
  } catch (error) {
    console.error("Error fetching total call logs:", error);
    res.status(500).json({ error: "Error fetching total call logs" });
  }
});

// Example Express route for getting total messages
app.get("/employees/:employeeId/total-messages", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch the employee using employeeId from the request params
    const employee = await Employee.findOne({ employeeId });

    // If employee not found, return 404
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Get the total number of calls
    const totalMessages = employee.messages ? employee.messages.length : 0;

    // Return the total number of calls
    res.status(200).json({
      employeeId: employee.employeeId,
      name: employee.name,
      totalMessages: totalMessages,
    });
  } catch (error) {
    console.error("Error fetching total call logs:", error);
    res.status(500).json({ error: "Error fetching total call logs" });
  }
});

app.get("/employees/:employeeId/attendance-list", async (req, res) => {
  try {
    // Fetch employee details
    const employee = await userDetails.findOne({
      employeeId: req.params.employeeId,
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Prepare attendance query
    const { date } = req.query;
    let attendanceQuery = { employeeId: req.params.employeeId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // End of the selected date

      attendanceQuery["location.time"] = { $gte: startDate, $lt: endDate };
    }

    // Fetch attendance records
    const attendance = await AttendanceList.find(attendanceQuery);

    if (!attendance.length) {
      return res
        .status(404)
        .json({ error: "No attendance records found for the employee" });
    }

    console.log("Employee Data: ", employee);
    console.log("Filtered Attendance Records: ", attendance); // Debugging line

    // Send response
    res.status(200).json({
      employeeId: employee.employeeId,
      userName: employee.userName,
      name: employee.name,
      mobileNumber: employee.mobileNumber,
      branch: employee.branch,
      designation: employee.designation,
      attendance, // Includes `photoUri` if present in the schema
    });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Error fetching employee data" });
  }
});



app.get("/employees/:employeeId/call-logs", async (req, res) => {
  const { employeeId } = req.params;
  const { search = "", type = "All" } = req.query; // Default to empty string for search

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    let filteredLogs = employee.callLogs || [];

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          (log.name && log.name.toLowerCase().includes(searchLower)) ||
          (log.phoneNumber && log.phoneNumber.includes(search))(
            log.employeeId && log.employeeId.includes(search)
          )
      );
    }

    // Filter by type
    if (type !== "All") {
      filteredLogs = filteredLogs.filter((log) => log.type === type);
    }

    res.status(200).json(filteredLogs);
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).json({ error: "Error fetching call logs" });
  }
});

app.get("/employees/:employeeId/search-call-logs", async (req, res) => {
  const { employeeId } = req.params;
  const { name, phoneNumber, type } = req.query; // Getting search parameters from query

  // Create a filter object
  const filter = { employeeId };

  // Add filters based on provided query parameters
  if (name) {
    filter.name = { $regex: name, $options: "i" }; // Case-insensitive search for name
  }
  if (phoneNumber) {
    filter.phoneNumber = { $regex: phoneNumber, $options: "i" }; // Case-insensitive search for phone number
  }
  if (type) {
    filter.type = type; // Exact match for call type (incoming/outgoing)
  }

  try {
    const logs = await CallLog.find(filter);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching call logs" });
  }
});

app.get("/employees/:employeeId/messages", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(employee.messages); // Ensure response is JSON
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).json({ error: "Error fetching call logs" });
  }
});

app.get(
  "/employees/:employeeId/attendance-list/complaints",
  async (req, res) => {
    try {
      const { employeeId } = req.params;
      const complaints = await Complaint.find({ employeeId });
      res.status(200).json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ error: "Error fetching complaints" });
    }
  }
);

app.get("/employees/:employeeId/attendance-list/leaves", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaves = await Leaves.find({ employeeId });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Error fetching complaints" });
  }
});

// Messages Endpoints
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const { employeeId, messageContent } = req.body;
    const message = new Message({
      employeeId,
      messageContent,
      timestamp: new Date(),
    });
    await message.save();
    io.emit("new-message", message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Error saving message" });
  }
});

// Locations Endpoints
app.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Error fetching locations" });
  }
});

app.post("/locations", async (req, res) => {
  try {
    const { employeeId, location } = req.body;
    const newLocation = new Location({
      employeeId,
      location,
      timestamp: new Date(),
    });
    await newLocation.save();
    io.emit("new-location", newLocation);
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ error: "Error saving location" });
  }
});

app.delete("/Delete-call-log/:employeeId/:callLogId", async (req, res) => {
  const { employeeId, callLogId } = req.params;

  try {
    // Find the employee by employeeId and update the callLogs array
    const result = await Employee.findOneAndUpdate(
      { employeeId: employeeId },
      { $pull: { callLogs: { _id: callLogId } } }, // Remove the call log with the specified callLogId
      { new: true } // Return the updated document
    );

    if (result) {
      // Check if any call log was removed
      const callLogDeleted = result.callLogs.some(
        (log) => log._id.toString() === callLogId
      );
      if (!callLogDeleted) {
        res
          .status(200)
          .json({ message: "Call log deleted successfully", callLogId });
      } else {
        res.status(404).json({ error: "Call log not found" });
      }
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting call log:", error);
    res.status(500).json({ error: "Error deleting call log" });
  }
});

//delete all call logs
app.delete("/Delete-all-call-logs/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find the employee by employeeId and set the callLogs array to an empty array
    const result = await Employee.findOneAndUpdate(
      { employeeId: employeeId },
      { $set: { callLogs: [] } }, // Set the callLogs array to empty
      { new: true } // Return the updated document
    );

    if (result) {
      res.status(200).json({ message: "All call logs deleted successfully" });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting all call logs:", error);
    res.status(500).json({ error: "Error deleting all call logs" });
  }
});

// $$$$$$$$$$$$$$$$$------ Delete a specific message by employeeId and messageId---------$$$$$$$$$$$$//////
app.delete("/Delete-message/:employeeId/:messageId", async (req, res) => {
  const { employeeId, messageId } = req.params;

  try {
    // Find the employee by employeeId and update the messages array
    const result = await Employee.findOneAndUpdate(
      { employeeId: employeeId },
      { $pull: { messages: { _id: messageId } } }, // Remove the message with the specified messageId
      { new: true } // Return the updated document
    );

    if (result) {
      // Check if any messages were removed
      const messageDeleted = result.messages.some(
        (msg) => msg._id.toString() === messageId
      );
      if (!messageDeleted) {
        res
          .status(200)
          .json({ message: "Message deleted successfully", messageId });
      } else {
        res.status(404).json({ error: "Message not found" });
      }
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Error deleting message" });
  }
});

app.delete("/Delete-call-log/:employeeId/:callLogId", async (req, res) => {
  const { employeeId, callLogId } = req.params;

  try {
    const result = await CallLog.findOneAndDelete({
      _id: callLogId,
      employeeId: employeeId,
    });

    if (!result) {
      return res.status(404).json({ message: "Call log not found." });
    }

    res.status(200).json({ message: "Call log deleted successfully." });
  } catch (error) {
    console.error("Error deleting call log:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.delete("/Delete-all-messages/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find the employee by employeeId and set the messages array to an empty array
    const result = await Employee.findOneAndUpdate(
      { employeeId: employeeId },
      { $set: { messages: [] } }, // Set the messages array to empty
      { new: true } // Return the updated document
    );

    if (result) {
      res.status(200).json({ message: "All messages deleted successfully" });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting all messages:", error);
    res.status(500).json({ error: "Error deleting all messages" });
  }
});

// app.get("/employees/:employeeId/salaries", async (req, res) => {
//   try {
//     const { employeeId } = req.params; // Extract employeeId from request parameters

//     // Find salary record for the specific employee
//     const salary = await Salary.findOne({ employeeId });

//     if (!salary) {
//       return res.status(404).json({ error: "Salary details not found" });
//     }

//     // Log the fetched salary for debugging
//     console.log("Fetched salary details:", salary);

//     // Extract individual salary details
//     const { basicSalary, advanceSalary, noOfLeaves, actualSalary,deductedSalary,perDaySalary } = salary;

//     // Return only the required salary details
//     res.status(200).json({
//       employeeId,
//       basicSalary,
//       advanceSalary,
//       noOfLeaves,
//       actualSalary,
//       deductedSalary,
// perDaySalary,

//     });
//   } catch (error) {
//     console.error("Error fetching salary:", error); // Log any error that occurs
//     res.status(500).json({ error: "An internal error occurred while fetching salary details" });
//   }
// });

app.get("/employees/:employeeId/salaries", async (req, res) => {
  try {
    const { employeeId } = req.params; // Extract employeeId from request parameters

    // Find salary record for the specific employee
    const salary = await Salary.findOne({ employeeId });

    if (!salary) {
      return res.status(404).json({ error: "Salary details not found for this Employee ID" });
    }

    console.log("Fetched salary details:", salary); // Log the fetched salary for debugging
    res.status(200).json(salary); // Send the salary details as a response
  } catch (error) {
    console.error("Error fetching salary:", error); // Log any error that occurs
    res.status(500).json({ error: "An internal error occurred while fetching salary details" });
  }
});


// To get the all details form of the employee
app.get("/employees/:employeeId/details", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch employee by employeeId
    const employee = await userDetails.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/employees/:employeeId/status", async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.body; // Expecting status to be 'Approved', 'Rejected', or 'Pending'

  try {
    // Validate status
    if (
      status !== "Approved" &&
      status !== "Rejected" &&
      status !== "Pending"
    ) {
      return res.status(400).json({
        message:
          'Invalid status value. Must be "Approved", "Rejected", or "Pending".',
      });
    }

    // Update employee's ApproveStatus
    const updatedEmployee = await userDetails.findOneAndUpdate(
      { employeeId },
      { ApproveStatus: status },
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/employees/:employeeId/attendance-list/leaves/:leaveId/status",
  async (req, res) => {
    const { employeeId, leaveId } = req.params;
    const { status } = req.body; // Expecting status to be 'Approved', 'Rejected', or 'Pending'

    try {
      // Validate the status input
      if (!["Approved", "Rejected", "Pending"].includes(status)) {
        return res.status(400).json({
          message:
            'Invalid status value. Status must be "Approved", "Rejected", or "Pending".',
        });
      }

      // Update the specific leave request's status for the given employee
      const updatedLeave = await Leaves.findOneAndUpdate(
        { employeeId, _id: leaveId },
        { ApproveStatus: status },
        { new: true } // Return the updated document
      );

      // Check if the leave request was found and updated
      if (!updatedLeave) {
        return res.status(404).json({
          message:
            "Leave request not found for the specified employee or leave ID.",
        });
      }

      // Send back the updated leave document with success status
      res.status(200).json({
        message: `Leave request status has been successfully updated to ${status}.`,
        leaveRequest: updatedLeave,
      });
    } catch (error) {
      console.error("Error updating leave status:", error);
      res.status(500).json({
        message:
          "An internal server error occurred while updating the leave status. Please try again later.",
        error: error.message,
      });
    }
  }
);

// app.post('/employees/:employeeId/leaves', async (req, res) => {
//   try {
//     const { employeeId } = req.params; // Capture the employeeId from URL parameters
//     const { startDate, endDate, reason, leaveType, to } = req.body; // Get leave request data from the request body

//     // Create a new leave request document
//     const newLeaveRequest = new Leave({
//       startDate,
//       endDate,
//       reason,
//       leaveType,
//       to,
//       employeeId, // Optionally, you can store the employeeId if necessary
//     });

//     // Save the new leave request to the database
//     const savedLeaveRequest = await newLeaveRequest.save();

//     // Respond with the saved leave request data
//     res.status(201).json(savedLeaveRequest);
//   } catch (err) {
//     console.error("Error creating leave request:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get("/employees/:employeeId/attendance-list/leaves", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaves = await Leaves.find({ employeeId });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Error fetching complaints" });
  }
});

const Port = 3005;
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
