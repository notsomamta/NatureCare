// src/components/Footer.jsx

function Footer() {
  return (
    <footer className="bg-gray-200 text-center p-4 mt-auto">
      <p className="text-sm text-dark-green">
        &copy; {new Date().getFullYear()} NatureCare. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;