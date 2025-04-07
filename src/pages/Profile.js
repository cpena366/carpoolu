import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

function Profile() {
    const { user } = useAuth();
    const userId = user?.id;

    const handleCancelTrip = async (tripId) => {
            const { error } = await supabase
              .from('Trips')
              .delete()
              .eq('id', tripId);
            if (error) {
              console.error("Error cancelling trip:", error);
              alert("Failed to cancel trip. Please try again.");
            } else {
              alert("Trip cancelled successfully!");
              // Remove the cancelled trip from the trips state
              setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
            }
          };

  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  // New state for registering as a driver (car info)
  const [carColorInput, setCarColorInput] = useState('');
  const [carBrandInput, setCarBrandInput] = useState('');
  const [carMakeInput, setCarMakeInput] = useState('');

  useEffect(() => {
    const fetchProfileAndTrips = async () => {
      if (!userId) return;

      // Fetch user profile from Users2 table
      const { data: profileData, error: profileError } = await supabase
        .from('Users2')
        .select('*')
        .eq('id', userId)
        .single();
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch trips that the user has posted (where driver_id equals userId)
      const { data: tripsData, error: tripsError } = await supabase
        .from('Trips')
        .select('*')
        .eq('driver_id', userId);
      if (tripsError) {
        console.error('Error fetching trips:', tripsError);
      } else {
        // Filter out trips whose departure time is more than 30 minutes in the past
        const now = Date.now();
        const filteredTripsData = tripsData.filter(trip => {
          const departureTime = new Date(trip.departure_time).getTime();
          return departureTime >= (now - 30 * 60 * 1000);
        });

        // For each filtered trip, fetch the bookings with joined user names from Users2.
        const tripsWithBookings = await Promise.all(
          filteredTripsData.map(async (trip) => {
            const { data: bookingsData, error: bookingsError } = await supabase
              .from('Bookings')
              .select('*, Users2(name)')
              .eq('trip_id', trip.id);
            if (bookingsError) {
              console.error(`Error fetching bookings for trip ${trip.id}:`, bookingsError);
              return { ...trip, bookings: [] };
            }
            return { ...trip, bookings: bookingsData || [] };
          })
        );
        setTrips(tripsWithBookings);
      }
      setLoading(false);
    };

    fetchProfileAndTrips();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;

  const formatDateTime = (dateString) => {
        if (!dateString) return 'Unknown';
        const dt = new Date(dateString);
        return dt.toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

  return (
    <div style={{ padding: '1rem' }}>
      
      
      <h1>My Profile</h1>
      {profile ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Role:</strong> {profile.is_driver ? 'Driver' : 'Rider'}</p>
          {profile.is_driver && (
            <div>
              <h2>Car Information</h2>
              <p><strong>Car Color:</strong> {profile.car_color}</p>
              <p><strong>Car Brand:</strong> {profile.car_brand}</p>
              <p><strong>Car Make:</strong> {profile.car_make}</p>
              <Link to="/update-car-info"><button>Update Car Info</button></Link>
            </div>
          )}
          {/* If the user is not registered as a driver, show a button to register */}
          {!profile.is_driver && (
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
              <h2>Register as Driver</h2>
              <Link to="/driver-registration">
                <button>Register as Driver</button>
              </Link>
            </div>
          
          )}
        </div>
      ) : (
        <p>Error loading profile.</p>
      )}
        {profile && profile.is_driver && (
        <>
          <h2>Trips You Have Posted:</h2>
          {trips.length === 0 ? (
            <p>You haven't posted any trips yet.</p>
          ) : (
            trips.map((trip) => (
              <div key={trip.id} className="trip-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                <h3> {trip.origin} to {trip.destination}</h3>
                {trip.trip_description && (
                  <p><strong>Description:</strong> {trip.trip_description}</p>
                )}
                <p><strong>Leaving At:</strong> {formatDateTime(trip.departure_time)}</p>
                <p><strong>Cost:</strong> Free</p>
                <p><strong>Seats Available:</strong> {trip.seats_available - trip.bookings.length}</p>
                <p><strong>Booked Seats:</strong> {trip.bookings.length}</p>
                {trip.bookings.length > 0 && (
                  <div>
                    <p><strong>Users who have joined your ride:</strong></p>
                    <ul>
                      {trip.bookings.map((booking) => (
                        <li key={booking.id}>
                          {booking.Users2?.name || 'Unknown'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p><strong>Posted on:</strong> {formatDateTime(trip.created_at)}</p>
                <button onClick={() => handleCancelTrip(trip.id)} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem', border: 'none', cursor: 'pointer' }}>
                  Cancel Trip
                </button>
              </div>
            ))
          )}
        </>
      )}
     </div>
    );
}


export default Profile;