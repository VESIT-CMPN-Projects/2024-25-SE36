import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <h4 className="font-bold">Opening hours</h4>
          <p>Mon-Fri 08:00AM - 08:00PM</p>
          <p>Sat-Sun 08:00AM - 08:00PM</p>
        </div>
        <div>
          <h4 className="font-bold">Find Us</h4>
          <p>Shreeji Arcade
          Nitin Company, Thane West</p>
          <p>Maharashtra ,India</p>
          <p>(566) 237-4687</p>
          <p>moinefou@hotmail.com</p>
        </div>
        <div>
          <h4 className="font-bold">Property</h4>
          <p>Apartments</p>
          <p>Villa's</p>
          <p>Houses</p>
          <p>Commercial</p>
        </div>
        <div>
          <h4 className="font-bold">Links</h4>
          <p>Home</p>
          <p>Property</p>
          <p>About</p>
          <p>Contact</p>
        </div>
        <div>
          <h4 className="font-bold">Newsletter</h4>this
          <p>Subscribe to our newsletter</p>
          <input type="email" placeholder="Your email" className="p-2 rounded border" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Subscribe</button>
        </div>
      </div>
      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p>©Copyright Ark Property Solutions 2023. Design by Soham Dharmik</p>
      </div>
    </footer>
  );
};

export default Footer;