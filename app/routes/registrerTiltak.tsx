import { Link } from "@remix-run/react";

export default function RegistrerTiltak() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center dark:text-white just">
            Registrer Tiltak
          </h1>
          <div className="flex justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
}
