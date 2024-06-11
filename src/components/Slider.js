import { useState } from "react";

const Slider = ({ images }) => {
  console.log('re-render');
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };

  return (
    <div className="relative mt-10 max-w-[900px] mx-auto">
      {/* Previous Button */}
      <button
        className="absolute left-[-80px] z-10 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full shadow-md transition duration-300"
        onClick={handlePrev}
      >
        {"<"}
      </button>

      {/* Next Button */}
      <button
        className="absolute right-[-80px] z-10 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full shadow-md transition duration-300"
        onClick={handleNext}
      >
        {">"}
      </button>

      {/* Image List */}
      <div className="flex justify-center items-center w-full h-[300px]">
        {images.map((img, index) => (
          <img
            key={index}
            className={`${index === activeIndex ? "w-full h-full" : "w-24 h-[80px]"
              } h-64 mx-2 rounded-md shadow-lg transition-all duration-300`}
            src={img}
            alt={`Image ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
