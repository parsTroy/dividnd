import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation - Dividnd",
  description: "Developer API documentation for Dividnd portfolio tracking platform",
};

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/trpc/portfolio.getAll",
      description: "Get all portfolios for the authenticated user",
      parameters: [],
      response: {
        portfolios: [
          {
            id: "string",
            name: "string",
            isMain: "boolean",
            monthlyDividendGoal: "number | null",
            annualDividendGoal: "number | null"
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/api/trpc/position.getPortfolioSummary",
      description: "Get comprehensive portfolio summary with positions and analytics",
      parameters: [
        { name: "portfolioId", type: "string", required: true, description: "Portfolio ID" }
      ],
      response: {
        portfolio: "Portfolio object",
        positions: "Position[]",
        summary: {
          totalInvested: "number",
          totalCurrentValue: "number",
          totalUnrealizedGainLoss: "number",
          totalAnnualDividends: "number"
        }
      }
    },
    {
      method: "POST",
      path: "/api/trpc/position.create",
      description: "Add a new stock position to a portfolio",
      parameters: [
        { name: "portfolioId", type: "string", required: true, description: "Portfolio ID" },
        { name: "ticker", type: "string", required: true, description: "Stock ticker symbol" },
        { name: "shares", type: "number", required: true, description: "Number of shares" },
        { name: "purchasePrice", type: "number", required: true, description: "Purchase price per share" },
        { name: "purchaseDate", type: "string", required: true, description: "Purchase date (ISO string)" }
      ],
      response: {
        id: "string",
        ticker: "string",
        shares: "number",
        purchasePrice: "number",
        currentPrice: "number",
        dividendYield: "number"
      }
    },
    {
      method: "GET",
      path: "/api/trpc/stock.getStockData",
      description: "Get real-time stock data for a ticker symbol",
      parameters: [
        { name: "ticker", type: "string", required: true, description: "Stock ticker symbol" }
      ],
      response: {
        symbol: "string",
        price: "number",
        change: "number",
        changePercent: "number",
        dividendYield: "number",
        lastUpdated: "string"
      }
    },
    {
      method: "GET",
      path: "/api/trpc/stock.getAllCachedStocks",
      description: "Get all cached stock data for suggestions",
      parameters: [],
      response: {
        stocks: [
          {
            symbol: "string",
            price: "number",
            dividendYield: "number",
            lastUpdated: "string"
          }
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">API Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Integrate Dividnd's portfolio tracking capabilities into your own applications with our comprehensive REST API.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
              <p className="text-gray-700 mb-4">
                All API requests require authentication using session cookies or API keys. Include your session token in the request headers.
              </p>
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                <div>Authorization: Bearer YOUR_SESSION_TOKEN</div>
                <div>Content-Type: application/json</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h3>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                https://dividnd.com/api/trpc
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rate Limits</h3>
              <p className="text-gray-700">
                API requests are limited to 100 requests per minute per user. Rate limit headers are included in all responses.
              </p>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">API Endpoints</h2>
          
          {endpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded text-sm font-semibold mr-4 ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
              </div>
              
              <p className="text-gray-700 mb-4">{endpoint.description}</p>
              
              {endpoint.parameters.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900">Name</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900">Type</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900">Required</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <tr key={paramIndex}>
                            <td className="px-3 py-2 font-mono text-gray-900">{param.name}</td>
                            <td className="px-3 py-2 text-gray-700">{param.type}</td>
                            <td className="px-3 py-2 text-gray-700">{param.required ? 'Yes' : 'No'}</td>
                            <td className="px-3 py-2 text-gray-700">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SDKs and Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">JavaScript Example</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`// Get all portfolios
const response = await fetch('/api/trpc/portfolio.getAll', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_SESSION_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.portfolios);`}</pre>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Python Example</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`import requests

# Get portfolio summary
response = requests.get(
    'https://dividnd.com/api/trpc/position.getPortfolioSummary',
    headers={
        'Authorization': 'Bearer YOUR_SESSION_TOKEN',
        'Content-Type': 'application/json'
    },
    params={'portfolioId': 'your-portfolio-id'}
)

data = response.json()
print(data['summary'])`}</pre>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Handling</h2>
          <p className="text-gray-700 mb-4">
            The API uses standard HTTP status codes and returns error details in the response body.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Error Codes</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-16 text-sm font-mono text-gray-600">400</span>
                  <span className="text-gray-700">Bad Request - Invalid parameters</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-sm font-mono text-gray-600">401</span>
                  <span className="text-gray-700">Unauthorized - Invalid or missing authentication</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-sm font-mono text-gray-600">403</span>
                  <span className="text-gray-700">Forbidden - Insufficient permissions</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-sm font-mono text-gray-600">404</span>
                  <span className="text-gray-700">Not Found - Resource doesn't exist</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-sm font-mono text-gray-600">429</span>
                  <span className="text-gray-700">Too Many Requests - Rate limit exceeded</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-sm font-mono text-gray-600">500</span>
                  <span className="text-gray-700">Internal Server Error - Server-side error</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Need Help?</h2>
          <p className="text-blue-800 mb-6">
            Have questions about our API or need help with integration? Our developer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:api@dividnd.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact API Support
            </a>
            <a
              href="/support"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
