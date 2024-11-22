import React, { useState } from 'react';
import { Check } from 'lucide-react';
import EmailModal from './EmailModal';

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export default function PricingCard({ title, price, duration, description, features, popular, savings }: PricingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'before' | 'after'>('before');

  const handleSubmit = async (data: { name: string; company: string; email: string }) => {
    try {
      const response = await fetch('https://formsubmit.co/ajax/salmanbareeshsb@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Order: ${title} (Pay ${paymentType})`,
          name: data.name,
          company: data.company,
          email: data.email,
          plan: title,
          price: `₹${price}`,
          duration: duration,
          paymentType: `Pay ${paymentType}`,
          orderDate: new Date().toLocaleString()
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit order');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      throw new Error('Failed to submit. Please try again or contact support directly at salmanbareeshsb@gmail.com');
    }
  };

  const isPremiumBusiness = title.includes('Premium Business');

  return (
    <div className={`h-full ${popular ? 'lg:scale-110' : ''}`}>
      <div className={`h-full glass-card rounded-2xl transition-all duration-300 ${
        popular ? 'border-2 border-purple-500/50 shadow-lg shadow-purple-500/20' : ''
      }`}>
        <div className="p-8">
          {popular && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full">
              Most Popular
            </span>
          )}
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gradient">₹{price}</span>
              <span className="text-gray-400">{duration}</span>
            </div>
            {savings && (
              <div className="mt-3">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Save ₹{savings}
                </span>
              </div>
            )}
          </div>
          
          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="space-y-3 mt-auto">
            <button
              onClick={() => {
                setPaymentType('before');
                setIsModalOpen(true);
              }}
              className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/50"
            >
              I want to pay
            </button>
            
            {!isPremiumBusiness && (
              <button
                onClick={() => {
                  setPaymentType('after');
                  setIsModalOpen(true);
                }}
                className="w-full py-3 px-6 rounded-xl font-semibold glass-card hover:bg-white/10 transition-all duration-300"
              >
                I want to pay after activation
              </button>
            )}
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planTitle={title}
        paymentType={paymentType}
        onSubmit={handleSubmit}
      />
    </div>
  );
}