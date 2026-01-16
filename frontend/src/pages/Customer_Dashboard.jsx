

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Common_Utils";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState("");
  
  // Modal/overlay states
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Mock customer ID - in real app, get from auth context
  const customerId = 1;

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard overview using our new routes
      const [overviewRes, jobsRes, activityRes] = await Promise.all([
        axios.get(`${API_BASE}/transport/customer/${customerId}/dashboard`),
        axios.get(`${API_BASE}/transport/customer/${customerId}/active-jobs`),
        axios.get(`${API_BASE}/transport/customer/${customerId}/activity`)
      ]);

      if (overviewRes.data?.ok) {
        setDashboardData(overviewRes.data.data);
      }
      if (jobsRes.data?.ok) {
        setActiveJobs(jobsRes.data.data || []);
      }
      if (activityRes.data?.ok) {
        setRecentActivity(activityRes.data.data || []);
      }
      
      setError("");
    } catch (e) {
      console.error('Dashboard fetch error:', e);
      setError("Failed to load dashboard data from server");
      
      // Fallback mock data for development
      setDashboardData({
        totalJobs: 24,
        activeJobs: 3,
        completedJobs: 18,
        totalSpent: 15420.50,
        pendingQuotes: 2,
        averageResponseTime: "2.4 hours",
        thisMonthJobs: 5,
        thisMonthSpent: 3250.75
      });
      
      setActiveJobs([
        {
          Transport_ID: 1,
          Title: "Boat Transport - Miami to Orlando",
          Posted_Date: "2025-09-20T10:00:00Z",
          Collection_Address: "Miami, FL",
          Delivery_Address: "Orlando, FL",
          Deadline_Date: "2025-09-25T18:00:00Z",
          Quote_Count: 5,
          Lowest_Quote: 850,
          Highest_Quote: 1200,
          Status: "awaiting_selection"
        },
        {
          Transport_ID: 2,
          Title: "Trailer Transport - Local Move",
          Posted_Date: "2025-09-22T14:30:00Z",
          Collection_Address: "Tampa, FL",
          Delivery_Address: "Clearwater, FL", 
          Deadline_Date: "2025-09-24T16:00:00Z",
          Quote_Count: 0,
          Status: "awaiting_quotes"
        }
      ]);
      
      setRecentActivity([
        {
          id: 1,
          type: "quote_received",
          message: "New quote received for Boat Transport job",
          timestamp: "2025-09-23T10:15:00Z",
          job_title: "Boat Transport - Miami to Orlando"
        },
        {
          id: 2,
          type: "job_completed",
          message: "Engine Transport job completed successfully",
          timestamp: "2025-09-22T16:45:00Z",
          job_title: "Engine Transport - Interstate"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Navigation handlers
  const handlePostNewJob = () => {
    navigate('/advert/transport');
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/detail/transport/${jobId}`);
  };

  const handleViewAllJobs = () => {
    setShowAllJobs(true);
  };

  const handleShowAnalytics = () => {
    setShowAnalytics(true);
  };

  const handleShowAllActivity = () => {
    setShowActivity(true);
  };

  // Stat card click handlers
  const handleStatCardClick = (type) => {
    switch (type) {
      case 'total':
        handleViewAllJobs();
        break;
      case 'active':
        setShowAllJobs(true);
        break;
      case 'completed':
        navigate('/search/transport', { 
          state: { filters: { jobStatus: 'completed' } } 
        });
        break;
      case 'spent':
        handleShowAnalytics();
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quote_received': return '💬';
      case 'job_completed': return '✅';
      case 'job_started': return '🚛';
      case 'question_asked': return '❓';
      default: return '📋';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'awaiting_quotes':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Awaiting Quotes</span>;
      case 'awaiting_selection':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Review Quotes</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
    }
  };

  // Clickable Stat Card Component
  const StatCard = ({ title, value, subtitle, icon, color = "blue", onClick, type }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-200 transform hover:-translate-y-0.5' : ''
      }`}
      onClick={() => onClick && handleStatCardClick(type)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`text-3xl bg-${color}-50 p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      {onClick && (
        <div className="mt-2 text-xs text-gray-400 flex items-center">
          <span>Click to view details</span>
          <span className="ml-1">→</span>
        </div>
      )}
    </div>
  );

  // Enhanced Job Card with click functionality
  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
         onClick={() => handleViewJobDetails(job.Transport_ID)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{job.Title}</h4>
            {getStatusBadge(job.Status)}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">📍</span>
              {job.Collection_Address} → {job.Delivery_Address}
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">📅</span>
              Deadline: {formatDate(job.Deadline_Date)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Posted {getTimeAgo(job.Posted_Date)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
            {job.Quote_Count || 0} Quotes
          </span>
          {job.Quote_Count > 0 && (
            <span className="text-sm text-gray-600">
              {formatCurrency(job.Lowest_Quote)} - {formatCurrency(job.Highest_Quote)}
            </span>
          )}
        </div>
        <div className="flex items-center text-blue-600 text-sm font-medium">
          <span>View Details</span>
          <span className="ml-1">→</span>
        </div>
      </div>
    </div>
  );

  // Modal Components
  const AllJobsModal = () => (
    showAllJobs && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">All My Transport Jobs</h2>
            <button 
              onClick={() => setShowAllJobs(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <JobCard key={job.Transport_ID} job={job} />
              ))}
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button 
              onClick={() => setShowAllJobs(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button 
              onClick={handlePostNewJob}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Post New Job
            </button>
          </div>
        </div>
      </div>
    )
  );

  const AnalyticsModal = () => (
    showAnalytics && dashboardData && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Spending Analytics</h2>
            <button 
              onClick={() => setShowAnalytics(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.totalSpent)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.thisMonthSpent)}</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Spending Breakdown</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Average per job:</span>
                  <span className="font-medium">{formatCurrency(dashboardData.totalSpent / dashboardData.totalJobs)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed jobs:</span>
                  <span className="font-medium">{dashboardData.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly average:</span>
                  <span className="font-medium">{formatCurrency(dashboardData.totalSpent / 12)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button 
              onClick={() => setShowAnalytics(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ActivityModal = () => (
    showActivity && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">All Recent Activity</h2>
            <button 
              onClick={() => setShowActivity(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className="text-2xl mt-1">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.job_title} • {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button 
              onClick={() => setShowActivity(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your transport jobs and track performance</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePostNewJob}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            Post New Job
          </button>
          <button 
            onClick={handleViewAllJobs}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Jobs
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Overview - Now Clickable */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Jobs"
            value={dashboardData.totalJobs}
            subtitle="Click to view all"
            icon="📋"
            color="blue"
            onClick={true}
            type="total"
          />
          <StatCard
            title="Active Jobs"
            value={dashboardData.activeJobs}
            subtitle="Click to manage"
            icon="🔄"
            color="orange"
            onClick={true}
            type="active"
          />
          <StatCard
            title="Completed Jobs"
            value={dashboardData.completedJobs}
            subtitle="Click to review"
            icon="✅"
            color="green"
            onClick={true}
            type="completed"
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(dashboardData.totalSpent)}
            subtitle="Click for analytics"
            icon="💰"
            color="purple"
            onClick={true}
            type="spent"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Jobs</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{activeJobs.length} active</span>
              <button 
                onClick={handleViewAllJobs}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          
          {activeJobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No active jobs</div>
              <div className="text-gray-500 text-sm">Post a new transport job to get started</div>
              <button 
                onClick={handlePostNewJob}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Post New Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.slice(0, 3).map((job) => (
                <JobCard key={job.Transport_ID} job={job} />
              ))}
              {activeJobs.length > 3 && (
                <button 
                  onClick={handleViewAllJobs}
                  className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View {activeJobs.length - 3} More Jobs →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          {dashboardData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jobs Posted</span>
                  <span className="font-semibold text-blue-600">{dashboardData.thisMonthJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Spent</span>
                  <span className="font-semibold text-green-600">{formatCurrency(dashboardData.thisMonthSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-semibold text-orange-600">{dashboardData.averageResponseTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              {recentActivity.length > 0 && (
                <button 
                  onClick={handleShowAllActivity}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              )}
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.job_title} • {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handlePostNewJob}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">📝</span>
                Post New Transport Job
              </button>
              <button 
                onClick={() => navigate('/search/transport')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">🔍</span>
                Browse Transport Services
              </button>
              <button 
                onClick={handleShowAnalytics}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">📊</span>
                View Analytics
              </button>
              <button 
                onClick={() => navigate('/account/settings')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">⚙️</span>
                Account Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AllJobsModal />
      <AnalyticsModal />
      <ActivityModal />
    </div>
  );
}
