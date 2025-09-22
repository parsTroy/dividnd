import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Dividnd",
  description: "Cookie Policy for Dividnd dividend portfolio tracking platform",
};

export default function CookiesPage() {
  const cookieTypes = [
    {
      category: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
      purpose: "Authentication, security, and basic functionality",
      examples: [
        "Session management cookies",
        "Authentication tokens",
        "Security cookies",
        "Load balancing cookies"
      ],
      retention: "Session or up to 30 days"
    },
    {
      category: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      purpose: "Website performance and user experience improvement",
      examples: [
        "Google Analytics cookies",
        "Page view tracking",
        "User journey analysis",
        "Performance monitoring"
      ],
      retention: "Up to 2 years"
    },
    {
      category: "Functional Cookies",
      description: "These cookies enable enhanced functionality and personalization, such as remembering your preferences.",
      purpose: "Personalization and user experience enhancement",
      examples: [
        "Language preferences",
        "Theme settings",
        "Portfolio display preferences",
        "Dashboard layout settings"
      ],
      retention: "Up to 1 year"
    },
    {
      category: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
      purpose: "Advertising and marketing optimization",
      examples: [
        "Social media tracking pixels",
        "Advertising platform cookies",
        "Remarketing cookies",
        "Conversion tracking"
      ],
      retention: "Up to 1 year"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
                <p className="text-gray-700 mb-4">
                  Dividnd uses cookies to enhance your experience, analyze site usage, and provide personalized content. This Cookie Policy explains how we use cookies and similar technologies on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies for several purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>To keep you signed in to your account</li>
                  <li>To remember your preferences and settings</li>
                  <li>To understand how you use our website</li>
                  <li>To improve our website's performance and functionality</li>
                  <li>To provide personalized content and features</li>
                  <li>To ensure website security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
                
                {cookieTypes.map((type, index) => (
                  <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.category}</h3>
                    <p className="text-gray-700 mb-4">{type.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Purpose:</h4>
                        <p className="text-gray-700 text-sm">{type.purpose}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Retention:</h4>
                        <p className="text-gray-700 text-sm">{type.retention}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                      <ul className="list-disc pl-6 text-gray-700 text-sm">
                        {type.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We may also use third-party cookies from trusted partners to enhance our services:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Google Analytics:</strong> To analyze website usage and performance</li>
                  <li><strong>Authentication Providers:</strong> Google and GitHub for secure login</li>
                  <li><strong>Content Delivery Networks:</strong> To improve website loading speed</li>
                  <li><strong>Security Services:</strong> To protect against fraud and abuse</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  These third parties have their own privacy policies and cookie practices. We encourage you to review their policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
                <p className="text-gray-700 mb-4">
                  You have several options for managing cookies:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Set up notifications when cookies are set</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie Consent</h3>
                <p className="text-gray-700 mb-4">
                  When you first visit our website, you'll see a cookie consent banner. You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your preferences</li>
                  <li>Change your settings at any time</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Opt-Out Links</h3>
                <p className="text-gray-700 mb-4">
                  For specific third-party services, you can opt out directly:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-700">Google Analytics Opt-out</a></li>
                  <li><a href="https://www.google.com/settings/ads" className="text-blue-600 hover:text-blue-700">Google Ads Settings</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Please note that disabling certain cookies may affect your experience on our website:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>You may need to sign in repeatedly</li>
                  <li>Your preferences may not be saved</li>
                  <li>Some features may not work properly</li>
                  <li>Website performance may be reduced</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@dividnd.com<br />
                    <strong>Address:</strong> 123 Financial District, Suite 100, New York, NY 10004
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
