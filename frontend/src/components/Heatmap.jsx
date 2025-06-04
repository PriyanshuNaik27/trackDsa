import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import axios from 'axios';
import 'react-calendar-heatmap/dist/styles.css'; // basic styles, you can override with Tailwind

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/heatmap', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const heatmapObj = data && data.data ? data.data : {};
        const transformed = Object.entries(heatmapObj).map(([date, count]) => ({
          date,
          count,
        }));

        setHeatmapData(transformed);
        setUserName(data.userName || '');
        setRawQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  const getClassForValue = (value) => {
    if (!value || !value.count) return 'color-empty';
    if (value.count >= 4) return 'color-github-4';
    if (value.count === 3) return 'color-github-3';
    if (value.count === 2) return 'color-github-2';
    if (value.count === 1) return 'color-github-1';
    return 'color-empty';
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Your Problem Solving Heatmap</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></span>
          <span className="ml-4 text-indigo-600">Loading heatmap...</span>
        </div>
      ) : (
        <>
          <CalendarHeatmap
            startDate={shiftDate(new Date(), -120)}
            endDate={new Date()}
            values={heatmapData}
            classForValue={getClassForValue}
            showWeekdayLabels
            tooltipDataAttrs={value => {
              if (!value || !value.date) return {};
              return {
                'data-tip': `${value.date}: ${value.count || 0} solved`,
              };
            }}
          />
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-sm">
            <div>
              <span className="font-semibold">User Name:</span> {userName || <span className="italic text-gray-400">Not available</span>}
            </div>
            <div className="mt-2">
              <span className="font-semibold">Questions:</span>
              <ul className="list-disc ml-6">
                {rawQuestions && rawQuestions.length > 0 ? (
                  rawQuestions.map((q, idx) => (
                    <li key={idx}>
                      <span className="text-indigo-700">{q.questionName}</span>
                      {q.solvedDate && (
                        <span className="ml-2 text-gray-500">({new Date(q.solvedDate).toLocaleDateString()})</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="italic text-gray-400">No questions found</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

export default Heatmap;