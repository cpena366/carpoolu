import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Feedback() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert feedback into the "Feedback" table using correct column names.
    const { error } = await supabase.from('Feedback').insert([
      {
        feedback,
        subject,
      },
    ]);

    if (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    } else {
      alert('Feedback submitted successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Feedback/Report A Bug</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Feedback/Bug:</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows="5"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Submit Feedback/Bug Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;