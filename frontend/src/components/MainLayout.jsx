// src/components/MainLayout.jsx
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function MainLayout({ children, user, onLogout }) { // <-- Add user here
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} /> {/* <-- Pass user here */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;