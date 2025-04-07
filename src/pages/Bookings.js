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
          console.error("Error cancelling booking:", error);
          alert("Failed to cancel booking. Please try again.");
        } else {
          // Remove the booking from state
          setBookings(prev => prev.filter(b => b.id !== bookingId));
          alert("Booking cancelled successfully!");
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
          created_at
        )
      `)
      .eq('user_id', userId);

      if (error) {
              console.error('Error fetching bookings:', error);
            } else {
              const now = Date.now();
              // Filter out bookings where the trip's departure time is more than 30 minutes in the past.
              const filteredBookings = data.filter(booking => {
                if (!booking.Trips?.departure_time) return false;
                const departureTimeMs = new Date(booking.Trips.departure_time).getTime();
                // Only include bookings where the departure time plus 30 minutes is greater than now.
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
    <div>
      <h1>My Bookings</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length > 0 ? (
        bookings.map((booking) => (
                    <div key={booking.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                      <h3>Trip from {booking.Trips?.origin} to {booking.Trips?.destination}</h3>
                      {booking.Trips?.trip_description && (
                        <p><strong>Trip Description:</strong> {booking.Trips.trip_description}</p>
                      )}
                      <p>
                        <strong>Leaving At:</strong>{' '}
                        {formatDateTime(booking.Trips?.departure_time)}
                      </p>
                      <p><strong>Cost:</strong> Free</p>
                      <p>
                        <strong>Booked At:</strong> {formatDateTime(booking.booked_at)}
                      </p>
                      <button onClick={() => handleCancel(booking.id)}>Cancel Trip</button>
                    </div>
                  ))
      ) : (
        <p>You have not joined any trips.</p>
      )}
    </div>
  );
}

export default MyBookings;