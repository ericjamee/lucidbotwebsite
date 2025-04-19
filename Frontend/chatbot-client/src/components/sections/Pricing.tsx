import React from 'react';
import ScrollAnimation from '../ScrollAnimation';

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'Basic',
      price: '$299',
      frequency: 'one-time setup + $49/mo',
      description: 'Perfect for small businesses or personal websites.',
      features: [
        'One-page chatbot',
        'Trained on up to 3 sources',
        'Basic customization',
        'Email support',
        'Basic embedding code',
        'Monthly content updates'
      ],
      cta: 'Get Started',
      mostPopular: false,
    },
    {
      name: 'Pro',
      price: '$499',
      frequency: 'one-time setup + $99/mo',
      description: 'Ideal for growing businesses with more complex needs.',
      features: [
        'Full website chatbot',
        'Trained on up to 10 sources',
        'Advanced customization',
        'Priority email & chat support',
        'Custom embedding options',
        'Bi-weekly content updates',
        'Performance analytics'
      ],
      cta: 'Get Started',
      mostPopular: true,
    },
    {
      name: 'Custom',
      price: 'Contact Us',
      frequency: 'custom pricing',
      description: 'For enterprises with specialized requirements.',
      features: [
        'Multi-website implementation',
        'Unlimited training sources',
        'Full brand customization',
        'Dedicated support manager',
        'API access',
        'Weekly content updates',
        'Advanced analytics & reporting',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      mostPopular: false,
    },
  ];

  return (
    <div id="pricing" className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Simple, Transparent Pricing
            </p>
            <p className="mt-4 max-w-2xl text-xl text-neutral-600 lg:mx-auto">
              Choose the perfect plan for your business needs
            </p>
          </div>
        </ScrollAnimation>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <ScrollAnimation 
              key={tier.name} 
              delay={index * 150}
            >
              <div 
                className={`relative flex flex-col rounded-xl bg-white shadow-soft overflow-hidden ${
                  tier.mostPopular ? 'ring-2 ring-primary-600 lg:-translate-y-4' : ''
                }`}
              >
                {tier.mostPopular && (
                  <div className="absolute top-0 right-0 left-0 py-2 bg-primary-600 text-white text-center text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className={`px-6 py-8 ${tier.mostPopular ? 'pt-12' : 'pt-8'}`}>
                  <h3 className="text-2xl font-bold text-neutral-900">{tier.name}</h3>
                  <p className="mt-4 flex items-baseline text-neutral-900">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">{tier.frequency}</p>
                  <p className="mt-6 text-neutral-600">{tier.description}</p>
                </div>

                <div className="flex-1 flex flex-col px-6 pb-8">
                  <div className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="ml-3 text-base text-neutral-700">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <a
                      href="#contact"
                      className={`block w-full rounded-md py-3 px-4 text-center font-medium ${
                        tier.mostPopular
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      }`}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing; 