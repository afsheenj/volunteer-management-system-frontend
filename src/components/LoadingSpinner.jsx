const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      
      <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1e40af] rounded-full animate-spin"></div>

      <p className="mt-4 text-[#1e40af] font-semibold">{text}</p>

    </div>
  );
};

export default LoadingSpinner;