import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useUserContext } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


const steps = [
  "Personal Details",
  "Professional Background",
  "Services & Availability",
  "Contact Details",
];

const TrainerRegistration = () => {
  const { user, loginUser } = useUserContext();

  const cookies = document.cookie;

  // Parse cookies into an object
  const cookieObj = cookies.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {});

  // Access specific cookie
  // const userEmail = cookieObj["email"];
  // const userAccessToken = cookieObj["token"];
  const userId = cookieObj["id"];
  const userEmail = cookieObj["email"];

  useEffect(() => {
    // Call the loginUser function when the component mounts
    user && loginUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const [availability, setAvailability] = useState([]);

  const [trainerInfo, setTrainerInfo] = useState({
    name: "",
    gender: "",
    profilePicture: "",
    description: "",
    yearsOfExperience: "",
    certifications: "",
    specializations: "",
    typesOfServices: [],
    day: "",
    startTime: "",
    endTime: "",
    location: "",
    phoneNumber: "",
    instagramID: "",
    facebookID: "",
  });

  const handleNext = (e) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      handleFinish(e);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    const formData = new FormData();

    // Append each field to FormData
    formData.append("email", userEmail);
    formData.append("name", trainerInfo.name);
    formData.append("gender", trainerInfo.gender);
    formData.append("profilePicture", trainerInfo.profilePicture);
    formData.append("description", trainerInfo.description);
    formData.append("yearsOfExperience", trainerInfo.yearsOfExperience);
    formData.append("certifications", trainerInfo.certifications);
    formData.append("specializations", trainerInfo.specializations);
    trainerInfo.typesOfServices.forEach((service) =>
      formData.append("typesOfServices", service)
    );
    availability.forEach((schedule, index) => {
      console.log(index, schedule);
      formData.append(`availability[${index}][day]`, schedule.day);
      formData.append(`availability[${index}][startTime]`, schedule.startTime);
      formData.append(`availability[${index}][endTime]`, schedule.endTime);
    });
    formData.append("location", trainerInfo.location);
    formData.append("phoneNumber", trainerInfo.phoneNumber);
    formData.append("facebookID", trainerInfo.facebookID);
    formData.append("instagramID", trainerInfo.instagramID);

    try {
      const response = await axios.patch(
        "https://dumbbelldoor-backned.onrender.com/api/trainer/build-your-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      document.cookie = `profileStatus=complete; path=/`;
      navigate(`/trainer/${userId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Handler for file change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
    // Check if the selected file format is allowed
    if (file && allowedFormats.includes(file.type)) {
    setTrainerInfo({
      ...trainerInfo,
      profilePicture: file, // Update the profilePicture in state
      });

    } else {
      toast.error("Please select a valid image file (JPEG, JPG, or PNG).");
      // Clear the file input
      e.target.value = null;
    }
  };


  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "inPerson" || name === "online") {
      setTrainerInfo((prevState) => {
        let updatedModes = [...prevState.typesOfServices];
        if (checked) {
          updatedModes.push(value);
        } else {
          updatedModes = updatedModes.filter((mode) => mode !== value);
        }
        return {
          ...prevState,
          typesOfServices: updatedModes,
        };
      });
    } else {
      setTrainerInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addAvailability = () => {
    const x = {
      day: trainerInfo.day,
      startTime: trainerInfo.startTime,
      endTime: trainerInfo.endTime,
    };
    setAvailability([...availability, x]);
  };

  const deleteSchedule = (index) => {
    const newAvailability = [...availability];
    newAvailability.splice(index, 1);
    setAvailability(newAvailability);
  };

  const personalDetails = () => {
    return (
      <div className=" w-[70%] m-auto flex flex-col justify-center items-center gap-4 mt-12">
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none"
          placeholder="Name"
          name="name"
          onChange={handleChange}
          value={trainerInfo.name}
        />
        <select
          className="w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none"
          name="gender"
          id="gender"
          onChange={handleChange}
          value={trainerInfo.gender}
        >
          <option className=" text-black" value="">
            Gender
          </option>
          <option className=" text-black" value="Male">
            Male
          </option>
          <option className=" text-black" value="Female">
            Female
          </option>
        </select>
        <input
          type="file"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none "
          placeholder="Profile Picture"
          name="profilePicture"
          onChange={handleFileChange}
          // value={trainerInfo.profilePicture}
        />
        <textarea
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none resize-none"
          placeholder="Description"
          name="description"
          onChange={handleChange}
          value={trainerInfo.description}
        />
      </div>
    );
  };

  const professionalBackground = () => {
    return (
      <div className=" w-[70%] m-auto flex flex-col justify-center items-center gap-4 mt-12">
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md  outline-none"
          placeholder="Years of Experience"
          name="yearsOfExperience"
          onChange={handleChange}
          value={trainerInfo.yearsOfExperience}
        />
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none"
          placeholder="Certifications"
          name="certifications"
          onChange={handleChange}
          value={trainerInfo.certifications}
        />
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none "
          placeholder="Specializations"
          name="specializations"
          onChange={handleChange}
          value={trainerInfo.specializations}
        />
      </div>
    );
  };

  const servicesAndAvailability = () => {
    return (
      <div className=" w-[70%] m-auto flex flex-col items-start gap-8 mt-12">
        <div className=" flex flex-col gap-4">
          <p className=" text-gray-400">Mode of Training</p>
          <div className=" flex gap-4">
            <label>
              <input
                className=" w-4 h-4"
                type="checkbox"
                name="inPerson"
                id="inPerson"
                value="In-person"
                onChange={handleChange}
              />{" "}
              In-person
            </label>
            <label>
              <input
                className=" w-4 h-4"
                type="checkbox"
                name="online"
                id="online"
                value="Online"
                onChange={handleChange}
              />{" "}
              Online
            </label>
          </div>
        </div>
        <hr className=" w-full h-px bg-gray-500 border-0" />
        <div className=" flex flex-col gap-4">
          <p className=" text-gray-400">Availability & Schedule</p>
          <div className=" flex gap-4">
            <div className=" flex gap-2">
              <label>Day</label>
              <select
                className=" rounded-md text-black"
                name="day"
                id="day"
                onChange={handleChange}
                value={trainerInfo.day}
              >
                <option value="">Select</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div className=" flex gap-2">
              <label>Start Time</label>
              <select
                className=" rounded-md text-black"
                name="startTime"
                id="startTime"
                onChange={handleChange}
                value={trainerInfo.startTime}
              >
                <option value="">00:00</option>
                <option value="06">06:00</option>
                <option value="07">07:00</option>
                <option value="08">08:00</option>
                <option value="09">09:00</option>
                <option value="10">10:00</option>
                <option value="11">11:00</option>
                <option value="12">12:00</option>
                <option value="13">13:00</option>
                <option value="14">14:00</option>
                <option value="15">15:00</option>
                <option value="16">16:00</option>
                <option value="17">17:00</option>
                <option value="18">18:00</option>
                <option value="19">19:00</option>
                <option value="20">20:00</option>
                <option value="21">21:00</option>
              </select>
            </div>
            <div className=" flex gap-2">
              <label>End Time</label>
              <select
                className="rounded-md text-black"
                name="endTime"
                id="endTime"
                onChange={handleChange}
                value={trainerInfo.endTime}
              >
                <option value="">00:00</option>{" "}
                <option value="07">07:00</option>
                <option value="08">08:00</option>
                <option value="09">09:00</option>
                <option value="10">10:00</option>
                <option value="11">11:00</option>
                <option value="12">12:00</option>
                <option value="13">13:00</option>
                <option value="14">14:00</option>
                <option value="15">15:00</option>
                <option value="16">16:00</option>
                <option value="17">17:00</option>
                <option value="18">18:00</option>
                <option value="19">19:00</option>
                <option value="20">20:00</option>
                <option value="21">21:00</option>
                <option value="22">22:00</option>
              </select>
            </div>

            <button
              className=" bg-green-400 text-black px-3 font-bold rounded-md "
              onClick={addAvailability}
            >
              Add
            </button>
          </div>
          {availability.length !== 0 && (
            <div className=" w-full">
              <table className=" w-full">
                <tr>
                  <th className=" text-left">Sl no.</th>{" "}
                  <th className=" text-left">Day</th>{" "}
                  <th className=" text-left">Start Time</th>{" "}
                  <th className=" text-left">End Time</th>{" "}
                </tr>
                {availability.map((schedule, index) => (
                  <tr key={index} className=" w-full">
                    <td className=" text-left">{index + 1}</td>
                    <td className=" text-left">{schedule.day}</td>
                    <td className=" text-left">{schedule.startTime}</td>
                    <td className=" text-left">{schedule.endTime}</td>
                    <td
                      className=" text-center cursor-pointer font-semibold text-gray-400 hover:text-white transition-all"
                      onClick={() => {
                        deleteSchedule(index);
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          )}
        </div>
        <hr className=" w-full h-px bg-gray-500 border-0" />
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none "
          placeholder="Location"
          name="location"
          onChange={handleChange}
          value={trainerInfo.location}
        />
      </div>
    );
  };

  const contactDetails = () => {
    return (
      <div className=" w-[70%] m-auto flex flex-col justify-center items-center gap-4 mt-12">
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none"
          placeholder="Phone Number"
          onChange={handleChange}
          name="phoneNumber"
          value={trainerInfo.phoneNumber}
        />
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none "
          placeholder="Instagram ID (optional)"
          onChange={handleChange}
          name="instagramID"
          value={trainerInfo.instagramID}
        />
        <input
          type="text"
          className=" w-full p-4 bg-transparent border border-gray-500 rounded-md outline-none "
          placeholder="Facebook ID (optional)"
          onChange={handleChange}
          name="facebookID"
          value={trainerInfo.facebookID}
        />
      </div>
    );
  };

  const StepComponents = [
    () => personalDetails(),
    () => professionalBackground(),
    () => servicesAndAvailability(),
    () => contactDetails(),
  ];

  return (
    <div className="w-full min-h-[100vh] relative [background:linear-gradient(108.87deg,_#00101c,_#00101c,_#29000f)] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] overflow-hidden flex flex-col items-center justify-start pt-[3.813rem] pb-[3.875rem] pr-[3.438rem] pl-[1.25rem] box-border gap-[2.688rem_0rem] tracking-[normal] mq750:gap-[2.688rem_0rem] mq1275:pr-[1.688rem] mq1275:box-border text-white">
      <div style={{ marginTop: "-3.5rem" }}>
        <Navbar />
      </div>
      <div className=" border border-gray-500 p-6 rounded-xl">
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>
                    <Typography color="white">{label}</Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <Typography sx={{ mt: 2, mb: 1, color: "white" }}>
              All steps completed - you&apos;re finished
            </Typography>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, color: "white" }}>
                {StepComponents[activeStep] && StepComponents[activeStep]()}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={(e) => handleNext(e)}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TrainerRegistration;
