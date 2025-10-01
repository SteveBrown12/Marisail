
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Common_Utils";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function HaulierDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [error, setError] = useState("");
  
  // Modal/overlay states
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Bidding modal state
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [quoteValue, setQuoteValue] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Mock haulier ID - in real app, get from auth context
  const haulierId = 1;

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch comprehensive dashboard data using our new routes
      const [overviewRes, jobsRes, quotesRes, activityRes, performanceRes, complianceRes] = await Promise.all([
        axios.get(`${API_BASE}/transport/haulier/${haulierId}/dashboard`),
        axios.get(`${API_BASE}/transport/haulier/${haulierId}/available-jobs?limit=10`),
        axios.get(`${API_BASE}/transport/hauliers/${haulierId}/quotes`),
        axios.get(`${API_BASE}/transport/haulier/${haulierId}/activity`),
        axios.get(`${API_BASE}/transport/haulier/${haulierId}/performance`).catch(e => ({data: {ok: false}})),
        axios.get(`${API_BASE}/transport/haulier/${haulierId}/compliance-status`).catch(e => ({data: {ok: false}}))
      ]);

      if (overviewRes.data?.ok) {
        setDashboardData(overviewRes.data.data);
      }
      if (jobsRes.data?.ok) {
        setAvailableJobs(jobsRes.data.data || []);
      }
      if (quotesRes.data?.ok) {
        setMyQuotes(quotesRes.data.data || []);
      }
      if (activityRes.data?.ok) {
        setRecentActivity(activityRes.data.data || []);
      }
      if (performanceRes.data?.ok) {
        setPerformanceData(performanceRes.data.data);
      }
      if (complianceRes.data?.ok) {
        setComplianceStatus(complianceRes.data.data);
      }
      
      setError("");
    } catch (e) {
      console.error('Dashboard fetch error:', e);
      setError("Failed to load dashboard data from server");
      
      // Fallback mock data for development
      setDashboardData({
        totalQuotes: 156,
        activeQuotes: 8,
        wonJobs: 42,
        winRate: 26.9,
        totalEarnings: 45680.75,
        customerRating: 4.7,
        thisMonthJobs: 12,
        thisMonthEarnings: 8450.25,
        complianceStatus: "Complete",
        verificationStatus: "Yes",
        totalVehicles: 3,
        totalDrivers: 5
      });
      
      setAvailableJobs([
        {
          Transport_ID: 3,
          Title: "Yacht Transport - Fort Lauderdale to Jacksonville",
          Posted_Date: "2025-09-23T08:00:00Z",
          Collection_Address: "Fort Lauderdale, FL",
          Delivery_Address: "Jacksonville, FL",
          Deadline_Date: "2025-09-28T18:00:00Z",
          Distance: "350 miles",
          Estimated_Value: 1500,
          Quote_Count: 3,
          Category: "Boat Transport"
        },
        {
          Transport_ID: 4,
          Title: "Engine Transport - Cross State",
          Posted_Date: "2025-09-23T12:30:00Z",
          Collection_Address: "Orlando, FL",
          Delivery_Address: "Pensacola, FL",
          Deadline_Date: "2025-09-26T16:00:00Z",
          Distance: "420 miles",
          Estimated_Value: 800,
          Quote_Count: 1,
          Category: "Engine Transport"
        }
      ]);
      
      setMyQuotes([
        {
          Quote_ID: 1,
          Transport_ID: 1,
          Job_Title: "Boat Transport - Miami to Orlando",
          Quote_Value: 950,
          Quote_Status: "Active",
          Quote_Date: "2025-09-21T14:00:00Z",
          Competition_Count: 5,
          My_Rank: 2
        },
        {
          Quote_ID: 2,
          Transport_ID: 5,
          Job_Title: "Trailer Transport - Local Move",
          Quote_Value: 1200,
          Quote_Status: "Won",
          Quote_Date: "2025-09-20T09:30:00Z",
          Competition_Count: 4,
          My_Rank: 1
        }
      ]);
      
      setRecentActivity([
        {
          id: 1,
          type: "quote_won",
          message: "Your quote was accepted for Boat Transport job",
          timestamp: "2025-09-23T11:30:00Z",
          job_title: "Boat Transport - Miami to Orlando"
        },
        {
          id: 2,
          type: "new_job_available",
          message: "New job matching your criteria is available",
          timestamp: "2025-09-23T08:15:00Z",
          job_title: "Yacht Transport - Fort Lauderdale"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [haulierId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Navigation and interaction handlers
  const handleBrowseJobs = () => {
    navigate('/search/transport');
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/detail/transport/${jobId}`);
  };

  const handleViewProfile = () => {
    navigate(`/haulier/profile/${haulierId}`);
  };

  const handleBidOnJob = (job) => {
    setSelectedJob(job);
    setShowBiddingModal(true);
    setQuoteValue("");
    setQuoteNotes("");
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!quoteValue || !selectedJob) return;
    
    try {
      setSubmittingQuote(true);
      const response = await axios.post(`${API_BASE}/transport/quotes`, {
        Transport_ID: selectedJob.Transport_ID,
        Haulier_ID: haulierId,
        Quote_Value: quoteValue,
        Quote_Description: quoteNotes
      });
      
      if (response.data?.ok) {
        alert("Quote submitted successfully!");
        setShowBiddingModal(false);
        fetchDashboardData(); // Refresh data
      } else {
        alert(response.data?.message || "Failed to submit quote");
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert(error?.response?.data?.message || "Failed to submit quote");
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Stat card click handlers
  const handleStatCardClick = (type) => {
    switch (type) {
      case 'active_quotes':
        setShowAllQuotes(true);
        break;
      case 'win_rate':
        setShowPerformance(true);
        break;
      case 'rating':
        setShowPerformance(true);
        break;
      case 'earnings':
        setShowPerformance(true);
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
      case 'quote_won': return '🏆';
      case 'quote_submitted': return '💬';
      case 'new_job_available': return '🔔';
      case 'job_completed': return '✅';
      default: return '📋';
    }
  };

  const getQuoteStatusColor = (status) => {
    switch (status) {
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankBadge = (rank, total) => {
    if (rank === 1) return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">🏆 #1</span>;
    if (rank <= 3) return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">#{rank}</span>;
    return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">#{rank} of {total}</span>;
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

  // Enhanced Job Card with bidding functionality
  const JobCard = ({ job, showBidButton = false }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{job.Title}</h4>
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
              {job.Category}
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">📍</span>
              {job.Collection_Address} → {job.Delivery_Address}
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">📏</span>
              {job.Distance} • Est. {formatCurrency(job.Estimated_Value)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Posted {getTimeAgo(job.Posted_Date)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full">
            {job.Quote_Count} Competing
          </span>
          <span className="text-sm text-gray-600">
            Deadline: {formatDate(job.Deadline_Date)}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleViewJobDetails(job.Transport_ID)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </button>
          {showBidButton && (
            <button 
              onClick={() => handleBidOnJob(job)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Submit Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Quote Card Component
  const QuoteCard = ({ quote }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{quote.Job_Title}</h4>
          <div className="text-sm text-gray-600">
            Your Quote: {formatCurrency(quote.Quote_Value)}
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQuoteStatusColor(quote.Quote_Status)}`}>
            {quote.Quote_Status}
          </span>
          {quote.My_Rank && getRankBadge(quote.My_Rank, quote.Competition_Count)}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Rank #{quote.My_Rank} of {quote.Competition_Count}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{getTimeAgo(quote.Quote_Date)}</span>
        </div>
        <button 
          onClick={() => handleViewJobDetails(quote.Transport_ID)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View Job →
        </button>
      </div>
    </div>
  );

  // Modal Components
  const AllJobsModal = () => (
    showAllJobs && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Available Transport Jobs</h2>
            <button 
              onClick={() => setShowAllJobs(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <JobCard key={job.Transport_ID} job={job} showBidButton={true} />
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
              onClick={handleBrowseJobs}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Browse More Jobs
            </button>
          </div>
        </div>
      </div>
    )
  );

  const AllQuotesModal = () => (
    showAllQuotes && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">My Quotes & Bids</h2>
            <button 
              onClick={() => setShowAllQuotes(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {myQuotes.map((quote) => (
                <QuoteCard key={quote.Quote_ID} quote={quote} />
              ))}
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button 
              onClick={() => setShowAllQuotes(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  const PerformanceModal = () => (
    showPerformance && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Performance Analytics</h2>
            <button 
              onClick={() => setShowPerformance(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {dashboardData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.totalQuotes}</div>
                  <div className="text-sm text-gray-600">Total Quotes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.wonJobs}</div>
                  <div className="text-sm text-gray-600">Jobs Won</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{dashboardData.winRate}%</div>
                  <div className="text-sm text-gray-600">Win Rate</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{dashboardData.customerRating}/5</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Performance Insights</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Average quote value:</span>
                  <span className="font-medium">{formatCurrency((dashboardData?.totalEarnings || 0) / (dashboardData?.wonJobs || 1))}</span>
                </div>
                <div className="flex justify-between">
                  <span>This month earnings:</span>
                  <span className="font-medium">{formatCurrency(dashboardData?.thisMonthEarnings || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active quotes:</span>
                  <span className="font-medium">{dashboardData?.activeQuotes || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button 
              onClick={() => setShowPerformance(false)}
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

  const BiddingModal = () => (
    showBiddingModal && selectedJob && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Submit Quote</h2>
            <button 
              onClick={() => setShowBiddingModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmitQuote} className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{selectedJob.Title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{selectedJob.Collection_Address} → {selectedJob.Delivery_Address}</div>
                <div>Distance: {selectedJob.Distance} • Estimated Value: {formatCurrency(selectedJob.Estimated_Value)}</div>
                <div>Current Competition: {selectedJob.Quote_Count} other quotes</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Quote Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your competitive quote"
                value={quoteValue}
                onChange={(e) => setQuoteValue(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Details & Services
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your services (insurance coverage, tracking, timeline, special equipment, etc.)"
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowBiddingModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingQuote}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {submittingQuote ? "Submitting..." : "Submit Quote"}
              </button>
            </div>
          </form>
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
          <h1 className="text-3xl font-bold text-gray-900">Haulier Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your jobs, quotes, and performance</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBrowseJobs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <span className="mr-2">🔍</span>
            Browse Jobs
          </button>
          <button 
            onClick={handleViewProfile}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            My Profile
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Overview - Clickable */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Quotes"
            value={dashboardData.activeQuotes}
            subtitle="Click to manage"
            icon="💬"
            color="blue"
            onClick={true}
            type="active_quotes"
          />
          <StatCard
            title="Win Rate"
            value={`${dashboardData.winRate}%`}
            subtitle={`${dashboardData.wonJobs} jobs won`}
            icon="🏆"
            color="green"
            onClick={true}
            type="win_rate"
          />
          <StatCard
            title="Customer Rating"
            value={`${dashboardData.customerRating}/5`}
            subtitle="Click for details"
            icon="⭐"
            color="yellow"
            onClick={true}
            type="rating"
          />
          <StatCard
            title="Total Earnings"
            value={formatCurrency(dashboardData.totalEarnings)}
            subtitle="Click for analytics"
            icon="💰"
            color="purple"
            onClick={true}
            type="earnings"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Jobs Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Jobs</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{availableJobs.length} matching your criteria</span>
                <button 
                  onClick={() => setShowAllJobs(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            
            {availableJobs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No available jobs</div>
                <div className="text-gray-500 text-sm">Check back later for new opportunities</div>
                <button 
                  onClick={handleBrowseJobs}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Browse More Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.slice(0, 3).map((job) => (
                  <JobCard key={job.Transport_ID} job={job} showBidButton={true} />
                ))}
                {availableJobs.length > 3 && (
                  <button 
                    onClick={() => setShowAllJobs(true)}
                    className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View {availableJobs.length - 3} More Jobs →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* My Quotes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Recent Quotes</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{myQuotes.length} quotes</span>
                <button 
                  onClick={() => setShowAllQuotes(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            
            {myQuotes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No quotes submitted</div>
                <div className="text-gray-500 text-sm">Start bidding on available jobs</div>
                <button 
                  onClick={() => setShowAllJobs(true)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Browse Jobs to Bid
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myQuotes.slice(0, 3).map((quote) => (
                  <QuoteCard key={quote.Quote_ID} quote={quote} />
                ))}
                {myQuotes.length > 3 && (
                  <button 
                    onClick={() => setShowAllQuotes(true)}
                    className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View {myQuotes.length - 3} More Quotes →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          {dashboardData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
                <button 
                  onClick={() => setShowPerformance(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold text-green-600">{dashboardData.thisMonthJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Earnings</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(dashboardData.thisMonthEarnings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Compliance</span>
                  <span className="font-semibold text-green-600">{dashboardData.complianceStatus}</span>
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
                  onClick={() => setShowActivity(true)}
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
                onClick={() => setShowAllJobs(true)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">🔍</span>
                Browse Available Jobs
              </button>
              <button 
                onClick={() => setShowAllQuotes(true)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">💬</span>
                View My Quotes
              </button>
              <button 
                onClick={() => setShowPerformance(true)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">📊</span>
                Performance Analytics
              </button>
              <button 
                onClick={handleViewProfile}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left flex items-center"
              >
                <span className="mr-3">⚙️</span>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AllJobsModal />
      <AllQuotesModal />
      <PerformanceModal />
      <ActivityModal />
      <BiddingModal />
    </div>
  );
}
