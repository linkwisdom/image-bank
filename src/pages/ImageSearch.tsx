import React, { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { initDB, getAllImages, Image } from '../utils/indexedDB';

const ImageSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'fuzzy' | 'exact'>('fuzzy');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'size'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);

  const imagesPerPage = 12;

  useEffect(() => {
    const loadImages = async () => {
      await initDB();
      const loadedImages = await getAllImages();
      setImages(loadedImages);
    };
    loadImages();
  }, []);

  useEffect(() => {
    const filtered = images.filter((image) => {
      if (searchMode === 'exact') {
        return (
          image.name.toLowerCase() === searchTerm.toLowerCase() ||
          image.tags.some((tag) => tag.toLowerCase() === searchTerm.toLowerCase())
        );
      } else {
        return (
          image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
    });

    let sorted = [...filtered];
    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime());
    } else if (sortBy === 'size') {
      sorted.sort((a, b) => parseInt(b.attributes.size) - parseInt(a.attributes.size));
    }

    setFilteredImages(sorted);
    setCurrentPage(1);
  }, [searchTerm, searchMode, sortBy, images]);

  const pageCount = Math.ceil(filteredImages.length / imagesPerPage);
  const displayedImages = filteredImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">图片搜索</h1>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索图片..."
          className="p-2 border rounded flex-grow"
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded">
          <Search size={20} />
        </button>
      </div>
      <div className="mb-4 flex justify-between">
        <div>
          <label className="mr-2">搜索模式:</label>
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as 'fuzzy' | 'exact')}
            className="p-2 border rounded"
          >
            <option value="fuzzy">模糊搜索</option>
            <option value="exact">精确搜索</option>
          </select>
        </div>
        <div>
          <label className="mr-2">排序方式:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'size')}
            className="p-2 border rounded"
          >
            <option value="relevance">相关性</option>
            <option value="date">创建日期</option>
            <option value="size">文件大小</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-gray-200 rounded"
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>
      </div>
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-3 gap-4' : 'grid-cols-1 gap-2'}`}>
        {displayedImages.map((image) => (
          <div key={image.id} className={`border p-2 rounded ${viewMode === 'list' ? 'flex items-center' : ''}`}>
            <img
              src={image.url}
              alt={image.name}
              className={`${viewMode === 'grid' ? 'w-full h-32 object-cover mb-2' : 'w-24 h-24 object-cover mr-4'}`}
            />
            <div>
              <p className="font-bold">{image.name}</p>
              <p className="text-sm text-gray-500">大小: {image.attributes.size}</p>
              <p className="text-sm text-gray-500">创建时间: {new Date(image.attributes.createdAt).toLocaleDateString()}</p>
              <div className="flex flex-wrap mt-1">
                {image.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSearch;