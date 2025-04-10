import React, { useRef } from 'react';

function Home() {
  const servicesRef = useRef(null);

  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <section className="text-center py-16 bg-gradient-to-r from-blue-800 to-black text-white">
        <h1 className="text-4xl font-bold pt-20 mb-4">Welcome to Tech Class Nepal</h1>
        <p className="text-xl">A place to learn, grow, and connect with your peers and teachers.</p>
        <button
          onClick={scrollToServices}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-black to-blue-800 text-lg text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </button>
      </section>

      <section ref={servicesRef} className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Assignments</h3>
            <p className="text-gray-700">Get your assignments and track progress in one place.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Support</h3>
            <p className="text-gray-700">Access help and guidance from experienced teachers.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Collaborations</h3>
            <p className="text-gray-700">Engage in group learning and discussions with classmates.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
