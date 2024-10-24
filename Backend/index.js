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
  Attendance,
  Complaint,
  Leaves,
  Salary,
} = require("./Model/Model");
console.log("Models loaded.");

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
    const employees = await Employee.find();
    console.log(employees); // Log the employees fetched
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// app.get("/employees/:employeeId", async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     console.log(employees); // Log the employees fetched
//     res.status(200).json(employees);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     res.status(500).json({ error: "Error fetching employees" });
//   }
// });

// Backend route to fetch employee details
app.get("/employees/:employeeId", async (req, res) => {
  try {
    // Fetch the employee using employeeId from the request params
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId,
    });

    // If employee not found, return 404
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Return employee details if found
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ error: "Error fetching employee details" });
  }
});

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
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId,
    });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Assuming `attendance` is a separate collection linked to the employeeId
    const attendance = await Attendance.find({
      employeeId: req.params.employeeId,
    });

    res.status(200).json({
      employeeId: employee.employeeId,
      name: employee.name,
      mobileNumber: employee.mobileNumber,
      attendance: attendance, // Include attendance records
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
// app.get("/complaints", async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const complaints = await Complaint.find({ employeeId });
//     res.status(200).json(complaints);
//   } catch (error) {
//     console.error("Error fetching complaints:", error);
//     res.status(500).json({ error: "Error fetching complaints" });
//   }
// });

// Assuming you have a model for Attendance
app.get("/employees/:employeeId/attendance-list", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendanceRecords = await Attendance.find({ employeeId });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Error fetching attendance" });
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

// app.delete('/Delete-call-log/:employeeId/:callLogId', async (req, res) => {
//     const { employeeId, callLogId } = req.params;

//     try {
//         const result = await Employee.updateOne(
//             { employeeId: employeeId },
//             { $pull: { callLogs: { _id: callLogId } } }
//         );

//         if (result.modifiedCount === 0) {
//             return res.status(404).json({ error: "Call log not found." });
//         }

//         res.status(200).json({ message: "Call log deleted successfully." });
//     } catch (error) {
//         console.error("Error deleting call log:", error);
//         res.status(500).json({ error: "Error deleting call log." });
//     }
// });


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

app.delete('/Delete-call-log/:employeeId/:callLogId', async (req, res) => {
  const { employeeId, callLogId } = req.params;

  try {
    const result = await CallLog.findOneAndDelete({ _id: callLogId, employeeId: employeeId });
    
    if (!result) {
      return res.status(404).json({ message: 'Call log not found.' });
    }

    res.status(200).json({ message: 'Call log deleted successfully.' });
  } catch (error) {
    console.error("Error deleting call log:", error);
    res.status(500).json({ message: 'Server error.' });
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

app.get("/employees/:employeeId/salaries", async (req, res) => {
  try {
    const { employeeId } = req.params; // Extract employeeId from request parameters
    const salary = await Salary.findOne({ employeeId }); // Find salary record for the specific employee
    if (!salary) {
      return res.status(404).json({ error: "Salary details not found" });
    }
    console.log(salary); // Log the fetched salary
    res.status(200).json(salary);
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ error: "Error fetching salary" });
  }
});





const Port = 3005;
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
