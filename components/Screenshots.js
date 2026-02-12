export default function Screenshots() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Vibra in Action</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Desktop mock */}
          <div className="w-full md:w-1/2 bg-gray-100 rounded-2xl shadow-lg p-6">
            <div className="h-80 bg-white rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">General</span>
                <span className="text-gray-400">#12 online</span>
              </div>

              <div className="flex-1 overflow-auto mb-2 space-y-2">
                <div className="flex justify-start">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    Alice: Hey everyone! 😊
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    You: Hi Alice! How’s it going?
                  </span>
                </div>
                <div className="flex justify-start">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Bob: Ugh, this is so annoying 😤
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border px-3 py-2"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Mobile mock */}
          <div className="w-64 bg-gray-100 rounded-2xl shadow-lg p-4 flex flex-col">
            <div className="h-96 bg-white rounded-xl p-2 flex flex-col justify-between">
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-700 text-sm">
                  General
                </span>
                <span className="text-gray-400 text-xs">#5 online</span>
              </div>
              <div className="flex-1 overflow-auto mb-2 space-y-1">
                <div className="flex justify-start">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                    Alice: Hey!
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                    You: Hi Alice!
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 rounded-lg border px-2 py-1 text-xs"
                />
                <button className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-xs">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
