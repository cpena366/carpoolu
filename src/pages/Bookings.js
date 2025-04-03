import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch bookings
  const fetchBookings = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Bookings')
      .select(`
        id, booked_at, 
        Trips (destination, departure_time)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else if (user) {
        setUserId(user.id);
        fetchBookings(user.id);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>My Bookings</h1>

      {loading ? <p>Loading bookings...</p> : bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id}>
            <h3>Trip to: {booking.Trips?.destination}</h3>
            <p>Departure: {booking.Trips?.departure_time ? new Date(booking.Trips.departure_time).toLocaleString() : 'Unknown'}</p>
            <p>Booked At: {new Date(booking.booked_at).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>You have not joined any trips.</p>
      )}
    </div>
  );
}

export default MyBookings;