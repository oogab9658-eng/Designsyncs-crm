import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  BarChart3, 
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
    { to: '/admin/reports', icon: <BarChart3 size={20}/>, label: 'Report Board' },
    { to: '/admin/users', icon: <Users size={20}/>, label: 'Users' }
  ];

  const teamLinks = [
    { to: '/team', icon: <Layers size={20}/>, label: 'My Tasks' }
  ];

  const clientLinks = [
    { to: '/client', icon: <CheckCircle2 size={20}/>, label: 'Project Progress' }
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'team' ? teamLinks : clientLinks;

  return (
    <div className="w-64 bg-secondary text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-indigo-400">Designsyncs</h1>
        <p className="text-xs text-gray-400 mt-1">Agency CRM</p>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs">
            {user?.name?.charAt(0)}
          </div>
          <div className="truncate">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-gray-800 rounded-lg"
        >
          <LogOut size={20}/>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
