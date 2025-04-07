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

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

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
        <div className="min-h-screen bg-gray-50 p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Profile</h1>
          
          <div className="max-w-xl mx-auto bg-white shadow rounded p-6 mb-6">
            {profile ? (
              <>
                <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
                <p className="text-lg"><strong>Role:</strong> {profile.is_driver ? 'Driver' : 'Rider'}</p>
                {profile.is_driver ? (
                  <div className="mt-4 border-t pt-4">
                    <h2 className="text-2xl font-semibold mb-2">Car Information</h2>
                    <p className="text-base"><strong>Car Color:</strong> {profile.car_color}</p>
                    <p className="text-base"><strong>Car Brand:</strong> {profile.car_brand}</p>
                    <p className="text-base"><strong>Car Make:</strong> {profile.car_make}</p>
                    <Link to="/update-car-info">
                      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Update Car Info
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 border-t pt-4">
                    <h2 className="text-2xl font-semibold mb-2">Register as Driver</h2>
                    <Link to="/driver-registration">
                      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Register as Driver
                      </button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-red-500">Error loading profile.</p>
            )}
          </div>
          
          {profile && profile.is_driver && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trips You Have Posted</h2>
              {trips.length === 0 ? (
                <p className="text-center text-gray-600">You currently have no active trips.</p>
              ) : (
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <div key={trip.id} className="bg-white shadow rounded border border-gray-300 p-4">
                      <h3 className="text-xl font-bold mb-2">{trip.origin} to {trip.destination}</h3>
                      <p className="text-red-900 mb-1"><strong>Leaving At:</strong> {formatDateTime(trip.departure_time)}</p>
                      {trip.trip_description && (
                        <p className="text-gray-700 mb-2"><strong>Description:</strong> {trip.trip_description}</p>
                      )}
                      <p className="text-gray-700 mb-1">
                        <strong>Seats Available:</strong> {trip.seats_available - trip.bookings.length}
                      </p>
                      <p className="text-gray-700 mb-1"><strong>Cost:</strong> FREE</p>
                      <p className="text-gray-700 mb-1"><strong>Booked Seats:</strong> {trip.bookings.length}</p>
                      {trip.bookings.length > 0 && (
                        <div className="mt-2">
                          <p className="text-gray-700 font-medium">Users who have joined your ride:</p>
                          <ul className="list-disc list-inside">
                            {trip.bookings.map((booking) => (
                              <li key={booking.id} className="text-gray-600">
                                {booking.Users2?.name || 'Unknown'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-gray-500 text-sm mb-2"><strong>Posted on:</strong> {formatDateTime(trip.created_at)}</p>
                      <button 
                        onClick={() => handleCancelTrip(trip.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel Trip
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
}


export default Profile;