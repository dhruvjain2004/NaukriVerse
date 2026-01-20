import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import Notification from "../models/Notification.js";
import User from "../models/user.js";
// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "Company already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Use buffer for Cloudinary upload
    const b64 = Buffer.from(imageFile.buffer).toString('base64');
    const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
    const imageUpload = await cloudinary.uploader.upload(dataURI);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        message: "Login Successful",
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get Company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Post a new job
export const postJob = async (req, res) => {
  const { title, description, keyResponsibilities, skillsRequired, location, salary, level, category } = req.body;
  const companyId = req.company._id;
  try {
    const newJob = new Job({
      title,
      description,
      keyResponsibilities: Array.isArray(keyResponsibilities) ? keyResponsibilities : [keyResponsibilities],
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired],
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });
    await newJob.save();

    // Create notifications for all users
    const allUsers = await User.find().select("_id");
    const company = await Company.findById(companyId).select("name");

    const notifications = allUsers.map((user) => ({
      userId: user._id,
      jobId: newJob._id,
      companyId: companyId,
      jobTitle: title,
      jobRole: category || title,
      companyName: company.name,
      read: false,
      createdAt: new Date(),
    }));

    await Notification.insertMany(notifications);

    res.json({ success: true, newJob, message: "Job Posted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    //Find job applications for the user and populate related data

    const applications = await JobApplication.find({companyId})
    .populate('userId', 'name image resume')
    .populate('jobId', 'title location category level salary')
    .exec()

    return res.json({
      success:true,
      applications
    })
  } catch (error) {
    res.json({success:false, message: error.message})
  }
};

//Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;

    const jobs = await Job.find({ companyId });

    //Adding no of applicants info in data
     const jobsData = await Promise.all(jobs.map(async(job)=>{
      const applicants = await JobApplication.find({jobId: job._id});
      return {...job.toObject(), applicants:applicants.length}
    }))

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Change job Application status
export const changeJobApplicationsStatus = async (req, res) => {

 try {
  const {id,status} = req.body;

  //Find job application and update status
  await JobApplication.findOneAndUpdate({
    _id : id
  },{status})
  res.json({
    success:true, message:'Status Changed'
  })
 } catch (error) {
  res.json({success:false, message:error.message})
 }
};

//Change job visiblity
export const changeVisiblity = async (req, res) => {
  try {
    const { id } = req.body;

    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};