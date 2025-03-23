import React from 'react';

const Newsletter: React.FC = () => {
    return (
        <div className='px-20 mt-12'>
            <div className="bg-amber-500 py-8  rounded-lg">
            <h2 className="text-white text-3xl font-bold text-center mb-4">Subscribe to our newsletter</h2>
            
            <p className="text-white text-center mb-6 max-w-3xl mx-auto">
                Praesent fringilla erat a lacinia egestas. Donec vehicula tempor libero et cursus. Donec non quam urna. Quisque vitae porta ipsum.
            </p>
            
            <div className="flex max-w-md mx-auto mb-6">
                <input
                    type="email"
                    placeholder="Email address"
                    className="flex-grow px-4 py-2 rounded-l-md focus:outline-none"
                />
                <button className="bg-blue-500 text-white px-6 py-2 rounded-r-md flex items-center">
                    SUBSCRIBE
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
            
            <div className="flex justify-center items-center gap-4 flex-wrap">
                <img src="/api/placeholder/80/24" alt="Google" className="h-6 opacity-80" />
                <img src="/api/placeholder/80/24" alt="Amazon" className="h-6 opacity-80" />
                <img src="/api/placeholder/80/24" alt="Philips" className="h-6 opacity-80" />
                <img src="/api/placeholder/80/24" alt="Toshiba" className="h-6 opacity-80" />
                <img src="/api/placeholder/80/24" alt="Samsung" className="h-6 opacity-80" />
            </div>
        </div>
        </div>
    );
};

export default Newsletter;