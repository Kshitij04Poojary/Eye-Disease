const Patient = require('../models/patientDetails');

const patientController = {
    createPatient: async (req, res, next) => {
        try {
            const { name, age, gender, bloodGroup } = req.body;

            // ✅ Ensure required fields are present
            if (!name || !age || !gender || !bloodGroup) {
                console.log("we are here");
                return res.status(400).json({ success: false, message: "All fields are required." });
            }
            // ✅ No need to check for req.body.patientData
            const patientData = { ...req.body };
            
            // ✅ Attach file paths if images are uploaded
            if (req.files) {
                if (req.files.leftEyeImage) {
                    patientData.leftEyeImage = {
                        path: req.files.leftEyeImage[0].path,
                        originalName: req.files.leftEyeImage[0].originalname,
                        mimetype: req.files.leftEyeImage[0].mimetype
                    };
                }
                if (req.files.rightEyeImage) {
                    patientData.rightEyeImage = {
                        path: req.files.rightEyeImage[0].path,
                        originalName: req.files.rightEyeImage[0].originalname,
                        mimetype: req.files.rightEyeImage[0].mimetype
                    };
                }
            }

            // ✅ Save to MongoDB
            const patient = new Patient(patientData);
            await patient.save();

            res.status(201).json({
                success: true,
                message: "Patient registered successfully",
                data: patient
            });
        } catch (error) {
            console.error("Error:", error);
            next(error);
        }
    },
    // Get all patients
    getAllPatients: async (req, res, next) => {
        try {
            const patients = await Patient.find().select('-__v');
            res.json({
                success: true,
                count: patients.length,
                data: patients
            });
        } catch (error) {
            next(error);
        }
    },

    // Get single patient by ID
    getPatientById: async (req, res, next) => {
        try {
            const patient = await Patient.findById(req.params.id).select('-__v');
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }
            res.json({
                success: true,
                data: patient
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = patientController;