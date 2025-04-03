import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import TripCard from '../components/TripCard';

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase.from('Trips').select('*');
      if (error) {
        console.error('Error fetching trips:', error);
      } else {
        console.log('Fetched trips:', data); // Log trips
        setTrips(data);
      }
    };

    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else if (user) {
        setUserId(user.id);
      }
    };

    fetchTrips();
    fetchUser();
  }, []);

  return (
    <div>
      
      <h1>Dashboard</h1>
      <Link to="/bookings">
        <button>My Bookings</button>
      </Link>
      <h2>Available Trips</h2>
      {trips.length > 0 ? (
        trips.map((trip) => <TripCard key={trip.id} trip={trip} userId={userId} />)
      ) : (
        <p>No trips available.</p>
      )}
    </div>
  );
}

export default Dashboard;