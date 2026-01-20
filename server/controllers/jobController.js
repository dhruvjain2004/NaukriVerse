import Job from "../models/Job.js";

// Get all jobs with pagination support
export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalJobs = await Job.countDocuments({ visible: true });
    const jobs = await Job.find({ visible: true })
      .populate({
        path: "companyId",
        select: "-password",
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ 
      success: true, 
      jobs,
      pagination: {
        total: totalJobs,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalJobs / parseInt(limit))
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single job by id
export const getJobById = async (req, res) => {
  try {
    const id = req.params.id;  // Correct way to access id
    
    const job = await Job.findById(id).populate({
      path: 'companyId',
      select: '-password',
    });

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    res.json({
      success: true,
      job,  // Include the job in the response
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};