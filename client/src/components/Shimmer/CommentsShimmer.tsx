const CommentsShimmer = () => {
  return (
    <div className="bg-gray-100 rounded-lg w-full p-2">
      <div className="flex gap-x-3 items-center mb-4">
        <div className={`min-w-6 min-h-6 rounded-full bg-white`}></div>
        <div>
          <div className="bg-white w-40 min-h-2 mb-1"></div>
          <p className="bg-white w-10 min-h-2"></p>
        </div>
      </div>
      <p className="bg-white w-full h-10 rounded-2xl "></p>
    </div>
  );
};

export default CommentsShimmer;
