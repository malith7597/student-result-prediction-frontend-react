import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StudentForm from "../components/studentForm";

const Dashboard = () => {
  const { authToken } = useAuth();

  if (!authToken) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div style={{ marginTop: "10em" }}>
        <StudentForm />
      </div>
    </div>
  );
};

export default Dashboard;
