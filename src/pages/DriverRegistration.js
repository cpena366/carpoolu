import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

function DriverRegistration() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [carColor, setCarColor] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carMake, setCarMake] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to register as a driver.");
      return;
    }

    const { error } = await supabase
      .from('Users2')
      .update({
        is_driver: true,
        car_color: carColor,
        car_brand: carBrand,
        car_make: carMake,
      })
      .eq('id', user.id);

    if (error) {
      console.error("Error updating driver info:", error);
      alert("Failed to update driver information.");
      return;
    }

    const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { isDriver: true }
      });
      if (authUpdateError) {
        console.error("Error updating auth user metadata:", authUpdateError);
      }

    // Fetch the updated profile from Users2
  const { data: updatedProfile, error: profileError } = await supabase
    .from('Users2')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching updated profile:", profileError);
  } else if (updatedProfile) {
    // Merge the updated profile into the existing user object.
    setUser({ ...user, user_metadata: { ...user.user_metadata, isDriver: updatedProfile.is_driver } });
  }

    alert("Driver registration successful!");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 relative">
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-8 left-8 font-bold text-xl text-black-500 hover:underline"
      >
        &larr; Profile
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Driver Registration</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="carColor" className="block text-gray-700 font-bold mb-2">
            Car Color
          </label>
          <select
            id="carColor"
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
            required
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select Color</option>
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Silver">Silver</option>
            <option value="Gray">Gray</option>
            <option value="Blue">Blue</option>
            <option value="Red">Red</option>
            <option value="Brown">Brown</option>
            <option value="Green">Green</option>
            <option value="Gold">Gold</option>
            <option value="Beige">Beige</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="carBrand" className="block text-gray-700 font-bold mb-2">
            Car Brand
          </label>
          <select
            id="carBrand"
            value={carBrand}
            onChange={(e) => setCarBrand(e.target.value)}
            required
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select Brand</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Nissan">Nissan</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Kia">Kia</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Subaru">Subaru</option>
            <option value="Mazda">Mazda</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="carMake" className="block text-gray-700 font-bold mb-2">
            Car Make
          </label>
          <select
            id="carMake"
            value={carMake}
            onChange={(e) => setCarMake(e.target.value)}
            required
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select Make</option>
            <option value="Car (Sedan)">Car</option>
            <option value="Truck">Truck</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
            <option value="Wagon">Wagon</option>
            <option value="Convertible">Convertible</option>
            <option value="Minivan">Minivan</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Register as Driver
          </button>
        </div>
      </form>
    </div>
  );
}

export default DriverRegistration;