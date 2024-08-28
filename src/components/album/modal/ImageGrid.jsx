// components/ImageGrid.js
import React from 'react';
import { HiDotsVertical } from "react-icons/hi";

const ImageGrid = ({ filteredImages, toggleImageOptions, selectedImageIndex, openEditTagsModal, handleDeleteImage }) => {
  return (
    <div className="image-grid card">
      {filteredImages.map((image, index) => (
        <div key={index} className='relative'>
          <a href={image.imageurl} data-fancybox="gallery">
            <img src={image.thumburl} alt={`Album image ${index + 1}`} draggable={false} />
          </a>
          <div className='w-full min-h-[30px] pt-2'>
            <ul className='flex gap-2'>
              {image.tags.sort().map((tag, idx) => (
                <li className=' cursor-default text-black text-[12px]' key={idx}>{tag}</li>
              ))}
            </ul>
          </div>
          <div className='edit-modal absolute bottom-3 right-2'>
            <button onClick={() => toggleImageOptions(index)} className='p-2 rounded-md shadow-inner-[10px] shadow-black inline-block bg-red-600'>
              <HiDotsVertical />
            </button>
            {selectedImageIndex === index && (
              <div className='absolute bottom-0 right-5 bg-[#ccc] p-2 rounded'>
                <button onClick={() => openEditTagsModal(image.tags)}>edit</button>
                <button onClick={() => handleDeleteImage(image.imageId)}>delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
