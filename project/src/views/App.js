import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "../Components/LoginForm/LoginForm";
import ForgotPassword from "../Components/ForgotForm/ForgotPassWord";
import RegisterForm from "../Components/RegisterForm/RegisterForm";
import Home from "../Components/Home/Home";
import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserList from "../Components/User/UserList";
import UserDetail from "../Components/User/UserDetail";
import OfferList from "../Components/Offer/OfferList";
import CreateOffer from "../Components/Offer/CreateOffer";
import EditOffer from "../Components/Offer/EditOffer";
import ScheduleList from "../Components/Schedule/ScheduleList";
import ScheduleDetail from "../Components/Schedule/ScheduleDetail";
import CreateSchedule from "../Components/Schedule/CreateSchedule";
import EditSchedule from "../Components/Schedule/EditSchedule";
import CandidateList from "../Components/Candidate/viewList/CandidateList";
import CreateCandidate from "../Components/Candidate/create/CreateCandidate";
import EditCandidate from "../Components/Candidate/edit/EditCandidate";
import CandidateDetail from "../Components/Candidate/detail/CandidateDetail";
import JobListForCandidate from "../Components/Candidate/viewList/JobListForCandidate";
import EditUser from "../Components/User/EditUser";
import CreateUser from "../Components/User/CreateUser";
import JobList from "../Components/job/list/JobList";
import JobDetail from "../Components/job/detail/JobDetail";
import CreateJob from "../Components/job/create/CreateJob";
import UpdateJob from "../Components/job/update/UpdateJob";
import HomeCreateSchedule from "../Components/Schedule/HomeCreateSchedule";
import OfferDetail from "../Components/Offer/OfferDetail";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user/userlist" element={<UserList />} />
        <Route path="/user/createuser" element={<CreateUser />} />
        <Route path="/user/userdetail/:id" element={<UserDetail />} />
        <Route path="/user/edituser/:id" element={<EditUser />} />
        <Route path="/offer/offerlist" element={<OfferList />} />
        <Route path="/offer/createoffer" element={<CreateOffer />} />
        <Route path="/offer/editoffer/:id" element={<EditOffer />} />
        <Route path="/offer/offerdetail/:id" element={<OfferDetail />} />
        <Route path="/schedule/schedulelist" element={<ScheduleList />} />
        <Route
          path="/schedule/homecreateschedule"
          element={<HomeCreateSchedule />}
        />
        <Route path="/schedule/createschedule" element={<CreateSchedule />} />
        <Route
          path="/schedule/scheduledetail/:id"
          element={<ScheduleDetail />}
        />
        <Route
          path="/schedule/editschedule/:scheduleId"
          element={<EditSchedule />}
        />
        <Route path="/candidate/candidateList" element={<CandidateList />} />

        <Route
          path="/candidate/createCandidate"
          element={<CreateCandidate />}
        />
        <Route
          path="/candidate/editCandidate/:id"
          element={<EditCandidate />}
        />
        <Route
          path="/candidate/candidateDetail/:id"
          element={<CandidateDetail />}
        />
        <Route path="/jobListForCandidate" element={<JobListForCandidate />} />
        <Route path="job/list" element={<JobList />} />
        <Route path="job/view/:id" element={<JobDetail />} />
        <Route path="job/delete/:id" />
        <Route path="job/create" element={<CreateJob />} />
        <Route path="job/update/:id" element={<UpdateJob />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
