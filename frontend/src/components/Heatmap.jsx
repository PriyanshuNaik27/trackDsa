import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function Heatmap() {
  const [handle, setHandle] = useState(() => {
    return localStorage.getItem('cf-handle') || '';
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHeatmap = async (usedHandle = handle) => {
    if (!usedHandle) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/codeforces/${usedHandle}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    localStorage.setItem('cf-handle', handle);
    fetchHeatmap(handle);
  };

  // Auto-fetch if handle already saved
  useEffect(() => {
    if (handle) {
      fetchHeatmap(handle);
    }
  }, []);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter Codeforces handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
      >
        Show Heatmap
      </button>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
            <span className="ml-4 text-blue-600">Loading heatmap...</span>
          </div>
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
