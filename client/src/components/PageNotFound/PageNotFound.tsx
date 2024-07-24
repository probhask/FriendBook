import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-blue-50">
      <div className="flex flex-col items-center justify-center gap-y-4 m bg-blue-100 shadow-xl max-w-[600px] p-5 rounded-xl">
        <div className=" text-center">
          <h1 className="text-2xl font-bold mb-2">Oops!</h1>
          <h2 className="text-sm font-semibold">404 - PAGE NOT FOUND</h2>
        </div>
        <div className=" text-center">
          <p>
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>

          <Link
            to="/"
            className=" h-10 text-xl py-2 flex justify-center items-center text-blue-400 border border-blue-400 cursor-pointer font-bold hover:bg-blue-400 hover:text-white my-6"
          >
            GO Back TO HOME PAGE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
