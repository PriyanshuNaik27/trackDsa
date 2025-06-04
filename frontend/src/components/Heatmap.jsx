import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const apiUrl = import.meta.env.VITE_API_URL;

function Heatmap() {
  const [handle, setHandle] = useState(() => localStorage.getItem('cf-handle') || '');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHeatmap = async (usedHandle) => {
    if (!usedHandle) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/codeforces/${usedHandle}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching heatmap:', err);
      setError('Failed to fetch heatmap data. Please check the handle or try again later.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if handle already saved on mount
  useEffect(() => {
    if (handle) {
      fetchHeatmap(handle);
    }
  }, []);

  const handleSubmit = () => {
    const trimmedHandle = handle.trim();
    if (!trimmedHandle) {
      setError('Please enter a valid Codeforces handle.');
      setData([]);
      return;
    }
    localStorage.setItem('cf-handle', trimmedHandle);
    fetchHeatmap(trimmedHandle);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Enter Codeforces handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
        className="border px-2 py-1 rounded w-full"
      />
      <button
        onClick={handleSubmit}
        disabled={!handle.trim()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 w-full"
      >
        Show Heatmap
      </button>

      <div className="mt-6 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
            <span className="text-blue-600">Loading heatmap...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-gray-500 text-center">No heatmap data available. Enter a valid handle above.</div>
        ) : (
          <CalendarHeatmap
            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            values={data}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'color-empty';
              if (value.count < 2) return 'color-scale-1';
              if (value.count < 5) return 'color-scale-2';
              return 'color-scale-3';
            }}
            tooltipDataAttrs={(value) => ({
              'data-tip': `${value.date}: ${value.count || 0} submissions`,
            })}
          />
        )}
      </div>
    </div>
  );
}

export default Heatmap;
