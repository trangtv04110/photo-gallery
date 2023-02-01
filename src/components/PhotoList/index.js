import React, { useEffect, useState } from "react";
import axios from "axios";
import { UNSPLASH_API } from "../../constants";
import usePageBottom from "../../hooks/usePageBottom";

import SlideImage from "../SlideImage";
import Loading from "../Loading";

import "./assets/style.css";

axios.defaults.baseURL = UNSPLASH_API;
axios.defaults.headers = {
  "Content-type": "application/json",
  Authorization: "Client-ID xq4SmMUT8X4oRmJn8gj6vt4Ukgwe9vmKj4tnSJ8cmCM",
};

export default function PhotoList() {
  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [showSlideImage, setShowSlideImage] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();

  const isBottom = usePageBottom();

  const loadPhotos = async (page = 1) => {
    setLoading(true);

    const res = await axios.get("/photos", { params: { page } });

    setLoading(false);

    if (res && res.data) {
      setPhotos([...photos, ...res.data]);
    }
  };

  useEffect(() => {
    loadPhotos(page);
  }, [page]);

  useEffect(() => {
    if (isBottom) {
      setPage((page) => page + 1);
    }
  }, [isBottom]);

  const handleShowSlideImage = (index) => {
    setShowSlideImage(true);
    setSelectedIndex(index);
  };

  const handleCloseSlideImage = () => {
    setShowSlideImage(false);
  };

  return (
    <div>
      <div className="photo-list">
        {photos &&
          photos.map((photo, i) => (
            <img
              key={i}
              src={photo.urls.regular}
              alt={photo.id}
              onClick={() => handleShowSlideImage(i)}
            />
          ))}
      </div>

      {loading && <Loading />}

      {showSlideImage && photos && photos.length && (
        <SlideImage
          onClose={handleCloseSlideImage}
          images={photos.map((photo) => ({
            url: photo.urls.regular,
            description: photo.alt_description,
            author: photo.user.name,
            createdAt: photo.created_at,
          }))}
          defaultIndex={selectedIndex}
        />
      )}
    </div>
  );
}
