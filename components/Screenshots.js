export default function Screenshots() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Screenshots / Demo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
            Screenshot 1
          </div>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
            Screenshot 2
          </div>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
            Screenshot 3
          </div>
        </div>
      </div>
    </section>
  );
}
