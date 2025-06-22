import React from "react";
import { Menu, X } from "lucide-react";

function AuthorSidebar({ currentView, setCurrentView, isOpen, toggleSidebar }) {
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed right-4 top-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg transition duration-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-5 text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow mt-2">
          Author Panel
        </div>

        <ul className="p-4 space-y-3">
          {[ 
            { label: "Create Post", value: "create" },
            { label: "Your Posts", value: "posts" },
          ].map((item) => (
            <li key={item.value}>
              <button
                onClick={() => handleViewChange(item.value)}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium text-sm tracking-wide ${
                  currentView === item.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 hover:bg-blue-100 text-gray-800"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AuthorSidebar;
