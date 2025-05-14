import  { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;



const Dashboard = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  const [questionName, setQuestionName] = useState('');
  const [url, setUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [solvedDate, setSolvedDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  // Redirect to login if token is not present
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/questions/tags`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTags(response.data.tags || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/questions`, {
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

    if (token) {
      fetchQuestions();
      fetchTags();
    }
    else setError('No token found.');
  }, [token]);



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean and format tags
    const cleanTags = tagInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag !== '');

    try {
      const response = await axios.post(
        `${apiUrl}/api/questions`,
        {
          questionName,
          url,
          rating,
          review,
          solvedDate,
          tags: cleanTags
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.data) {
        setQuestions(prev => [...prev, response.data.data]);
        setQuestionName('');
        setUrl('');
        setRating(0);
        setReview('');
        setTags([]);         // Optional: if you display `tags` somewhere
        setTagInput('');     // ✅ Clear tag input field after submit
        setSolvedDate('');
        setError('');
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      setError('Error adding question');
      console.error('Error adding question:', error);
    }
  };
  // Handle tag click to filter questions
  // This function will navigate to the questions page with the selected tag as a query parameter
  const handleTagClick = (tag) => {
    navigate(`/questions?tag=${tag}`);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar></Navbar>
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
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-600">Tags</label>
                  <input
                    type="text"
                    id="tag"
                    placeholder='enter tags separated by commas'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
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
            {/* User's Tags */}
            <div className="my-4">
              <h3 className="text-md font-semibold mb-2">Your Tags:</h3>
              {tags.length === 0 ? (
                <p className="text-gray-500">No tags yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <button
                      onClick={() => handleTagClick(tag)}
                      key={index}
                      className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>


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
                  <p>Tags: {q.tags.join(', ')}</p> {/* Display the tags */}
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
