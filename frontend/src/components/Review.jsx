import { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";

const Review = ({ text }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="text-indigo-500 hover:text-indigo-700"
        onClick={() => setOpen(true)}
        title="Show Review"
      >
        <FaRegCommentDots size={20} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-indigo-600 text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-2 text-indigo-700 flex items-center gap-2">
              <FaRegCommentDots /> Review
            </h4>
            <div className="text-gray-700 whitespace-pre-line break-words">
              {text || <span className="italic text-gray-400">No review</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Review;