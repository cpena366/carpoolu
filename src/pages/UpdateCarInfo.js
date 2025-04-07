import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function UpdateCarInfo() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const [carColor, setCarColor] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carMake, setCarMake] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarInfo = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('Users2')
        .select('car_color, car_brand, car_make')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.error("Error fetching car info:", error);
      } else if (data) {
        setCarColor(data.car_color || '');
        setCarBrand(data.car_brand || '');
        setCarMake(data.car_make || '');
      }
      setLoading(false);
    };

    fetchCarInfo();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in.");
      return;
    }
    const { error } = await supabase
      .from('Users2')
      .update({
        car_color: carColor,
        car_brand: carBrand,
        car_make: carMake,
      })
      .eq('id', userId);

    if (error) {
      console.error("Error updating car info:", error);
      alert("Failed to update car information.");
    } else {
      alert("Car information updated successfully!");
      navigate("/profile");
    }
  };

  if (loading) return <p>Loading car information...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Update Car Information</h1>
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
        <button type="submit">Update Car Information</button>
      </form>
    </div>
  );
}

export default UpdateCarInfo;