// src/components/Header.jsx

function Header({ user, onLogout }) {
  return (
    <header className="bg-dark-green text-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Using a placeholder for the logo for now */}
          <span className="text-2xl font-bold">NatureCare</span>
        </div>

        {/* This block will only show IF the top-level user object AND the nested user object exist */}
        {user && user.user && (
          <div className="flex items-center space-x-4">
            {/* THE FIX IS HERE: We access user.user.name */}
            <span className="text-sm">Welcome, {user.user.name}!</span> 
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm bg-olive-green rounded-md hover:bg-lime-green hover:text-dark-green"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;