import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security - Dividnd",
  description: "Security measures and practices for Dividnd dividend portfolio tracking platform",
};

export default function SecurityPage() {
  const securityMeasures = [
    {
      category: "Data Encryption",
      icon: "🔐",
      measures: [
        "End-to-end encryption for all data in transit",
        "AES-256 encryption for data at rest",
        "TLS 1.3 for all communications",
        "Encrypted database connections"
      ]
    },
    {
      category: "Authentication & Access",
      icon: "🔑",
      measures: [
        "OAuth 2.0 integration with Google and GitHub",
        "Session-based authentication with secure tokens",
        "Multi-factor authentication support",
        "Regular security token rotation"
      ]
    },
    {
      category: "Infrastructure Security",
      icon: "🏗️",
      measures: [
        "Secure cloud hosting with enterprise-grade security",
        "Regular security updates and patches",
        "Network-level firewalls and DDoS protection",
        "24/7 security monitoring and alerting"
      ]
    },
    {
      category: "Data Protection",
      icon: "🛡️",
      measures: [
        "GDPR and CCPA compliance",
        "Data minimization principles",
        "Regular security audits and assessments",
        "Secure data backup and recovery procedures"
      ]
    },
    {
      category: "Application Security",
      icon: "🔒",
      measures: [
        "Input validation and sanitization",
        "SQL injection prevention",
        "Cross-site scripting (XSS) protection",
        "Regular security code reviews"
      ]
    },
    {
      category: "Monitoring & Incident Response",
      icon: "📊",
      measures: [
        "Real-time security monitoring",
        "Automated threat detection",
        "Incident response procedures",
        "Regular penetration testing"
      ]
    }
  ];

  const complianceStandards = [
    {
      name: "GDPR",
      description: "General Data Protection Regulation compliance for EU users",
      status: "Compliant"
    },
    {
      name: "CCPA",
      description: "California Consumer Privacy Act compliance",
      status: "Compliant"
    },
    {
      name: "SOC 2 Type II",
      description: "Security, availability, and confidentiality controls",
      status: "In Progress"
    },
    {
      name: "ISO 27001",
      description: "Information security management system",
      status: "Planned"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Security & Privacy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your data security is our top priority. Learn about the comprehensive security measures we implement to protect your financial information.
          </p>
        </div>

        {/* Security Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Security Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
              <p className="text-gray-600">We use the same security standards as major financial institutions to protect your data.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">We never sell your data and only collect what's necessary to provide our services.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuous Monitoring</h3>
              <p className="text-gray-600">Our security team monitors our systems 24/7 to detect and prevent threats.</p>
            </div>
          </div>
        </div>

        {/* Security Measures */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Security Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-3xl mb-4">{measure.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{measure.category}</h3>
                <ul className="space-y-2">
                  {measure.measures.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceStandards.map((standard, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{standard.name}</h3>
                  <p className="text-gray-600 text-sm">{standard.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  standard.status === 'Compliant' 
                    ? 'bg-green-100 text-green-800'
                    : standard.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {standard.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Handling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Collect</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Account information (name, email from OAuth providers)</li>
              <li>• Portfolio data (stock positions, purchase details)</li>
              <li>• Investment goals and preferences</li>
              <li>• Usage analytics (anonymized)</li>
              <li>• Technical logs for security monitoring</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Never Collect</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Social Security Numbers</li>
              <li>• Bank account details</li>
              <li>• Credit card information</li>
              <li>• Personal identification documents</li>
              <li>• Sensitive personal information</li>
            </ul>
          </div>
        </div>

        {/* Incident Response */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Incident Response</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Process</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded mr-3 mt-0.5">1</span>
                  <span>Immediate detection and assessment of security incidents</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded mr-3 mt-0.5">2</span>
                  <span>Containment and mitigation of the threat</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded mr-3 mt-0.5">3</span>
                  <span>Investigation and root cause analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded mr-3 mt-0.5">4</span>
                  <span>Notification of affected users if necessary</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded mr-3 mt-0.5">5</span>
                  <span>Implementation of preventive measures</span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Security Issues</h3>
              <p className="text-gray-700 mb-4">
                If you discover a security vulnerability or have concerns about our security practices, please report it to us immediately.
              </p>
              <div className="space-y-3">
                <a href="mailto:security@dividnd.com" className="block text-blue-600 hover:text-blue-700 font-medium">
                  security@dividnd.com
                </a>
                <p className="text-sm text-gray-600">
                  We take all security reports seriously and will respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Questions About Security?</h2>
          <p className="text-blue-800 mb-6">
            Our security team is available to answer any questions about our security practices and data protection measures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:security@dividnd.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Security Team
            </a>
            <a
              href="/privacy"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
