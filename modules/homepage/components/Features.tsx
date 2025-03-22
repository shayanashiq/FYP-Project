import React from "react";

const Features = () => {
  return (
    <div className="container mx-auto py-6 px-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Fast Delivery */}
        <div className="flex items-center p-4 border-r ">
          <div className="w-12 h-12 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">FASTED DELIVERY</h3>
            <p className="text-sm text-gray-600">Delivery in 24/H</p>
          </div>
        </div>

        {/* 24 Hours Return */}
        <div className="flex items-center p-4 border-r ">
          <div className="w-12 h-12 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="12 12 12 8 14 6"></polyline>
              <path d="M5 21v-2a7 7 0 0 1 7-7h0a7 7 0 0 1 7 7v2"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">24 HOURS RETURN</h3>
            <p className="text-sm text-gray-600">100% money-back guarantee</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-center p-4 border-r ">
          <div className="w-12 h-12 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">SECURE PAYMENT</h3>
            <p className="text-sm text-gray-600">Your money is safe</p>
          </div>
        </div>

        {/* Support 24/7 */}
        <div className="flex items-center p-4  ">
          <div className="w-12 h-12 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">SUPPORT 24/7</h3>
            <p className="text-sm text-gray-600">Live contact/message</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;