
import React from "react";


function HistorySection({
  transcriptions,
}) {

  return (

    <div className="bg-[#0d0d0d] border border-gray-800 rounded-3xl p-10">

      <h2 className="text-3xl font-bold mb-10 text-white">

        Previous Transcriptions

      </h2>

      {transcriptions.map((item) => (

        <div
          key={item._id}
          className="bg-[#151515] border border-gray-700 rounded-2xl p-6 mb-6"
        >

          <h3 className="text-xl font-bold text-green-400 mb-4">

            {item.fileName}

          </h3>

          <p className="text-gray-300 leading-8">

            {item.transcription}

          </p>

        </div>
      ))}

    </div>
  );
}

export default HistorySection;