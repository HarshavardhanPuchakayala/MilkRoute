import { Link } from "react-router-dom";
import { FiLock, FiHome } from "react-icons/fi";

const NotAuthorized = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm animate-[fadeUp_0.4s_ease-out]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-500">
          <FiLock />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Not Authorized</h1>
        <p className="mt-2 text-sm text-gray-500">
          You don't have permission to view this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
        >
          <FiHome /> Back to Home
        </Link>
      </div>


    </div>
  );
};

export default NotAuthorized;