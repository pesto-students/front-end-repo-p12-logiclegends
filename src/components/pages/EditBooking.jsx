import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tickmark from "../../assets/tickmark.png";
import Navbar from "../Navbar";
import { useUserContext } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";

const EditBooking = () => {
  const { trainerId, bookingId } = useParams();
  const [trainer, setTrainer] = useState({});

  const { user, loginUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    user && loginUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [bookingInfo, setBookingInfo] = useState({
    modeOfTraining: "",
    workoutType: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setBookingInfo({ ...bookingInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const trainerData = await axios.get(
          `https://dumbbelldoor-backned.onrender.com/api/trainer/fetchTrainerDetails/${trainerId}`
        );
        setTrainer(trainerData.data.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrainerDetails();
  }, [trainerId]);

  const editBooking = async () => {
    if (
      bookingInfo.modeOfTraining === "" ||
      bookingInfo.workoutType === "" ||
      bookingInfo.date === "" ||
      bookingInfo.startTime === "" ||
      bookingInfo.endTime === ""
    ) {
      toast.error("Please fill the booking details correctly!");
    } else {
      try {
        const response = await axios.patch(
          `https://dumbbelldoor-backned.onrender.com/api/bookings/update-booking-details/${bookingId}`,
          {
            date: bookingInfo.date,
            customerId: user.id,
            customerEmail: user.email,
            customerName: user.name,
            trainerName: trainer.name,
            trainerId: trainer._id,
            workoutType: bookingInfo.workoutType,
            modeOfTraining: bookingInfo.modeOfTraining,
            startTime: bookingInfo.startTime,
            endTime: bookingInfo.endTime,
            amount: (bookingInfo.endTime - bookingInfo.startTime) * 500,
          }
        );
        toast.success(response.data.message);
        navigate(`/customer/${user.id}/my-bookings`);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="w-full relative [background:linear-gradient(108.87deg,_#00101c,_#00101c,_#29000f)] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] overflow-hidden flex flex-col items-center justify-start pt-[3.813rem] pb-[3.875rem] pr-[3.438rem] pl-[1.25rem] box-border gap-[2.688rem_0rem] tracking-[normal] mq750:gap-[2.688rem_0rem] mq1275:pr-[1.688rem] mq1275:box-border">
      <div style={{ marginTop: "-3.5rem" }}>
        <Navbar />
      </div>
      <section className="w-[75%] flex flex-row items-start justify-start py-[0rem] pr-[0rem] pl-[0.75rem] box-border max-w-full">
        <div className="flex flex-1 items-start justify-center rt gap-[0rem_2.813rem] max-w-full mq750:gap-[0rem_2.813rem] mq1100:flex-wrap">
          <div className=" w-[40%] border-2 border-gray-600 py-8 rounded-xl text-white">
            <div className=" w-[85%] flex flex-col gap-5 m-auto">
              <div className=" w-full flex justify-between items-center ">
                <img
                  src={trainer && trainer.profilePicture}
                  className=" w-[8rem] h-[8rem] rounded-full"
                  alt=""
                />
                <div className=" flex justify-center items-center gap-2">
                  <h1 className="m-0 text-[1.6rem] font-semibold font-inherit mq450:text-[1.5rem] mq750:text-[2rem]">
                    {trainer && trainer.name}
                  </h1>

                  <img
                    className=" relative top-1 w-[1.5rem] h-[1.5rem] rounded-mini object-cover"
                    loading="lazy"
                    alt=""
                    src={tickmark}
                  />
                </div>
              </div>
              <div className=" w-full flex justify-between items-center">
                <div className=" border-2 border-gray-600 px-4 py-2 rounded-lg text-xl w-[11rem] flex justify-center items-center">
                  <label className=" ">
                    <input
                      type="radio"
                      name="modeOfTraining"
                      id="in-person"
                      className=" w-4 h-4 mr-4"
                      onChange={handleChange}
                      value="In-person"
                    />
                    In-person
                  </label>
                </div>
                <div className=" border-2 border-gray-600 px-4 py-2 rounded-lg text-xl w-[11rem] flex justify-center items-center">
                  <label className=" ">
                    <input
                      type="radio"
                      name="modeOfTraining"
                      id="online"
                      className=" w-4 h-4 mr-4"
                      onChange={handleChange}
                      value="Online"
                    />
                    Online
                  </label>
                </div>
              </div>
              <div className=" w-full text-lg">
                <div className=" w-full flex justify-between items-center ">
                  <p>Workout Type</p>
                  <select
                    name="workoutType"
                    id="workoutType"
                    className=" w-[50%] text-white bg-transparent outline-none border border-gray-600 border-t-0 border-l-0 border-r-0 rounded-lg pb-3 px-3"
                    onChange={handleChange}
                    value={bookingInfo.workoutType}
                  >
                    <option value="" className=" text-black">
                      Select
                    </option>
                    <option value="Muscle Training" className=" text-black">
                      Muscle Building
                    </option>
                    <option value="Nutrition Training" className=" text-black">
                      Nutrition Training
                    </option>
                    <option value="Weight Loss" className=" text-black">
                      Weight Loss
                    </option>
                    <option value="Functional Training" className=" text-black">
                      Functional Training
                    </option>
                  </select>
                </div>
              </div>
              <div className=" w-full text-lg">
                <div className=" w-full flex justify-between items-center ">
                  <p>Date</p>
                  <input
                    className=" w-[50%] outline-none bg-transparent border border-gray-600 border-t-0 border-l-0 border-r-0 rounded-lg pb-3 px-3"
                    type="date"
                    name="date"
                    id="date"
                    onChange={handleChange}
                    value={bookingInfo.date}
                  />
                </div>
              </div>
              <div className=" w-full text-lg">
                <div className=" w-full flex justify-between items-center ">
                  <p>Start Time</p>
                  <select
                    className=" w-[50%] text-white bg-transparent outline-none border border-gray-600 border-t-0 border-l-0 border-r-0 rounded-lg pb-3 px-3"
                    name="startTime"
                    id="startTime"
                    onChange={handleChange}
                    value={bookingInfo.startTime}
                  >
                    <option value="" className=" text-black">
                      Select
                    </option>
                    <option value="06" className=" text-black">
                      06:00
                    </option>
                    <option value="07" className=" text-black">
                      07:00
                    </option>
                    <option value="08" className=" text-black">
                      08:00
                    </option>
                    <option value="09" className=" text-black">
                      09:00
                    </option>
                    <option value="10" className=" text-black">
                      10:00
                    </option>
                    <option value="11" className=" text-black">
                      11:00
                    </option>
                    <option value="12" className=" text-black">
                      12:00
                    </option>
                    <option value="13" className=" text-black">
                      13:00
                    </option>
                    <option value="14" className=" text-black">
                      14:00
                    </option>
                    <option value="15" className=" text-black">
                      15:00
                    </option>
                    <option value="16" className=" text-black">
                      16:00
                    </option>
                    <option value="17" className=" text-black">
                      17:00
                    </option>
                    <option value="18" className=" text-black">
                      18:00
                    </option>
                    <option value="19" className=" text-black">
                      19:00
                    </option>
                    <option value="20" className=" text-black">
                      20:00
                    </option>
                    <option value="21" className=" text-black">
                      21:00
                    </option>
                  </select>
                </div>
              </div>
              <div className=" w-full text-lg">
                <div className=" w-full flex justify-between items-center ">
                  <p>End Time</p>
                  <select
                    className=" w-[50%] text-white bg-transparent outline-none border border-gray-600 border-t-0 border-l-0 border-r-0 rounded-lg pb-3 px-3"
                    name="endTime"
                    id="endTime"
                    onChange={handleChange}
                    value={bookingInfo.endTime}
                  >
                    <option value="" className=" text-black">
                      Select
                    </option>
                    <option value="07" className=" text-black">
                      07:00
                    </option>
                    <option value="08" className=" text-black">
                      08:00
                    </option>
                    <option value="09" className=" text-black">
                      09:00
                    </option>
                    <option value="10" className=" text-black">
                      10:00
                    </option>
                    <option value="11" className=" text-black">
                      11:00
                    </option>
                    <option value="12" className=" text-black">
                      12:00
                    </option>
                    <option value="13" className=" text-black">
                      13:00
                    </option>
                    <option value="14" className=" text-black">
                      14:00
                    </option>
                    <option value="15" className=" text-black">
                      15:00
                    </option>
                    <option value="16" className=" text-black">
                      16:00
                    </option>
                    <option value="17" className=" text-black">
                      17:00
                    </option>
                    <option value="18" className=" text-black">
                      18:00
                    </option>
                    <option value="19" className=" text-black">
                      19:00
                    </option>
                    <option value="20" className=" text-black">
                      20:00
                    </option>
                    <option value="21" className=" text-black">
                      21:00
                    </option>
                    <option value="22" className=" text-black">
                      22:00
                    </option>
                  </select>
                </div>
              </div>
              <div className=" w-full text-lg">
                <div className=" w-full flex justify-between items-center ">
                  <button className=" bg-sky-500  text-black font-semibold w-[48%] py-2 rounded-lg">
                    <Link to={`/customer/${user.id}/my-bookings`}>
                      My Bookings
                    </Link>
                  </button>
                  <button
                    className=" bg-green-500 text-black font-semibold w-[48%] py-2 rounded-lg"
                    onClick={editBooking}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default EditBooking;
