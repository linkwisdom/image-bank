import React, { useState, useEffect } from 'react';
import { Folder, Tag, Trash, Plus, Upload } from 'lucide-react';
import { initDB, getAllImages, getAllFolders, addFolder, deleteFolder, addImage, updateImage, deleteImage, Image, Folder as FolderType } from '../utils/indexedDB';

const ImageCollection: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const initialize = async () => {
      await initDB();
      const loadedImages = await getAllImages();
      const loadedFolders = await getAllFolders();
      setImages(loadedImages);
      setFolders(loadedFolders);
    };
    initialize();
  }, []);

  const handleCreateFolder = async () => {
    if (newFolderName) {
      const newFolder: FolderType = { id: Date.now().toString(), name: newFolderName, isPublic: false };
      await addFolder(newFolder);
      setFolders([...folders, newFolder]);
      setNewFolderName('');
    }
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteFolder(id);
    setFolders(folders.filter(folder => folder.id !== id));
  };

  const handleAddTag = async (imageId: string) => {
    if (newTag && selectedImage) {
      const updatedImage = { ...selectedImage, tags: [...selectedImage.tags, newTag] };
      await updateImage(updatedImage);
      setImages(images.map(img => img.id === imageId ? updatedImage : img));
      setSelectedImage(updatedImage);
      setNewTag('');
    }
  };

  const handleRemoveTag = async (imageId: string, tagToRemove: string) => {
    if (selectedImage) {
      const updatedImage = { ...selectedImage, tags: selectedImage.tags.filter(tag => tag !== tagToRemove) };
      await updateImage(updatedImage);
      setImages(images.map(img => img.id === imageId ? updatedImage : img));
      setSelectedImage(updatedImage);
    }
  };

  const handleImageSelect = (image: Image) => {
    setSelectedImage(image);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newImage: Image = {
          id: Date.now().toString(),
          name: file.name,
          url: e.target?.result as string,
          tags: [],
          folder: 'default',
          attributes: {
            size: `${file.size} bytes`,
            resolution: 'Unknown',
            createdAt: new Date().toISOString(),
          },
        };
        await addImage(newImage);
        setImages([...images, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">文件夹</h2>
        <ul>
          {folders.map(folder => (
            <li key={folder.id} className="flex items-center justify-between mb-2">
              <span>
                <Folder className="inline mr-2" size={16} />
                {folder.name} {folder.isPublic ? '(公开)' : '(私有)'}
              </span>
              <button onClick={() => handleDeleteFolder(folder.id)} className="text-red-500">
                <Trash size={16} />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="新文件夹名称"
            className="w-full p-2 border rounded"
          />
          <button onClick={handleCreateFolder} className="mt-2 bg-blue-500 text-white p-2 rounded w-full">
            <Plus className="inline mr-2" size={16} />
            创建文件夹
          </button>
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="bg-green-500 text-white p-2 rounded w-full flex items-center justify-center cursor-pointer">
            <Upload className="inline mr-2" size={16} />
            上传图片
          </label>
        </div>
      </div>
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">图片集合</h2>
        <div className="grid grid-cols-3 gap-4">
          {images.map(image => (
            <div key={image.id} className="border p-2 rounded" onClick={() => handleImageSelect(image)}>
              <img src={image.url} alt={image.name} className="w-full h-32 object-cover mb-2" />
              <p className="font-bold">{image.name}</p>
              <p className="text-sm text-gray-500">{image.folder}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/4 p-4 bg-gray-100">
        {selectedImage && (
          <div>
            <h2 className="text-xl font-bold mb-4">图片详情</h2>
            <img src={selectedImage.url} alt={selectedImage.name} className="w-full mb-4" />
            <h3 className="font-bold">{selectedImage.name}</h3>
            <p>文件夹: {selectedImage.folder}</p>
            <div className="mt-4">
              <h4 className="font-bold">标签</h4>
              <div className="flex flex-wrap">
                {selectedImage.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2">
                    {tag}
                    <button onClick={() => handleRemoveTag(selectedImage.id, tag)} className="ml-1 text-red-500">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="新标签"
                  className="flex-grow p-2 border rounded-l"
                />
                <button onClick={() => handleAddTag(selectedImage.id)} className="bg-blue-500 text-white p-2 rounded-r">
                  添加
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-bold">属性</h4>
              <p>大小: {selectedImage.attributes.size}</p>
              <p>分辨率: {selectedImage.attributes.resolution}</p>
              <p>创建时间: {selectedImage.attributes.createdAt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCollection;