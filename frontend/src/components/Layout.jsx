// Layout.js
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar fijo */}
      <div className="flex-shrink-0 h-full">
        <Sidebar darkMode={darkMode} />
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar fijo arriba */}
        <div className="sticky top-0 z-50">
          <Navbar onToggleDark={setDarkMode} darkMode={darkMode} />
        </div>

        {/* Contenido scrollable */}
        <main
          className={`flex-1 p-6 overflow-auto transition-colors duration-300 ${
            darkMode ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
