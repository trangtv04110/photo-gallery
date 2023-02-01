import React, { useEffect, useRef } from "react";
import { Fade } from "react-slideshow-image";
import { format } from "date-fns";

import useScrollBlock from "../../hooks/useScrollBlock";

import "react-slideshow-image/dist/styles.css";
import "./assets/style.css";

export default function SlideImage({ images, onClose, defaultIndex }) {
  const slideRef = useRef();

  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
    blockScroll();

    return () => allowScroll();
  }, []);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose && onClose();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (slideRef?.current) {
          slideRef.current.goNext();
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (slideRef?.current) {
          slideRef.current.goBack();
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <div className="slide-image" style={{ top: window.scrollY }}>
      <div className="slide-container">
        <Fade defaultIndex={defaultIndex} ref={slideRef}>
          {images &&
            images.map((image, index) => (
              <div key={index}>
                <img
                  style={{ width: "100%" }}
                  src={image.url}
                  alt={image.description}
                />

                <figure className="max-w-screen-md mx-auto text-center mt-4">
                  <p className="text-md italic font-medium text-gray-900 dark:text-white capitalize">
                    {image.description}
                  </p>
                  <figcaption className="flex items-center justify-center mt-1 space-x-3">
                    <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                      <cite className="pr-3 text-sm font-medium text-gray-900 dark:text-white">
                        {image.author}
                      </cite>
                      <cite className="pl-3 text-sm font-light text-gray-800 dark:text-gray-400">
                        {format(new Date(image.createdAt), "dd/MM/yyyy hh:mm")}
                      </cite>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
        </Fade>
      </div>

      <button className="close-button" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
