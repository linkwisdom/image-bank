import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Image className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">图片库</span>
        </Link>
        <nav>
          <Link to="/profile" className="text-gray-600 hover:text-gray-900">用户资料</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;