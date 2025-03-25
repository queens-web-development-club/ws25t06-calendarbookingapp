import { useState } from "react";

function RandomLinkGenerator() {
  const [randomLink, setRandomLink] = useState("");

  // Function to generate a completely random link
  const generateRandomLink = () => {
    const randomString = Math.random().toString(36).substring(7);
    setRandomLink(`https://example.com/${randomString}`);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={generateRandomLink}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition mb-4"
      >
        Generate Random Link
      </button>
      {randomLink && (
        <a
          href={randomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {randomLink}
        </a>
      )}
    </div>
  );
}

export default RandomLinkGenerator;
