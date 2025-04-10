const CourseAssignment = require('../models/CourseAssignment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// Get all assignments for a specific course
const getAssignments = async (req, res) => {
  try {
    console.log('Fetching assignments...');
    const { course } = req.query;
    let query = {};
    
    if (course) {
      query.course = course;
    }

    console.log('Query:', query);
    const assignments = await CourseAssignment.find(query)
      .populate({
        path: 'createdBy',
        select: 'name email',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    console.log('Found assignments:', assignments);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    console.log('Received assignment creation request:', req.body);
    console.log('User from token:', req.user);

    const { title, description, course } = req.body;
    
    // Validate required fields
    if (!title || !description || !course) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          title: !title,
          description: !description,
          course: !course
        }
      });
    }

    // Validate course
    const validCourses = ['Advanced Programming', 'Web Development', 'Machine Learning'];
    if (!validCourses.includes(course)) {
      return res.status(400).json({ 
        message: 'Invalid course',
        validCourses
      });
    }

    // Create the assignment with the correct user ID
    const assignment = new CourseAssignment({
      title: title.trim(),
      description: description.trim(),
      course: course.trim(),
      createdBy: req.user._id
    });

    console.log('Creating assignment with data:', {
      title: assignment.title,
      description: assignment.description,
      course: assignment.course,
      createdBy: assignment.createdBy
    });

    // Save the assignment
    const savedAssignment = await assignment.save();
    console.log('Assignment saved successfully:', savedAssignment);

    // Populate the creator information
    const populatedAssignment = await CourseAssignment.findById(savedAssignment._id)
      .populate('createdBy', 'name email');
    
    console.log('Assignment populated with creator info:', populatedAssignment);
    
    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error creating assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update an assignment
const updateAssignment = async (req, res) => {
  try {
    const { title, description, course } = req.body;
    console.log('Updating assignment:', {
      id: req.params.id,
      title,
      description,
      course
    });

    const assignment = await CourseAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update the assignment fields
    assignment.title = title.trim();
    assignment.description = description.trim();
    assignment.course = course.trim();

    // Save the updated assignment
    const updatedAssignment = await assignment.save();
    console.log('Assignment updated successfully:', updatedAssignment);

    // Populate the creator information
    await updatedAssignment.populate('createdBy', 'name email');
    console.log('Updated assignment with creator info:', updatedAssignment);

    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

// Delete an assignment
const deleteAssignment = async (req, res) => {
  try {
    console.log('Attempting to delete assignment:', req.params.id);
    console.log('User attempting deletion:', req.user._id);

    const assignment = await CourseAssignment.findById(req.params.id);
    console.log('Found assignment:', assignment);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Remove creator check - any teacher can delete

    // Delete associated files
    for (const submission of assignment.submissions) {
      const filePath = path.join(__dirname, '..', submission.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Use deleteOne instead of remove (which is deprecated)
    await CourseAssignment.deleteOne({ _id: req.params.id });
    console.log('Assignment deleted successfully');
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error deleting assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Submit an assignment
const submitAssignment = [
  upload.single('file'),
  async (req, res) => {
    try {
      console.log('Received assignment submission:', {
        userId: req.user._id,
        assignmentId: req.body.assignmentId,
        hasFile: !!req.file
      });

      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const assignment = await CourseAssignment.findById(req.body.assignmentId);
      console.log('Found assignment:', assignment ? 'Yes' : 'No');

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      // Check if student has already submitted
      const existingSubmission = assignment.submissions.find(
        submission => submission.student.toString() === req.user._id.toString()
      );

      if (existingSubmission) {
        console.log('Updating existing submission');
        // Delete old file
        const oldFilePath = path.join(__dirname, '..', existingSubmission.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }

        // Update existing submission
        existingSubmission.file = req.file.path;
        existingSubmission.submittedAt = Date.now();
      } else {
        console.log('Creating new submission');
        // Add new submission
        assignment.submissions.push({
          student: req.user._id,
          file: req.file.path
        });
      }

      await assignment.save();
      console.log('Assignment saved successfully');
      res.json({ message: 'Assignment submitted successfully' });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ 
        message: 'Error submitting assignment',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
];

// Delete all assignments
const deleteAllAssignments = async (req, res) => {
  try {
    console.log('Attempting to delete all assignments');
    console.log('User attempting deletion:', req.user._id);

    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can delete all assignments' });
    }

    // Get all assignments
    const assignments = await CourseAssignment.find({});
    console.log(`Found ${assignments.length} assignments to delete`);

    // Delete all associated files
    for (const assignment of assignments) {
      for (const submission of assignment.submissions) {
        const filePath = path.join(__dirname, '..', submission.file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete all assignments
    await CourseAssignment.deleteMany({});
    console.log('All assignments deleted successfully');
    
    res.json({ message: 'All assignments deleted successfully' });
  } catch (error) {
    console.error('Error deleting all assignments:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error deleting all assignments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  deleteAllAssignments,
  upload
}; 