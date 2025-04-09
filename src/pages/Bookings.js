import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const formatDateTime = (dateString) => {
  if (!dateString) return 'Unknown';
  const dt = new Date(dateString);
  const formattedDate = dt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = dt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${formattedDate} at ${formattedTime}`;
};

function MyBookings() {
  const { user } = useAuth();
  const userId = user?.id;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCancel = async (bookingId) => {
    const { error } = await supabase
      .from('Bookings')
      .delete()
      .eq('id', bookingId);
    if (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } else {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      alert('Booking cancelled successfully!');
    }
  };

  // Function to fetch bookings
  const fetchBookings = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Bookings')
      .select(`
        id, booked_at,
        Trips (
          origin,
          destination,
          departure_time,
          seats_available,
          trip_description,
          created_at,
          driver:Users2(car_color, car_brand, car_make)
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      const now = Date.now();
      // Filter out bookings where the trip's departure time plus 30 minutes is in the past.
      const filteredBookings = data.filter(booking => {
        if (!booking.Trips?.departure_time) return false;
        const departureTimeMs = new Date(booking.Trips.departure_time).getTime();
        return (departureTimeMs + 30 * 60 * 1000) > now;
      });
      setBookings(filteredBookings);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchBookings(userId);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Bookings</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading bookings...</p>
      ) : bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id} className="bg-white shadow rounded border border-gray-300 p-4 my-4">
            <h3 className="text-xl font-bold mb-2">
              Trip from {booking.Trips?.origin} to {booking.Trips?.destination}
            </h3>
            {booking.Trips?.trip_description && (
              <p className="text-gray-700 mb-2">
                <strong>Trip Description:</strong> {booking.Trips.trip_description}
              </p>
            )}
            <p className="text-red-900 mb-1">
              <strong>Leaving At:</strong> {formatDateTime(booking.Trips?.departure_time)}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Cost:</strong> Free
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Booked At:</strong> {formatDateTime(booking.booked_at)}
            </p>
            {booking.Trips?.driver && (
              <p className="text-gray-700 mb-1">
                <strong>Driver's Car:</strong> {booking.Trips.driver.car_color}, {booking.Trips.driver.car_brand}, {booking.Trips.driver.car_make}
              </p>
            )}
            <button
              onClick={() => handleCancel(booking.id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Cancel Trip
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          You currently are not booked to any active trips.
        </p>
      )}
    </div>
  );
}

export default MyBookings;