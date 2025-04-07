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
    <div style={{ padding: "1rem" }}>
      <h1>Driver Registration</h1>
      <p>Please confirm that you want to register as a driver and provide your car information.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Car Color:
            <select value={carColor} onChange={(e) => setCarColor(e.target.value)} required>
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
          </label>
        </div>
        <div>
          <label>
            Car Brand:
            <select value={carBrand} onChange={(e) => setCarBrand(e.target.value)} required>
              <option value="">Select Brand</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Nissan">Nissan</option>
              <option value="Hyundai">Hyundai</option>
              <option value="KIA">KIA</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Subaru">Subaru</option>
              <option value="Mazda">Mazda</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Car Make:
            <select value={carMake} onChange={(e) => setCarMake(e.target.value)} required>
              <option value="">Select Make</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Wagon">Wagon</option>
              <option value="Minivan">Minivan</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <br />
        <button type="submit">Register as Driver</button>
      </form>
    </div>
  );
}

export default DriverRegistration;