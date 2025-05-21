import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const apiUrl = import.meta.env.VITE_API_URL;
const QuestionByTag = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const tag = query.get('tag');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

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
  }, [tag]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Questions tagged with: <span className="text-blue-600">{tag}</span>
      </h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-gray-700">Name</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Review</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Rating</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Solved Date</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Tags</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">URL</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No questions found for this tag.
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{question.questionName}</td>
                    <td className="px-4 py-2 border-b">{question.review}</td>
                    <td className="px-4 py-2 border-b">{question.rating}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(question.solvedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">{question.tags.join(', ')}</td>
                    <td className="px-4 py-2 border-b">
                      <a
                        href={question.url}
                        className="text-blue-500 hover:underline"
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
    </div>
  );
};

export default QuestionByTag;