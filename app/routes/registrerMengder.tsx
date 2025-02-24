import { Link } from "@remix-run/react";

export default function RegistrerMengder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
            Registrer Mengder
          </h1>
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="hansen@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            {/* Add more form fields here */}
            <div className="flex justify-between mt-6">
              <Link to="/">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">
                  Tilbake
                </button>
              </Link>
              <Link to="/">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Lagre
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
