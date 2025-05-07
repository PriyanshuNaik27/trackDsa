import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const [questionName, setQuestionName] = useState('');
  const [url, setUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [solvedDate, setSolvedDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setQuestions(response.data.data);
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        setError('Error fetching questions');
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchQuestions();
    else setError('No token found.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/questions',
        { questionName, url, rating, review, solvedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data && response.data.data) {
        setQuestions(prevQuestions => [...prevQuestions, response.data.data]);
        setQuestionName('');
        setUrl('');
        setRating(0);
        setReview('');
        setSolvedDate('');
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      setError('Error adding question');
      console.error('Error adding question:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">📘 DSA Tracker Dashboard</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <p className="text-center">Loading questions...</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="questionName" className="block text-sm font-medium text-gray-600">Question Name</label>
                  <input
                    type="text"
                    id="questionName"
                    value={questionName}
                    onChange={(e) => setQuestionName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-600">URL</label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-600">Rating (1-5)</label>
                  <input
                    type="number"
                    id="rating"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="solvedDate" className="block text-sm font-medium text-gray-600">Solved Date</label>
                  <input
                    type="date"
                    id="solvedDate"
                    value={solvedDate}
                    onChange={(e) => setSolvedDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-600">Review</label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  rows={3}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
              >
                ➕ Add Question
              </button>
            </form>

            <hr className="my-6" />

            <h3 className="text-xl font-semibold mb-4">📋 Your Questions</h3>
            <ul className="space-y-4">
              {questions.length === 0 && <p>No questions added yet.</p>}
              {questions.map((q) => (
                <li key={q._id} className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg">{q.questionName}</h4>
                  <p className="text-sm text-gray-600">Rating: {q.rating} | Date: {q.solvedDate}</p>
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                    View Question
                  </a>
                  <p className="text-sm mt-2 text-gray-700">Review: {q.review}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
