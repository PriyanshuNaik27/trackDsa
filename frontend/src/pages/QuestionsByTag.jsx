import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Review from '../components/Review';

const apiUrl = import.meta.env.VITE_API_URL;
const QuestionByTag = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const tag = query.get('tag');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const token = localStorage.getItem('token');
  const [review, setReview] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchQuestionsByTag = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/questions?tag=${tag}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setQuestions(data.data || []);
      } catch (error) {
        setError('Error fetching questions by tag');
        console.error('Error fetching questions by tag:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchQuestionsByTag();
    }
  }, [tag, token]);

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode((prev) => !prev)} />
      <div className={`min-h-screen border p-8 bg-gradient-to-br ${darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-50 to-indigo-100'} transition-colors duration-300`}>
        <main className={`max-w-6xl mx-auto border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'} p-8 rounded-2xl shadow-2xl`}>
          <h1 className={`text-2xl font-bold mb-8 text-center ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            Questions tagged with: <span className={darkMode ? "text-indigo-400" : "text-blue-600"}>{tag}</span>
          </h1>
          {loading && <LoadingSpinner />}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className={`min-w-full border rounded-lg ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                <thead>
                  <tr>
                    <th className={`px-4 py-2 border-b text-left ${darkMode ? "text-indigo-200 border-gray-700" : "text-indigo-700"}`}>Name</th>
                    <th className={`px-4 py-2 border-b text-left ${darkMode ? "text-indigo-200 border-gray-700" : "text-indigo-700"}`}>Review</th>
                    <th className={`px-4 py-2 border-b text-left ${darkMode ? "text-indigo-200 border-gray-700" : "text-indigo-700"}`}>Rating</th>
                    <th className={`px-4 py-2 border-b text-left ${darkMode ? "text-indigo-200 border-gray-700" : "text-indigo-700"}`}>Solved Date</th>
                    <th className={`px-4 py-2 border-b text-left ${darkMode ? "text-indigo-200 border-gray-700" : "text-indigo-700"}`}>Tags</th>
                    <th className={`px-4 py-2 border-b text-left ${darkMode ? "text-indigo-200 border-gray-700" : "text-indigo-700"}`}>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No questions found for this tag.
                      </td>
                    </tr>
                  ) : (
                    questions.map((question) => (
                      <tr key={question._id} className={`transition-colors duration-200 ${darkMode ? "hover:bg-indigo-950 bg-gray-900 border-gray-800" : "hover:bg-indigo-50 bg-white border-indigo-100"}`}>
                        <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-100" : "border-indigo-100 text-gray-800"}`}>
                          {question.questionName}
                        </td>
                       <td className={`px-4 py-2 border-b text-center ${darkMode ? "border-gray-800" : "border-indigo-100"}`}>
                              <Review questionName={question.questionName} text={question.review} darkMode={darkMode} />
                        </td>
                        <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-200" : "border-indigo-100 text-gray-700"}`}>
                          {question.rating}
                        </td>
                        <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-200" : "border-indigo-100 text-gray-700"}`}>
                          {new Date(question.solvedDate).toLocaleDateString()}
                        </td>
                        <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800 text-indigo-300" : "border-indigo-100 text-indigo-700"}`}>
                          {question.tags.join(', ')}
                        </td>
                        <td className={`px-4 py-2 border-b ${darkMode ? "border-gray-800" : "border-indigo-100"}`}>
                          <a
                            href={question.url}
                            className={`underline font-medium transition-colors duration-150 ${darkMode ? "text-indigo-300 hover:text-indigo-100" : "text-indigo-600 hover:text-indigo-900"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Link
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default QuestionByTag;