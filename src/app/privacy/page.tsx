import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Dividnd",
  description: "Privacy Policy for Dividnd dividend portfolio tracking platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> January 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Name and email address (from OAuth providers like Google and GitHub)</li>
                  <li>Profile picture (if provided by OAuth provider)</li>
                  <li>Account creation and last login timestamps</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Portfolio Data</h3>
                <p className="text-gray-700 mb-4">
                  To provide our services, we store:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Portfolio names and configurations</li>
                  <li>Stock positions (ticker, shares, purchase price, purchase date)</li>
                  <li>Dividend goals and preferences</li>
                  <li>Investment calculations and analytics</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Data</h3>
                <p className="text-gray-700 mb-4">
                  We automatically collect:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>IP address and browser information</li>
                  <li>Pages visited and features used</li>
                  <li>Session duration and frequency of use</li>
                  <li>Error logs and performance data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use your information to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Provide and maintain our portfolio tracking services</li>
                  <li>Calculate dividends, returns, and investment analytics</li>
                  <li>Send you important service updates and notifications</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Storage and Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>All data is encrypted in transit and at rest</li>
                  <li>We use secure cloud infrastructure (Supabase/Vercel)</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Regular backups with encryption</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share data only in these circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, analytics, email services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  We integrate with third-party services to provide stock data and authentication:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Alpha Vantage:</strong> For real-time stock prices and dividend data</li>
                  <li><strong>Finnhub:</strong> Backup data source for stock information</li>
                  <li><strong>Google OAuth:</strong> For secure account authentication</li>
                  <li><strong>GitHub OAuth:</strong> For secure account authentication</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights (GDPR/CCPA)</h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to certain types of data processing</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  To exercise these rights, contact us at privacy@dividnd.com
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Remember your login status and preferences</li>
                  <li>Analyze usage patterns and improve our service</li>
                  <li>Provide personalized content and features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your data for as long as your account is active or as needed to provide our services. When you delete your account, we will:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Delete your personal information within 30 days</li>
                  <li>Retain anonymized analytics data for service improvement</li>
                  <li>Keep certain data as required by law or for legitimate business purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> support@dividnd.com
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
