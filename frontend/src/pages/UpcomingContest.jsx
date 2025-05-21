import React, { useEffect, useState } from "react";

const CodeforcesContests = () => {
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
            .filter(contest => contest.phase === "BEFORE")
            .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
            .slice(0, 5); // show top 5
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Upcoming Codeforces Contests
        </h1>

        {loading ? (
          <p className="text-center">Loading contests...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : contests.length === 0 ? (
          <p className="text-center">No upcoming contests found.</p>
        ) : (
          <div className="space-y-4">
            {contests.map((contest, idx) => (
              <div key={idx} className="bg-white shadow-md rounded-xl p-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  {contest.name}
                </h2>
                <p className="text-gray-600">
                  Start Time:{" "}
                  <span className="font-medium">
                    {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                  </span>
                </p>
                <p className="text-gray-600">
                  Duration:{" "}
                  <span className="font-medium">
                    {(contest.durationSeconds / 3600).toFixed(1)} hours
                  </span>
                </p>
                <a
                  href={`https://codeforces.com/contests/${contest.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-indigo-600 hover:underline"
                >
                  View Contest →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeforcesContests;
