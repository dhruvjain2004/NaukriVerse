import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { states, getCitiesByState } from "../data/indianStatesCities";

const initialState = {
  name: "",
  headline: "",
  location: "",
  mobileNumber: "",
  workStatus: "experienced",
  degree: "",
  institute: "",
  gender: "",
  birthday: "",
  about: "",
  preferredJobType: "",
  availability: "",
};

const Profile = () => {
  const { userData, backendUrl, userToken, fetchUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken, navigate]);

  useEffect(() => {
    if (userData) {
      const location = userData.location || "";
      let parsedState = "";
      let parsedCity = "";
      
      // Parse existing location if it's in "City, State" format
      if (location) {
        const parts = location.split(",").map(p => p.trim());
        if (parts.length >= 2) {
          parsedCity = parts[0];
          const stateName = parts.slice(1).join(", ");
          if (states.includes(stateName)) {
            parsedState = stateName;
          }
        } else if (states.includes(location)) {
          parsedState = location;
        } else {
          // Try to find if location matches any city
          for (const state of states) {
            const cities = getCitiesByState(state);
            if (cities.includes(location)) {
              parsedState = state;
              parsedCity = location;
              break;
            }
          }
        }
      }
      
      setSelectedState(parsedState);
      setSelectedCity(parsedCity);
      
      setFormValues((prev) => ({
        ...prev,
        name: userData.name || "",
        headline: userData.headline || "",
        location: userData.location || "",
        mobileNumber: userData.mobileNumber || "",
        workStatus: userData.workStatus || "experienced",
        degree: userData.degree || "",
        institute: userData.institute || "",
        gender: userData.gender || "",
        birthday: userData.birthday || "",
        about: userData.about || "",
        preferredJobType: userData.preferredJobType || "",
        availability: userData.availability || "",
      }));
    }
  }, [userData]);

  const completion = useMemo(() => {
    const importantFields = [
      "headline",
      "location",
      "degree",
      "institute",
      "about",
      "preferredJobType",
      "availability",
      "gender",
    ];
    const filled = importantFields.filter((field) => formValues[field]?.trim()).length;
    return Math.round((filled / importantFields.length) * 100) || 0;
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity(""); // Reset city when state changes
    // Update location in formValues
    const location = state ? (selectedCity ? `${selectedCity}, ${state}` : state) : "";
    setFormValues((prev) => ({ ...prev, location }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    // Update location in formValues as "City, State"
    const location = city && selectedState ? `${city}, ${selectedState}` : selectedState || "";
    setFormValues((prev) => ({ ...prev, location }));
  };

  const initials = useMemo(() => {
    const baseName = (formValues.name || userData?.name || "Candidate").trim();
    if (!baseName) return "CA";
    const parts = baseName.split(" ").filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [formValues.name, userData?.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    try {
      setSaving(true);
      // Ensure location is properly formatted
      const location = selectedCity && selectedState 
        ? `${selectedCity}, ${selectedState}` 
        : selectedState || formValues.location || "";
      
      const updatedFormValues = {
        ...formValues,
        location
      };
      
      const { data } = await axios.patch(`${backendUrl}/api/users/profile`, updatedFormValues, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (data.success) {
        toast.success("Profile updated");
        fetchUserData();
      } else {
        toast.error(data.message || "Unable to update profile");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const triggerPhotoDialog = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post(`${backendUrl}/api/users/update-image`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success("Profile photo updated");
        fetchUserData();
      } else {
        toast.error(data.message || "Unable to update photo");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  };

  const focusField = (fieldId) => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex items-center gap-5 flex-1">
              <div className="relative flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center text-3xl font-semibold overflow-hidden">
                  {userData?.image ? (
                    <img src={userData.image} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    initials || "CA"
                  )}
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-600 font-semibold mt-3"
                  onClick={triggerPhotoDialog}
                  disabled={photoUploading}
                >
                  {photoUploading ? "Uploading..." : userData?.image ? "Change photo" : "Add photo"}
                </button>
                <span className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white border rounded-full px-3 py-0.5 text-xs font-semibold text-blue-600 shadow-sm">
                  {completion}%
                </span>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-gray-900">{formValues.name || "Add your name"}</h2>
                  <button
                    type="button"
                    className="text-sm text-blue-600 underline"
                    onClick={() => document.getElementById("profile-form")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Edit
                  </button>
                </div>
                <div className="text-gray-600">
                  {formValues.degree || formValues.institute ? (
                    <p>
                      {formValues.degree} {formValues.institute && `· ${formValues.institute}`}
                    </p>
                  ) : (
                    <button type="button" className="text-blue-600 font-medium" onClick={() => focusField("profile-degree")}>
                      Add education
                    </button>
                  )}
                </div>
                <div className="text-gray-500">
                  {formValues.location ? (
                    <p>{formValues.location}</p>
                  ) : (
                    <button type="button" className="text-blue-600 font-medium" onClick={() => focusField("profile-location-state")}>
                      Add location
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{formValues.mobileNumber || "Add phone"}</span>
                  <span>{userData?.email}</span>
                </div>
                {/* <div className="flex gap-4 text-sm text-blue-600">
                  <button type="button" onClick={() => focusField("profile-birthday")}>
                    + Add birthday
                  </button>
                </div> */}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full lg:w-80 text-center text-gray-500">
              <p className="text-sm">Keep your information fresh to get better matches.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm mt-8">
            <div className="border-b px-6 flex gap-8 text-sm font-semibold text-gray-500">
              <button className="py-4 border-b-2 border-blue-600 text-blue-600">View &amp; Edit</button>
              <button className="py-4 hover:text-blue-600">Activity insights</button>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Quick links</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>Preference</li>
                  <li>Education</li>
                  <li>Key skills</li>
                  <li>Projects</li>
                  <li>Accomplishments</li>
                </ul>
              </div>
              <div className="lg:col-span-2">
                <form id="profile-form" className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full name</label>
                      <input
                        id="profile-name"
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Headline</label>
                      <input
                        id="profile-headline"
                        type="text"
                        name="headline"
                        value={formValues.headline}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">State</label>
                          <select
                            id="profile-location-state"
                            value={selectedState}
                            onChange={handleStateChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select State</option>
                            {states.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">City</label>
                          <select
                            id="profile-location-city"
                            value={selectedCity}
                            onChange={handleCityChange}
                            disabled={!selectedState}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select City</option>
                            {selectedState && getCitiesByState(selectedState).map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mobile number</label>
                      <input
                        id="profile-mobile"
                        type="tel"
                        name="mobileNumber"
                        value={formValues.mobileNumber}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Work status</label>
                      <select
                        id="profile-workStatus"
                        name="workStatus"
                        value={formValues.workStatus}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="experienced">Experienced</option>
                        <option value="fresher">Fresher</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred job type</label>
                      <input
                        id="profile-preferredJobType"
                        type="text"
                        name="preferredJobType"
                        value={formValues.preferredJobType}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Jobs, Internships etc."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Availability to join</label>
                      <input
                        id="profile-availability"
                        type="text"
                        name="availability"
                        value={formValues.availability}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 15 days or less"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Gender</label>
                      <select
                        id="profile-gender"
                        name="gender"
                        value={formValues.gender}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Birthday</label>
                      <input
                        id="profile-birthday"
                        type="date"
                        name="birthday"
                        value={formValues.birthday}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Degree</label>
                      <input
                        id="profile-degree"
                        type="text"
                        name="degree"
                        value={formValues.degree}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="B.Tech, B.E, etc."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Institute</label>
                      <input
                        id="profile-institute"
                        type="text"
                        name="institute"
                        value={formValues.institute}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="College / University"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">About / Career summary</label>
                    <textarea
                      id="profile-about"
                      name="about"
                      value={formValues.about}
                      onChange={handleChange}
                      rows={4}
                      className="mt-2 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your experience, goals, and strengths"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;

