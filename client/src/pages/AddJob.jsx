import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill CSS
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Designing");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState(0);
  const [keyResponsibilities, setKeyResponsibilities] = useState([""]);
  const [skillsRequired, setSkillsRequired] = useState([""]);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const addResponsibility = () => {
    setKeyResponsibilities([...keyResponsibilities, ""]);
  };

  const removeResponsibility = (index) => {
    const newResponsibilities = keyResponsibilities.filter((_, i) => i !== index);
    setKeyResponsibilities(newResponsibilities);
  };

  const updateResponsibility = (index, value) => {
    const newResponsibilities = [...keyResponsibilities];
    newResponsibilities[index] = value;
    setKeyResponsibilities(newResponsibilities);
  };

  const addSkill = () => {
    setSkillsRequired([...skillsRequired, ""]);
  };

  const removeSkill = (index) => {
    const newSkills = skillsRequired.filter((_, i) => i !== index);
    setSkillsRequired(newSkills);
  };

  const updateSkill = (index, value) => {
    const newSkills = [...skillsRequired];
    newSkills[index] = value;
    setSkillsRequired(newSkills);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current.root.innerHTML;
      // Validate description is not empty or just whitespace/HTML tags
      const plainText = quillRef.current.getText().trim();
      if (!plainText) {
        toast.error("Please enter a job description.");
        return;
      }

      // Filter out empty responsibilities and skills
      const filteredResponsibilities = keyResponsibilities.filter(resp => resp.trim() !== "");
      const filteredSkills = skillsRequired.filter(skill => skill.trim() !== "");

      if (filteredResponsibilities.length === 0) {
        toast.error("Please add at least one key responsibility.");
        return;
      }

      if (filteredSkills.length === 0) {
        toast.error("Please add at least one required skill.");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        {
          title,
          description,
          keyResponsibilities: filteredResponsibilities,
          skillsRequired: filteredSkills,
          location,
          salary,
          category,
          level,
        },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        setKeyResponsibilities([""]);
        setSkillsRequired([""]);
        quillRef.current.root.innerHTML = "";
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Enter the job description here..."
      });
    }
  }, []);

  if (!companyToken) {
    return (
      <div className="flex items-center justify-center h-[70vh] px-4 text-center">
        <p className="text-xl sm:text-2xl">Please log in as a recruiter to add jobs.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="container p-2 sm:p-4 flex flex-col w-full items-center gap-4"
    >
      {/* Job Title */}
      <div className="w-full max-w-lg">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      {/* Job Description */}
      <div className="w-full max-w-lg">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Job Description
        </label>
        <div
          ref={editorRef}
          className="border-2 border-gray-300 rounded p-2 min-h-[120px] text-sm"
        ></div>
        <div className="text-xs text-gray-400 mt-1">
          Describe the role, expectations, and company culture.
        </div>
      </div>

      {/* Key Responsibilities */}
      <div className="w-full max-w-lg">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Key Responsibilities
        </label>
        {keyResponsibilities.map((responsibility, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded text-sm"
              type="text"
              placeholder="Enter responsibility"
              value={responsibility}
              onChange={(e) => updateResponsibility(index, e.target.value)}
            />
            {keyResponsibilities.length > 1 && (
              <button
                type="button"
                onClick={() => removeResponsibility(index)}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addResponsibility}
          className="px-4 py-2 bg-green-500 text-white rounded text-sm"
        >
          Add Responsibility
        </button>
      </div>

      {/* Skills Required */}
      <div className="w-full max-w-lg">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Skills Required
        </label>
        {skillsRequired.map((skill, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded text-sm"
              type="text"
              placeholder="Enter skill"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
            />
            {skillsRequired.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="px-4 py-2 bg-green-500 text-white rounded text-sm"
        >
          Add Skill
        </button>
      </div>

      {/* Dropdown Fields */}
      <div className="flex flex-col gap-4 w-full max-w-lg sm:flex-row sm:gap-4">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Job Category
          </label>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Job Location
          </label>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Job Level
          </label>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      {/* Job Salary */}
      <div className="w-full max-w-lg">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Job Salary
        </label>
        <input
          className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm"
          type="number"
          placeholder="0"
          onChange={(e) => setSalary(Number(e.target.value))}
          value={salary}
        />
      </div>

      {/* Add Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-black text-white font-medium rounded w-full max-w-lg text-center"
      >
        ADD
      </button>
    </form>
  );
};

export default AddJob;