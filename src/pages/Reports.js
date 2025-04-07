import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Reports() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [report, setReport] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert a new report into the Reports table with columns: title and report.
    const { error } = await supabase.from('Reports').insert([
      {
        report,
        title,
      },
    ]);

    if (error) {
      console.error('Error reporting bug:', error);
      alert('Failed to report bug.');
    } else {
      alert('Bug reported successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report a Bug</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Report</label>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              required
              rows="5"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
          >
            Report Bug
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reports;