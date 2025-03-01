// const express = require("express");
// const dotenv = require("dotenv");
// const { connectDb } = require("./utils/connectDb");
// const userRouter = require("./routers/userRouters");
// const appointmentRouter = require('./routers/appointmentRouter')
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const http = require('http');
// const patientRouter = require('./routers/patientRouter');
// const availabilityRouter = require('./routers/availabilityRouter');
// const app = express();
// const { Server } = require("socket.io");

// dotenv.config();

// const server = http.createServer(app);


// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

// const io = new Server(server, {
//   pingTimeout: 60000,
//   pingInterval: 25000,
//   cors: {
//     origin:
//       process.env.NODE_STATE == "production" ? process.env.FRONTEND_URL : "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server Running",
//   });
// });


// connectDb();


// // maps for roles abd 
// const patientMap = new Map();
// const doctorsMap = new Map();

// app.use('/api/', availabilityRouter)
// app.use("/api/patients", patientRouter)
// app.use("/api/v1/user", userRouter);
// app.use('/api/appointments', appointmentRouter);

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('register', ({ userId, role }) => {
//     // connectedUsers.set(userId, socket.id);
//     // socket.join(role); // Join room based on role (doctor/patient)

//     if (role == "Doctor") {
//       doctorsMap.set(socket.id, {
//         roomId: socket.id, // Set roomId to doctor's socket ID
//       })
//     }
//     // Doctor Registration
//     socket.on("register_doctor", () => {
//       console.log(`Doctor ${socket.id} registered and is idle.`);

//       doctorsMap.set(socket.id, {
//         state: "idle"
//       })
//     });

//     // Patient connects
//     socket.on("register_patient", () => {
//       // Initialize patient data with an empty rejected agents list.
//       console.log(`Patient ${socket.id} registered and is idle.`);

//       patientMap.set(socket.id, {
//         doctorId: null,
//         roomId: socket.id, // Set roomId to doctor's socket ID
//       });
//       console.log(`Patient ${socket.id} registered.`);
//     });
//   });

//   socket.on('join-consultation', async ({ appointmentId, userId, role }) => {
//     socket.join(appointmentId);
//     io.to(appointmentId).emit('user-joined', { userId, role });
//   });

//   socket.on('leave-consultation', ({ appointmentId, userId, role }) => {
//     socket.leave(appointmentId);
//     io.to(appointmentId).emit('user-left', { userId, role });
//   });

//   // Handle real-time messaging during consultation
//   socket.on('consultation-message', ({ appointmentId, message, sender }) => {
//     io.to(appointmentId).emit('new-message', { message, sender });
//   });

//   socket.on('disconnect', () => {
//     for (const [userId, socketId] of connectedUsers.entries()) {
//       if (socketId === socket.id) {
//         connectedUsers.delete(userId);
//         break;
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     if (doctorsMap.has(socket.id)) {
//       doctorsMap.delete(socket.id);
//       console.log(`Doctor ${socket.id} disconnected.`);
//     } else if (patientMap.has(socket.id)) {
//       patientMap.delete(socket.id);
//       console.log(`Patient ${socket.id} disconnected.`);
//     }
//   });
// });


// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// server.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./utils/connectDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http');
const userRouter = require("./routers/userRouters");
const patientRouter = require('./routers/patientRouter');
const doctorAvailability = require('./routers/availableRouter')
const { Server } = require("socket.io");
const doctorRouter = require("./routers/doctorRouter")
const bookingRouter = require("./routers/booking")
const healthRouter = require("./routers/healthmetrics");
const healthmetrics = require("./models/healthmetrics");
const { getMedicalResponse } = require('./utils/GeminiAI');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected users and active consultations
const connectedUsers = new Map();
const activeConsultations = new Map();

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  socket.on('register', ({ userId, role, name }) => {
    console.log('Registering user:', { userId, role, name, socketId: socket.id });
    connectedUsers.set(socket.id, { userId, role, name, socketId: socket.id });
    console.log('Connected users:', Array.from(connectedUsers.values()));
  });

  socket.on('request_consultation', ({ patientId, patientName }) => {
    console.log('Received consultation request from patient:', { patientId, patientName });

    const doctor = Array.from(connectedUsers.values()).find(user => user.role === "Doctor");
    console.log('Found doctor:', doctor);

    if (doctor) {
      const roomId = `consultation-${patientId}-${doctor.userId}`;
      console.log('Sending consultation request to doctor:', { doctorSocketId: doctor.socketId, roomId });

      io.to(doctor.socketId).emit('consultation_request', {
        patientId,
        patientName,
        roomId
      });
    } else {
      console.log('No doctor available');
      socket.emit('request_response', {
        accepted: false,
        message: 'No doctor is currently available'
      });
    }
  });

  socket.on('respond_to_request', ({ accepted, patientId, doctorId, roomId }) => {
    console.log('Doctor response:', { accepted, patientId, doctorId, roomId });

    const patient = Array.from(connectedUsers.values()).find(user => user.userId === patientId);
    console.log('Found patient:', patient);

    if (patient) {
      if (accepted) {
        console.log('Starting consultation:', roomId);
        activeConsultations.set(roomId, { patientId, doctorId });

        io.to(patient.socketId).emit('request_response', {
          accepted: true,
          roomId
        });
        io.to(socket.id).emit('consultation_started', { roomId });
      } else {
        console.log('Consultation declined');
        io.to(patient.socketId).emit('request_response', {
          accepted: false
        });
      }
    }
  });

  socket.on('end_consultation', ({ roomId }) => {
    console.log('Ending consultation:', roomId);
    if (activeConsultations.has(roomId)) {
      io.to(roomId).emit('consultation_ended');
      activeConsultations.delete(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    console.log('Remaining connected users:', Array.from(connectedUsers.values()));
  });
});

connectDb();
app.use("/api/patient/health", healthRouter)
app.use("/api/patients", patientRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/doctor", doctorAvailability)
app.use("/api/mydoctor", doctorRouter)
app.use("/api/bookings", bookingRouter)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.post('/chat', async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'User input is required.' });
  }

  try {
    const response = await getMedicalResponse(input);
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});