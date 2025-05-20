import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import loadingSpinner from '../components/LoadingSpinner';


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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Questions tagged with: <span className="text-blue-600">{tag}</span></h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-6">
          {questions.map((question) => (
            <li key={question._id} className="p-4 border-b border-gray-200 hover:bg-gray-50 rounded-lg">
              <h2 className="text-xl font-medium text-gray-800">{question.questionName}</h2>
              <p className="text-gray-600 mt-2">{question.review}</p>
              <p className="text-gray-500 mt-2">Rating: <span className="font-semibold">{question.rating}</span></p>
              <p className="text-gray-500">Solved Date: <span className="font-semibold">{new Date(question.solvedDate).toLocaleDateString()}</span></p>
              <p className="text-gray-500">Tags: <span className="font-semibold">{question.tags.join(', ')}</span></p>
              <a href={question.url} className="text-blue-500 hover:underline mt-2 inline-block">URL: {question.url}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionByTag;
