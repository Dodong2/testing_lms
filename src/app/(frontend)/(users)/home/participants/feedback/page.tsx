export default function Feedback() {
    return (
         <div className="bg-gray-100 rounded-md shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Submit Feedback</h2>
      <div className="mb-4">
        <label htmlFor="feedbackType" className="block text-gray-700 text-sm font-bold mb-2">
          Feedback Type
        </label>
        <div className="relative">
          <select
            id="feedbackType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option>Bug Report</option>
            <option>Feature Request</option>
            <option>General Feedback</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Brief description of your feedback"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={9}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Provide detailed information about your feedback..."
        />
      </div>
      <button
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        Submit Feedback
      </button>
    </div>
    )
}