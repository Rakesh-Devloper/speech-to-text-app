function HistorySection({ transcriptions }) {
  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white">
          My History
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          View all your previous transcriptions
        </p>
      </div>

      {transcriptions.length === 0 ? (
        <div className="bg-[#111] border border-gray-800 rounded-3xl p-12 text-center">
          <h3 className="text-2xl text-white mb-3">
            No History Found
          </h3>

          <p className="text-gray-400">
            Upload an audio file or record your voice to create your first transcription.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {transcriptions.map((item) => (
            <div
              key={item._id}
              className="
                bg-gradient-to-br
                from-[#121212]
                to-[#1a1a1a]
                border
                border-gray-800
                rounded-3xl
                p-8
                hover:border-green-500
                transition-all
                duration-300
              "
            >
              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold text-green-400">
                  {item.fileName}
                </h2>

                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                  Transcript
                </span>

              </div>

              <div className="bg-black/40 rounded-2xl p-5">

                <p className="text-gray-300 leading-8 text-lg">
                  {item.transcription}
                </p>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default HistorySection;