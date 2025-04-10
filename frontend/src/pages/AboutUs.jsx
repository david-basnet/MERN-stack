import React from "react";
import avatar from "../photos/user-profile-avatar-icon-134114292.webp";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <section className="text-center py-12 bg-gradient-to-r from-blue-800 to-black text-white">
        <h1 className="text-4xl font-bold pt-20 mb-4">About Tech Class Nepal</h1>
        <p className="text-lg">Empowering education through technology and innovation.</p>
      </section>

      
      <section className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-blue-800 mb-4">Who We Are</h2>
        <p className="text-gray-700">
          Tech Class Nepal is an online learning platform dedicated to making education
          more accessible and interactive. Our mission is to bridge the gap between students
          and teachers by offering a user-friendly system for assignments, discussions, and
          learning resources.
        </p>
      </section>

     
      <section className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-blue-800 mb-4">Our Mission & Vision</h2>
        <p className="text-gray-700 mb-4">
          Our goal is to provide a seamless digital education experience, helping students
          and teachers collaborate efficiently.
        </p>
        <p className="text-gray-700">
          We envision a future where online learning is engaging, interactive, and accessible
          to all students, regardless of their location.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <img src={avatar} alt="Aarav Shrestha" className="w-32 h-32 mx-auto rounded-full object-cover" />
            <h3 className="mt-4 text-xl font-semibold text-blue-800">Tumyahang Lawati</h3>
            <p className="text-gray-600">Lead Instructor</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <img src={avatar} alt="Sita Shrestha" className="w-32 h-32 mx-auto rounded-full object-cover" />
            <h3 className="mt-4 text-xl font-semibold text-blue-800">Bidur Siwaoti</h3>
            <p className="text-gray-600">Course Manager</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <img src={avatar} alt="Prakash Thapa" className="w-32 h-32 mx-auto rounded-full object-cover" />
            <h3 className="mt-4 text-xl font-semibold text-blue-800">Prashanna Pradhan</h3>
            <p className="text-gray-600">Support Specialist</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-3xl font-semibold text-blue-800 mb-4">Get in Touch</h2>
        <p className="text-gray-700 mb-4">
          Have questions or need support? Reach out to us at:
        </p>
        <p className="text-lg text-blue-700 font-semibold">techclassnep2020@gmail.com</p>
      </section>
    </div>
  );
}

export default AboutUs;
