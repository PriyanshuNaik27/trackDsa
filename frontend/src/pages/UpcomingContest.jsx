import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const CodeforcesContests = ({ darkMode, toggleDarkMode }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCodeforcesContests = async () => {
      try {
        const response = await fetch("https://codeforces.com/api/contest.list");
        const data = await response.json();

        if (data.status === "OK") {
          const upcoming = data.result
            .filter((contest) => contest.phase === "BEFORE")
            .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
            .slice(0, 5);
          setContests(upcoming);
        } else {
          setError("Failed to fetch contests.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchCodeforcesContests();
  }, []);

  return (
    <div >  
    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    <div className={`min-h-screen border p-8 bg-gradient-to-br ${darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-50 to-indigo-100'} transition-colors duration-300`}>
      
      <main className={`max-w-3xl mx-auto border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'} p-8 rounded-2xl shadow-2xl`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
          Upcoming Codeforces Contests
        </h1>

        {loading ? (
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading contests...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : contests.length === 0 ? (
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No upcoming contests found.</p>
        ) : (
          <div className="space-y-5">
            {contests.map((contest, idx) => (
              <div
                key={idx}
                className={`shadow-md rounded-xl p-5 transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-indigo-100"}`}
              >
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-indigo-200" : "text-gray-800"}`}>
                  {contest.name}
                </h2>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Start Time:{" "}
                  <span className="font-medium">
                    {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                  </span>
                </p>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Duration:{" "}
                  <span className="font-medium">
                    {(contest.durationSeconds / 3600).toFixed(1)} hours
                  </span>
                </p>
                <a
                  href={`https://codeforces.com/contests/${contest.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block mt-3 underline font-medium transition-colors duration-150 ${
                    darkMode
                      ? "text-indigo-300 hover:text-indigo-100"
                      : "text-indigo-600 hover:text-indigo-900"
                  }`}
                >
                  View Contest →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    </div>
  );
};

export default CodeforcesContests;