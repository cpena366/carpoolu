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

  if (loading) return <p className="text-center text-gray-600">Loading car information...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Update Car Information
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Car Color:
            </label>
            <select
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
            <label className="block text-gray-700 font-bold mb-2">
              Car Brand:
            </label>
            <select
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
              <option value="KIA">KIA</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Subaru">Subaru</option>
              <option value="Mazda">Mazda</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Car Make:
            </label>
            <select
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              required
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
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
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Update Car Information
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCarInfo;