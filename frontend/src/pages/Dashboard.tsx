import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Decentralized Agricultural Data Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, transparent, and tamper-proof agricultural data management using blockchain-inspired technology
          </p>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Immutable Data Security</h3>
                <p className="mt-2 text-gray-600">
                  All agricultural data is cryptographically secured and stored in an immutable format, 
                  ensuring that records cannot be altered or tampered with.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Decentralized Verification</h3>
                <p className="mt-2 text-gray-600">
                  Researchers and consumers can independently verify the authenticity of agricultural data 
                  using cryptographic hashes and content identifiers.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* User Portals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Access Your Portal</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Farmer Portal */}
            <Card className="p-8 flex flex-col h-full border border-green-200 bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-lg p-3">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"></path>
                  </svg>
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-900">Farmer Portal</h3>
              </div>
              
              <p className="text-gray-600 mb-6 flex-grow">
                Securely manage your farm data, submit sensor readings, and track your agricultural records 
                with blockchain-inspired security. All data is cryptographically secured and verifiable.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Submit soil and climate data</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>View historical data trends</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Generate cryptographic proofs</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Manage land parcel information</span>
                </li>
              </ul>
              
              <Link to="/auth" className="mt-auto">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Access Farmer Portal
                </Button>
              </Link>
            </Card>

            {/* Researcher Portal */}
            <Card className="p-8 flex flex-col h-full border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-900">Researcher Portal</h3>
              </div>
              
              <p className="text-gray-600 mb-6 flex-grow">
                Verify the authenticity of agricultural data, access transparent records, and conduct 
                research with confidence using our decentralized verification system.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Verify data authenticity</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Access transparent records</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Analyze historical trends</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Download verified datasets</span>
                </li>
              </ul>
              
              <Link to="/auth" className="mt-auto">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Access Researcher Portal
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Submission</h3>
              <p className="text-gray-600">
                Farmers submit agricultural data through our secure interface, which is then 
                cryptographically hashed and stored.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blockchain Securing</h3>
              <p className="text-gray-600">
                Data is secured using blockchain-inspired technology with cryptographic hashing 
                to ensure immutability and transparency.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification & Access</h3>
              <p className="text-gray-600">
                Researchers can verify data authenticity using content identifiers and cryptographic 
                proofs without requiring a central authority.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Secure Your Agricultural Data?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our decentralized platform and experience the future of agricultural data management
          </p>
          <Link to="/auth">
            <Button className="px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;