import { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";

const Review = ({questionName, text, darkMode }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`text-indigo-500 hover:text-indigo-700 ${darkMode ? "dark:text-indigo-300 dark:hover:text-indigo-100" : ""}`}
        onClick={() => setOpen(true)}
        title="Show Review"
      >
        <FaRegCommentDots size={20} />
       
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
          <div className={`rounded-lg shadow-lg border max-w-md w-full p-6 relative ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <button
              className={`absolute top-2 right-3 text-gray-400 hover:text-indigo-600 text-2xl ${darkMode ? "dark:text-gray-300 dark:hover:text-indigo-400" : ""}`}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-indigo-200" : "text-indigo-700"}`}>
              <FaRegCommentDots /> Review
            </h4>
            <span className={`text-lg font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-700"}` }>{questionName}</span>
            <div className={`whitespace-pre-line break-words ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              {text || <span className={`italic ${darkMode ? "text-gray-400" : "text-gray-400"}`}>No review</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Review;