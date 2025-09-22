"use client";

import { useState, useEffect } from "react";

export default function StatusPage() {
  const [status, setStatus] = useState({
    overall: "operational",
    services: [
      {
        name: "API Services",
        status: "operational",
        uptime: "99.9%",
        lastIncident: null
      },
      {
        name: "Database",
        status: "operational",
        uptime: "99.8%",
        lastIncident: null
      },
      {
        name: "Stock Data Feed",
        status: "operational",
        uptime: "99.7%",
        lastIncident: null
      },
      {
        name: "Authentication",
        status: "operational",
        uptime: "99.9%",
        lastIncident: null
      },
      {
        name: "CDN",
        status: "operational",
        uptime: "99.9%",
        lastIncident: null
      }
    ],
    incidents: [
      {
        id: "inc-001",
        title: "Scheduled Maintenance - Database Optimization",
        status: "resolved",
        severity: "maintenance",
        startTime: "2025-01-15T02:00:00Z",
        endTime: "2025-01-15T04:00:00Z",
        description: "We performed scheduled database optimization to improve query performance. All services were restored successfully."
      },
      {
        id: "inc-002",
        title: "Stock Data Feed Interruption",
        status: "resolved",
        severity: "minor",
        startTime: "2025-01-10T14:30:00Z",
        endTime: "2025-01-10T15:15:00Z",
        description: "Temporary interruption in stock data feed from Alpha Vantage. Service was restored within 45 minutes using our backup data source."
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "outage":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "degraded":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "outage":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "maintenance":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-xl text-gray-600">
            Real-time status of Dividnd services and infrastructure
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Overall Status</h2>
            <div className={`px-4 py-2 rounded-full flex items-center ${getStatusColor(status.overall)}`}>
              {getStatusIcon(status.overall)}
              <span className="ml-2 font-semibold capitalize">{status.overall}</span>
            </div>
          </div>
          <p className="text-gray-700">
            All systems are operational. We're monitoring our services 24/7 to ensure the best experience for our users.
          </p>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Service Status</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {status.services.map((service, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Uptime: <span className="font-semibold">{service.uptime}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1 text-sm font-medium capitalize">{service.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Incidents</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {status.incidents.length > 0 ? (
              status.incidents.map((incident) => (
                <div key={incident.id} className="px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(incident.startTime).toLocaleString()} - {new Date(incident.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)}
                      <span className="ml-1 text-sm font-medium capitalize">{incident.status}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{incident.description}</p>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-600">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg">No recent incidents</p>
                <p className="text-sm">All services are running smoothly</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Response Time</h3>
            <p className="text-3xl font-bold text-green-600">45ms</p>
            <p className="text-sm text-gray-600">Last 24 hours</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Uptime</h3>
            <p className="text-3xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-gray-600">Last 30 days</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Requests</h3>
            <p className="text-3xl font-bold text-blue-600">2.4M</p>
            <p className="text-sm text-gray-600">Last 24 hours</p>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Stay Updated</h2>
          <p className="text-blue-800 mb-6">
            Subscribe to status updates and get notified immediately when there are any service disruptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
