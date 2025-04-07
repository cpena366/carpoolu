import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [carColor, setCarColor] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carMake, setCarMake] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    // Build additional driver data if user is a driver
    const driverData = isDriver
      ? {
        car_color: carColor,
        car_brand: carBrand,
        car_make: carMake,
      }
      : {};

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          isDriver: isDriver,
          ...driverData,
        },
      },
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email to confirm your account, then log in.");
    }

    console.log('Signup response:', data, error);

    // Insertion into Users2 will occur after email confirmation
  };

  return (
    <div>
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>&larr; Back</button>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>
          <input type="checkbox" checked={isDriver} onChange={(e) => setIsDriver(e.target.checked)} />
          Register as Driver
        </label>
        {isDriver && (
          <div>
            <label>
              Car Color:
              <select value={carColor} onChange={(e) => setCarColor(e.target.value)} required>
                <option value="">Select Color</option>
                <option value="Dark Red">Dark Red</option>
                <option value="Red">Red</option>
                <option value="Pink">Red</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Silver">Silver</option>
                <option value="Gray">Gray</option>
                <option value="Orange">Orange</option>
                <option value="Brown">Brown</option>
                <option value="Green">Green</option>
                <option value="Gold">Gold</option>
                <option value="Beige">Beige</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Car Brand:
              <select value={carBrand} onChange={(e) => setCarBrand(e.target.value)} required>
                <option value="">Select Model</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="BMW">BMW</option>
                <option value="Nissan">Nissan</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Subaru">Subaru</option>
                <option value="Mazda">Mazda</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Car Make:
              <select value={carMake} onChange={(e) => setCarMake(e.target.value)} required>
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
            </label>
          </div>
        )}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;