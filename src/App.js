import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import PostTrip from './pages/PostTrip';
import UpdateCarInfo from './pages/UpdateCarInfo';
import DriverRegistration from './pages/DriverRegistration';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import FooterNav from './components/FooterNav';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <FooterNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-car-info" element={<UpdateCarInfo />} />
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/post-trip" element={<PostTrip />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;