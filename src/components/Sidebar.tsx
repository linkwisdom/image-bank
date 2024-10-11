import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FolderOpen, Search, Edit, Presentation, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-indigo-700 text-white w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center p-2 hover:bg-indigo-600 rounded">
              <Home className="mr-2" />
              仪表盘
            </Link>
          </li>
          <li>
            <Link to="/collection" className="flex items-center p-2 hover:bg-indigo-600 rounded">
              <FolderOpen className="mr-2" />
              图片集合
            </Link>
          </li>
          <li>
            <Link to="/search" className="flex items-center p-2 hover:bg-indigo-600 rounded">
              <Search className="mr-2" />
              图片搜索
            </Link>
          </li>
          <li>
            <Link to="/editor" className="flex items-center p-2 hover:bg-indigo-600 rounded">
              <Edit className="mr-2" />
              图片编辑
            </Link>
          </li>
          <li>
            <Link to="/presentation" className="flex items-center p-2 hover:bg-indigo-600 rounded">
              <Presentation className="mr-2" />
              演示稿创建
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center p-2 hover:bg-indigo-600 rounded">
              <User className="mr-2" />
              用户资料
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;