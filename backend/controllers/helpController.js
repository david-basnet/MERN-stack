const HelpSubmission = require("../models/HelpSubmission");

const submitHelp = async (req, res) => {
  try {
    const { name, email, issue, description } = req.body;
    const userId = req.user ? req.user._id : null;

    // Validate required fields
    if (!name || !email || !issue || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate issue type
    if (!['login', 'assignment', 'account', 'other'].includes(issue)) {
      return res.status(400).json({ message: "Invalid issue type" });
    }

    // Create new help submission
    const submission = new HelpSubmission({
      name,
      email,
      issue,
      description,
      userId,
      status: 'pending',
      submittedAt: new Date()
    });

    // Save to MongoDB
    const savedSubmission = await submission.save();
    console.log('New help submission saved to MongoDB:', savedSubmission);

    res.status(201).json({
      message: "Help request submitted successfully",
      submission: savedSubmission
    });
  } catch (error) {
    console.error("Error submitting help request:", error);
    res.status(500).json({ 
      message: "Error submitting help request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getHelpSubmissions = async (req, res) => {
  try {
    const submissions = await HelpSubmission.find()
      .sort({ submittedAt: -1 })
      .populate('userId', 'name email role');

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching help submissions:", error);
    res.status(500).json({ 
      message: "Error fetching help submissions",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateHelpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const submission = await HelpSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Help submission not found" });
    }

    res.json({
      message: "Help submission status updated successfully",
      submission
    });
  } catch (error) {
    console.error("Error updating help submission status:", error);
    res.status(500).json({ 
      message: "Error updating help submission status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  submitHelp,
  getHelpSubmissions,
  updateHelpStatus
}; 