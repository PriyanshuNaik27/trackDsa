import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Review from '../components/Review';
const apiUrl = import.meta.env.VITE_API_URL;
import { FaRegCommentDots } from "react-icons/fa"
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = ({darkMode,toggleDarkMode}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Dark mode state
  

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

  useEffect(() => {
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
    } else setError('No token found.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setTags([]);
        setTagInput('');
        setSolvedDate('');
        setError('');
        fetchTags();
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      setError('Error adding question');
      console.error('Error adding question:', error);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/questions?tag=${tag}`);
  };

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`min-h-screen border p-8 bg-gradient-to-br ${darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-50 to-indigo-100'} transition-colors duration-300`}>
        <main className={`max-w-7xl mx-auto border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'} p-8 rounded-2xl shadow-2xl`}>
          <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>📘 DSA Tracker Dashboard</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Improved Form */}
              <form onSubmit={handleSubmit} className={`space-y-6 ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} p-6 rounded-xl shadow mb-8`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="questionName" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Question Name</label>
                    <input
                      type="text"
                      id="questionName"
                      value={questionName}
                      onChange={(e) => setQuestionName(e.target.value)}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-400' : 'border-indigo-200 focus:ring-indigo-400'}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="tags" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Tags</label>
                    <input
                      type="text"
                      id="tag"
                      placeholder="Enter tags separated by commas"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-400' : 'border-indigo-200 focus:ring-indigo-400'}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="url" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>URL</label>
                    <input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-400' : 'border-indigo-200 focus:ring-indigo-400'}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="rating" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Rating (1-5)</label>
                    <input
                      type="number"
                      id="rating"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-400' : 'border-indigo-200 focus:ring-indigo-400'}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="solvedDate" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Solved Date</label>
                    <input
                      type="date"
                      id="solvedDate"
                      value={solvedDate}
                      onChange={(e) => setSolvedDate(e.target.value)}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-400' : 'border-indigo-200 focus:ring-indigo-400'}`}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="review" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Review</label>
                    <textarea
                      id="review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-400' : 'border-indigo-200 focus:ring-indigo-400'}`}
                      rows={3}
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition ${darkMode ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  ➕ Add Question
                </button>
              </form>

              {/* User's Tags */}
              <section className="my-6">
                <h3 className={`text-md font-semibold mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Your Tags:</h3>
                {tags.length === 0 ? (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tags yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <button
                        onClick={() => handleTagClick(tag)}
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm transition ${darkMode ? 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800' : 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <hr className={`my-8 ${darkMode ? 'border-gray-700' : ''}`} />

              {/* Questions Table */}
              <section>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>📋 Your Questions</h3>
                {questions.length === 0 ? (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No questions added yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className={`min-w-full border rounded-lg ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-indigo-200'}`}>
                      <thead>
                        <tr>
                          <th className={`px-4 py-2 border-b text-left ${darkMode ? 'text-indigo-200 border-gray-700' : 'text-indigo-700'}`}>Name</th>
                          <th className={`px-4 py-2 border-b text-center ${darkMode ? 'text-indigo-200 border-gray-700' : 'text-indigo-700'}`}>
                            <span className="flex items-center justify-center gap-1">
                              Review <FaRegCommentDots className="inline text-indigo-500" />
                            </span>
                          </th>
                          <th className={`px-4 py-2 border-b text-left ${darkMode ? 'text-indigo-200 border-gray-700' : 'text-indigo-700'}`}>Rating</th>
                          <th className={`px-4 py-2 border-b text-left ${darkMode ? 'text-indigo-200 border-gray-700' : 'text-indigo-700'}`}>Solved Date</th>
                          <th className={`px-4 py-2 border-b text-left ${darkMode ? 'text-indigo-200 border-gray-700' : 'text-indigo-700'}`}>Tags</th>
                          <th className={`px-4 py-2 border-b text-left ${darkMode ? 'text-indigo-200 border-gray-700' : 'text-indigo-700'}`}>URL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((q) => (
                          <tr
                            key={q._id}
                            className={`transition-colors duration-200 ${darkMode
                                ? "hover:bg-indigo-950 bg-gray-900 border-gray-800"
                                : "hover:bg-indigo-50 bg-white border-indigo-100"
                              }`}
                          >
                            <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-100" : "border-indigo-100 text-gray-800"}`}>
                              {q.questionName}
                            </td>
                            <td className={`px-4 py-2 border-b text-center ${darkMode ? "border-gray-800" : "border-indigo-100"}`}>
                              <Review  questionName={q.questionName} text={q.review} darkMode={darkMode} />
                            </td>
                            <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-200" : "border-indigo-100 text-gray-700"}`}>
                              {q.rating}
                            </td>
                            <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-200" : "border-indigo-100 text-gray-700"}`}>
                              {q.solvedDate ? new Date(q.solvedDate).toLocaleDateString() : ''}
                            </td>
                            <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-300" : "border-indigo-100 text-indigo-700"}`}>
                              {q.tags.join(', ')}
                            </td>
                            <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800" : "border-indigo-100"}`}>
                              <a
                                href={q.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`underline font-medium transition-colors duration-150 ${darkMode
                                    ? "text-indigo-300 hover:text-indigo-100"
                                    : "text-indigo-600 hover:text-indigo-900"
                                  }`}
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;