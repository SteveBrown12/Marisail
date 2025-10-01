import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components/Common_Utils";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function TransportDetail() {
  const { id } = useParams(); // Transport_ID
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // Quote form states
  const [haulierId, setHaulierId] = useState("");
  const [quoteValue, setQuoteValue] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [postingQuote, setPostingQuote] = useState(false);

  // Question form states
  const [haulierQId, setHaulierQId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [postingQuestion, setPostingQuestion] = useState(false);

  // Answer form states
  const [answerText, setAnswerText] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState({});

  // NEW: Review form state
  const [reviewData, setReviewData] = useState({
    haulierId: "",
    customerId: "",
    feedbackNotes: "",
    feedbackScore: "",
    rating: ""
  });

  // NEW: Loading states for reviews and job completion
  const [postingReview, setPostingReview] = useState(false);
  const [markingJobDone, setMarkingJobDone] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching details for transport ${id}`);
      
      const res = await axios.get(`${API_BASE}/search/transport/details/${id}`);
      
      if (!res.data?.ok || !res.data?.data) {
        setError("Details not available");
        setLoading(false);
        return;
      }
      const data = res.data.data;
      
      // Comprehensive job data compilation
      const jobCore = {
        Transport_ID: data.Job?.Transport_ID ?? id,
        Title: data.Job?.Title || data.Job?.Item_Title || "Transport Job",
        Description: data.Job?.Description || "",
        Category: data.Job?.Category || "",
        
        // Scheduling & Requirements
        Deadline_Date: data.Job?.Deadline_Date || "",
        Preferred_Date: data.Job?.Preferred_Date || "",
        Timescale: data.Job?.Timescale || "",
        Posted_Date: data.Job?.Posted_Date || "",
        
        // Location & Transport Details
        International: data.Job?.International || "",
        Ferry_Required: data.Job?.Ferry_Required || "",
        Return_Journey: data.Job?.Return_Journey || "",
        Collection_Delivery_Distance: data.Job?.Collection_Delivery_Distance || "",
        Round_Trip_Distance: data.Job?.Round_Trip_Distance || "",
        Departure_Destination: data.Job?.Departure_Destination || "",
        
        // Equipment & Handling
        Special_Handling: data.Job?.Special_Handling || "",
        Loading_Equipment: data.Job?.Loading_Equipment || "",
        Unloading_Equipment: data.Job?.Unloading_Equipment || "",
        Overweight_Permit: data.Job?.Overweight_Permit || "",
        Oversize_Permit: data.Job?.Oversize_Permit || "",
        
        // Classification & Status
        Freight_Class: data.Job?.Freight_Class || "",
        Number_Quotes: data.Job?.Number_Quotes || 0,
        Job_Done_Haulier: data.Job?.Job_Done_Haulier || "",
        Job_Done_Date_Haulier: data.Job?.Job_Done_Date_Haulier || "",
        Customer_ID: data.Job?.Customer_ID || "",
        
        // Contact Information
        Customer_Type: data.Transportation_Contacts?.Customer_Type || "",
        Customer_Name: data.Transportation_Contacts?.Customer_Name || "",
        Customer_Company_Name: data.Transportation_Contacts?.Customer_Company_Name || "",
        Collection_Contact: data.Transportation_Contacts?.Collection_Contact || "",
        Collection_Mobile: data.Transportation_Contacts?.Collection_Mobile || "",
        Collection_Address: data.Transportation_Contacts?.Collection_Address || "",
        Delivery_Contact: data.Transportation_Contacts?.Delivery_Contact || "",
        Delivery_Mobile: data.Transportation_Contacts?.Delivery_Mobile || "",
        Delivery_Address: data.Transportation_Contacts?.Delivery_Address || "",
        Emergency_Contacts: data.Transportation_Contacts?.Emergency_Contacts || "",
        Preferred_Communication: data.Transportation_Contacts?.Preferred_Communication || "",
        
        // Payment & Insurance
        Payment_Terms: data.Transportation_Payment?.Payment_Terms || "",
        Currency: data.Transportation_Payment?.Currency || "",
        Insurance_Coverage: data.Transportation_Payment?.Insurance_Coverage || "",
        Insurance_Policy: data.Transportation_Payment?.Insurance_Policy || "",
        Insurance_Provider: data.Transportation_Payment?.Insurance_Provider || "",
        Cancellation_Policy: data.Transportation_Payment?.Cancellation_Policy || "",
        Late_Fees: data.Transportation_Payment?.Late_Fees || "",
        Payment_Methods: data.Transportation_Payment?.Payment_Methods || "",
      };
      setJob(jobCore);

      const initialQuotes = Array.isArray(data.Transportation_Quotes_List) ? data.Transportation_Quotes_List : [];
      const initialQuestions = Array.isArray(data.Questions_List) ? data.Questions_List : [];
      
      setQuotes(initialQuotes);
      setQuestions(initialQuestions);

      // NEW: Load reviews only if job is completed
      if (jobCore.Job_Done_Haulier === "1" || jobCore.Job_Done_Haulier === 1) {
        await loadReviews();
      }

      // Fallback API calls if lists not included
      if (initialQuestions.length === 0) {
        await loadQuestions();
      }
      
      if (initialQuotes.length === 0) {
        try {
          const qRes = await axios.get(`${API_BASE}/transport/jobs/${id}/quotes`);
          if (qRes.data?.ok) setQuotes(qRes.data.data || []);
        } catch (err) {
          console.error('Failed to load quotes:', err);
        }
      }
      setError("");
    } catch (e) {
      console.error('Error fetching details:', e);
      setError("Failed to load details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // NEW: Load reviews for this job (only when job is done)
  const loadReviews = useCallback(async () => {
    if (!id) return;
    try {
      const reviewRes = await axios.get(`${API_BASE}/transport/jobs/${id}/reviews`);
      if (reviewRes.data?.ok) {
        setReviews(reviewRes.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    }
  }, [id]);

  // Separate loader for questions (reusable)
  const loadQuestions = useCallback(async () => {
    if (!id) return;
    
    try {
      console.log(`Loading questions for transport ${id}...`);
      const qn = await axios.get(`${API_BASE}/transport/jobs/${id}/questions`);
      console.log('Questions response:', qn.data);
      
      if (qn.data?.ok) {
        setQuestions(qn.data.data || []);
        console.log(`Loaded ${qn.data.data?.length || 0} questions`);
      } else {
        console.error('Questions API returned not ok:', qn.data);
        setQuestions([]);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
      setQuestions([]);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchDetails();
  }, [id, fetchDetails]);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!haulierId || !quoteValue) {
      alert("Enter Haulier ID and Quote Value");
      return;
    }
    try {
      setPostingQuote(true);
      const res = await axios.post(`${API_BASE}/transport/quotes`, {
        Transport_ID: id,
        Haulier_ID: haulierId,
        Quote_Value: quoteValue,
        Quote_Description: quoteNotes
      });
      if (res.data?.ok) {
        alert("Quote submitted successfully!");
        setHaulierId("");
        setQuoteValue("");
        setQuoteNotes("");
        
        // Refresh quotes list
        try {
          const qRes = await axios.get(`${API_BASE}/transport/jobs/${id}`);
          if (qRes.data?.ok) {
            const jobData = qRes.data.data;
            if (jobData.quotes) setQuotes(jobData.quotes);
          }
        } catch {
          fetchDetails();
        }
      } else {
        alert(res.data?.message || "Failed to submit quote");
      }
    } catch (e) {
      console.error('Quote submission error:', e);
      alert(e?.response?.data?.message || e.message || "Failed to submit quote");
    } finally {
      setPostingQuote(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    const _haulier = (haulierQId || "").trim();
    const _text = (questionText || "").trim();
    
    if (!_haulier || !_text) {
      alert("Please enter Haulier ID and a question.");
      return;
    }
    try {
      setPostingQuestion(true);
      console.log('Posting question:', { Transport_ID: id, Haulier_ID: _haulier, Question_Text: _text });
      
      const res = await axios.post(`${API_BASE}/transport/questions`, {
        Transport_ID: id,
        Haulier_ID: _haulier,
        Question_Text: _text
      });
      console.log('Question response:', res.data);
      if (res.data?.ok) {
        setQuestionText("");
        setHaulierQId("");
        await loadQuestions();
        alert("Question posted successfully!");
      } else {
        alert(res.data?.message || "Failed to post question");
      }
    } catch (err) {
      console.error('Question error:', err);
      const errorMsg = err?.response?.data?.message || err.message || "Failed to post question";
      alert(errorMsg);
    } finally {
      setPostingQuestion(false);
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    const answer = (answerText[questionId] || "").trim();
    
    if (!answer) {
      alert("Please enter an answer before submitting.");
      return;
    }
    try {
      setSubmittingAnswer(prev => ({ ...prev, [questionId]: true }));
      
      const res = await axios.patch(`${API_BASE}/transport/questions/${questionId}/answer`, {
        Customer_Answers: answer
      });
      if (res.data?.ok) {
        setAnswerText(prev => ({ ...prev, [questionId]: "" }));
        await loadQuestions();
        alert("Answer submitted successfully!");
      } else {
        alert(res.data?.message || "Failed to submit answer");
      }
    } catch (err) {
      console.error('Answer submission error:', err);
      alert(err?.response?.data?.message || err.message || "Failed to submit answer");
    } finally {
      setSubmittingAnswer(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // NEW: Submit review handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewData.haulierId || !reviewData.feedbackScore || !reviewData.rating) {
      alert('Please complete all required fields (Haulier ID, Feedback Score, Rating).');
      return;
    }
    
    try {
      setPostingReview(true);
      const res = await axios.post(`${API_BASE}/transport/reviews`, {
        Transport_ID: id,
        Haulier_ID: reviewData.haulierId,
        Customer_ID: reviewData.customerId || '1', // Default customer if not provided
        Customer_Feedback_Notes: reviewData.feedbackNotes,
        Customer_Feedback_Score: reviewData.feedbackScore,
        Rating: reviewData.rating
      });

      if (res.data?.ok) {
        alert('Review submitted successfully! Haulier score has been updated.');
        setReviewData({
          haulierId: "",
          customerId: "",
          feedbackNotes: "",
          feedbackScore: "",
          rating: ""
        });
        await loadReviews(); // Refresh reviews
        fetchDetails(); // Refresh all data
      } else {
        alert(res.data?.message || 'Failed to submit review');
      }
    } catch (e) {
      console.error('Review submission error:', e);
      alert(e?.response?.data?.message || e.message || 'Failed to submit review');
    } finally {
      setPostingReview(false);
    }
  };

  // NEW: Mark job as done handler
  const handleMarkJobDone = async () => {
    if (!job) return;
    
    const selectedHaulierId = reviewData.haulierId || quotes[0]?.Haulier_ID || "";
    if (!selectedHaulierId) {
      alert('Please specify a Haulier ID or submit a quote first to mark job as done.');
      return;
    }

    if (!confirm('Are you sure you want to mark this job as completed? This action cannot be undone.')) {
      return;
    }

    try {
      setMarkingJobDone(true);
      const res = await axios.patch(`${API_BASE}/transport/jobs/${id}/complete`, {
        haulierId: selectedHaulierId
      });

      if (res.data?.ok) {
        alert('Job marked as completed successfully with automatic timestamp!');
        fetchDetails(); // Refresh to show updated status and reviews section
      } else {
        alert(res.data?.message || 'Failed to mark job as complete');
      }
    } catch (e) {
      console.error('Job completion error:', e);
      alert(e?.response?.data?.message || e.message || 'Failed to mark job as complete');
    } finally {
      setMarkingJobDone(false);
    }
  };

  const handleAnswerTextChange = (questionId, text) => {
    setAnswerText(prev => ({ ...prev, [questionId]: text }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatBoolean = (value) => {
    if (value === "Yes" || value === "1" || value === 1) return "Yes";
    if (value === "No" || value === "0" || value === 0) return "No";
    return value || "Not specified";
  };

  // Format rating as stars
  const formatStars = (rating) => {
    const stars = "⭐".repeat(parseInt(rating) || 0);
    return stars || "No rating";
  };

  const QuoteCard = ({ quote, isLowest, isHighest, rank }) => (
    <div className={`p-4 rounded-lg border-2 ${
      isLowest ? 'border-green-400 bg-green-50' : 
      isHighest ? 'border-red-400 bg-red-50' : 
      'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">
              {quote.Haulier_Name || `Haulier #${quote.Haulier_ID}`}
            </h4>
            {quote.Verified === 'Yes' && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ✓ Verified
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            {quote.Haulier_Total_Customer_Score && (
              <span>⭐ {parseFloat(quote.Haulier_Total_Customer_Score).toFixed(1)}</span>
            )}
            {quote.Vehicle_Type && (
              <span>🚛 {quote.Vehicle_Type}</span>
            )}
            {quote.Real_Time_Tracking === 'Yes' && (
              <span>📍 GPS Tracking</span>
            )}
          </div>
          {quote.Quote_Description && (
            <div className="text-sm text-gray-700 bg-white p-2 rounded border">
              "{quote.Quote_Description}"
            </div>
          )}
        </div>
        
        <div className="text-right ml-4">
          <div className={`text-2xl font-bold ${
            isLowest ? 'text-green-600' : 
            isHighest ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            ${parseFloat(quote.Quote_Value || 0).toLocaleString()}
          </div>
          {rank && (
            <div className="text-xs text-gray-500">
              Rank #{rank} of {quotes.length}
            </div>
          )}
          <div className="text-sm text-gray-500 mt-1">
            {formatDate(quote.Quote_Date)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            {quote.Quote_Status || 'Active'}
          </span>
          {isLowest && quotes.length > 1 && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              🏆 Best Price
            </span>
          )}
          {isHighest && quotes.length > 1 && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              💰 Highest
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <Loader />;
  if (error || !job) return (
    <div className="container mx-auto px-4 py-8 text-red-600">
      {error || "Transport job not found"}
    </div>
  );

  // Sort quotes by value for ranking
  const sortedQuotes = [...quotes].sort((a, b) => 
    parseFloat(a.Quote_Value || 0) - parseFloat(b.Quote_Value || 0)
  );

  const isJobCompleted = job.Job_Done_Haulier === "1" || job.Job_Done_Haulier === 1;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Job Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {job.Category || "Transport"}
              </span>
              {job.International === "Yes" && (
                <span className="text-xs inline-block bg-amber-50 text-amber-700 px-2 py-1 rounded">
                  🌍 International
                </span>
              )}
              {job.Ferry_Required === "Yes" && (
                <span className="text-xs inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded">
                  🚢 Ferry Required
                </span>
              )}
              {isJobCompleted && (
                <span className="text-xs inline-block bg-green-50 text-green-700 px-2 py-1 rounded">
                  ✅ Completed
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.Title}</h1>
            <p className="text-gray-600 text-lg">{job.Description || "No description provided."}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 min-w-[300px]">
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2">📍</span>
              <span className="text-gray-600">From:</span>
              <strong className="ml-2">{job.Collection_Address || "Not specified"}</strong>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2">🎯</span>
              <span className="text-gray-600">To:</span>
              <strong className="ml-2">{job.Delivery_Address || "Not specified"}</strong>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2">📅</span>
              <span className="text-gray-600">Deadline:</span>
              <strong className="ml-2">{formatDate(job.Deadline_Date)}</strong>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2">💬</span>
              <span className="text-gray-600">Quotes:</span>
              <strong className="ml-2">{quotes.length}</strong>
            </div>
            {isJobCompleted && (
              <div className="flex items-center">
                <span className="w-5 h-5 mr-2">⭐</span>
                <span className="text-gray-600">Reviews:</span>
                <strong className="ml-2">{reviews.length}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Job Information</h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Transport ID:</span>
              <span className="font-medium">{job.Transport_ID}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Posted Date:</span>
              <span className="font-medium">{formatDate(job.Posted_Date)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Preferred Date:</span>
              <span className="font-medium">{formatDate(job.Preferred_Date)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Timescale:</span>
              <span className="font-medium">{job.Timescale || "Not specified"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Special Handling:</span>
              <span className="font-medium">{job.Special_Handling || "None"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Loading Equipment:</span>
              <span className="font-medium">{formatBoolean(job.Loading_Equipment)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Unloading Equipment:</span>
              <span className="font-medium">{formatBoolean(job.Unloading_Equipment)}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Customer Type:</span>
              <span className="font-medium">{job.Customer_Type || "Not specified"}</span>
            </div>
            {job.Customer_Name && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium">{job.Customer_Name}</span>
              </div>
            )}
            {job.Customer_Company_Name && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{job.Customer_Company_Name}</span>
              </div>
            )}
            {job.Collection_Contact && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Collection Contact:</span>
                <span className="font-medium">{job.Collection_Contact}</span>
              </div>
            )}
            {job.Delivery_Contact && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Delivery Contact:</span>
                <span className="font-medium">{job.Delivery_Contact}</span>
              </div>
            )}
            {job.Preferred_Communication && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Communication:</span>
                <span className="font-medium">{job.Preferred_Communication}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Quotes Section - KEPT AS REQUESTED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Quotes ({quotes.length})</h2>
            {quotes.length > 0 && (
              <div className="text-sm text-gray-600">
                Range: ${Math.min(...quotes.map(q => parseFloat(q.Quote_Value || 0))).toLocaleString()} - 
                ${Math.max(...quotes.map(q => parseFloat(q.Quote_Value || 0))).toLocaleString()}
              </div>
            )}
          </div>
          
          {quotes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No quotes submitted yet</div>
              <div className="text-gray-500 text-sm">Be the first to submit a competitive quote!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedQuotes.map((quote, index) => {
                const key = quote.Quote_ID || `${quote.Haulier_ID}-${quote.Transport_ID}-${index}`;
                return (
                  <QuoteCard 
                    key={key}
                    quote={quote}
                    isLowest={index === 0 && quotes.length > 1}
                    isHighest={index === quotes.length - 1 && quotes.length > 1}
                    rank={index + 1}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Quote Submission Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Your Quote</h2>
          <form onSubmit={handleSubmitQuote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Haulier ID *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Haulier ID"
                value={haulierId}
                onChange={(e) => setHaulierId(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Value ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your quote amount"
                value={quoteValue}
                onChange={(e) => setQuoteValue(e.target.value)}
                required
              />
              {quotes.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  Current best: ${Math.min(...quotes.map(q => parseFloat(q.Quote_Value || 0))).toLocaleString()}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Details
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your services (insurance coverage, tracking, timeline, special equipment, etc.)"
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={postingQuote || isJobCompleted}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-medium transition-colors"
            >
              {postingQuote ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : isJobCompleted ? (
                'Job Completed - Quotes Closed'
              ) : (
                'Submit Quote'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Questions & Answers Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Questions & Answers</h2>
          <span className="text-sm text-gray-500">{questions.length} questions</span>
        </div>
        
        {/* Ask Question Form - Only show if job is not completed */}
        {!isJobCompleted && (
          <form onSubmit={handleAskQuestion} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Haulier ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Haulier ID"
                  value={haulierQId}
                  onChange={(e) => setHaulierQId(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Question</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask a clear, specific question about this job..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={postingQuestion}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-md font-medium disabled:opacity-60 whitespace-nowrap"
                  >
                    {postingQuestion ? "Posting..." : "Ask Question"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No questions yet</div>
            <div className="text-gray-500 text-sm">Be the first to ask a question about this job!</div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, index) => {
              const key = q.Question_ID || `${q.Haulier_ID}-${q.Transport_ID}-${index}`;
              const hasAnswer = q.Answer_Text || q.Customer_Answers;
              
              return (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Question by</span>
                        <strong className="text-blue-600">
                          {q.Haulier_Name || `Haulier #${q.Haulier_ID}`}
                        </strong>
                      </div>
                      <div className="text-gray-900 font-medium text-lg mb-3">
                        {q.Question_Text || q.Transport_Provider_Questions || "No question text"}
                      </div>
                      
                      {hasAnswer ? (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-green-800">✅ Customer Answer:</span>
                            {q.Answer_Date && (
                              <span className="text-xs text-green-600">
                                {new Date(q.Answer_Date).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-900">{q.Answer_Text || q.Customer_Answers}</div>
                        </div>
                      ) : !isJobCompleted && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                          <div className="text-sm text-blue-800 font-medium mb-3">💬 Provide an answer:</div>
                          <div className="space-y-3">
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Type your answer here..."
                              value={answerText[q.Question_ID] || ""}
                              onChange={(e) => handleAnswerTextChange(q.Question_ID, e.target.value)}
                            />
                            <button
                              onClick={() => handleSubmitAnswer(q.Question_ID)}
                              disabled={submittingAnswer[q.Question_ID]}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
                            >
                              {submittingAnswer[q.Question_ID] ? "Submitting..." : "Submit Answer"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {q.Question_Date ? new Date(q.Question_Date).toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Job Completion Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Status</h2>
            <p className="text-gray-600">
              {isJobCompleted 
                ? `Job was completed on ${formatDate(job.Job_Done_Date_Haulier)}`
                : 'Mark this transport job as completed when work is finished'
              }
            </p>
          </div>
          <div className="text-right">
            {isJobCompleted ? (
              <div className="flex items-center justify-center px-6 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Job Completed
              </div>
            ) : (
              <button
                onClick={handleMarkJobDone}
                disabled={markingJobDone || !quotes.length}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                {markingJobDone ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Marking Complete...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark Job as Done
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        {!quotes.length && !isJobCompleted && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Note:</strong> At least one quote must be submitted before marking the job as complete.
            </p>
          </div>
        )}
      </div>

      {/* Reviews & Feedback Section - ONLY VISIBLE WHEN JOB IS COMPLETED */}
      {isJobCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reviews Display */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Reviews & Feedback ({reviews.length})</h2>
              {reviews.length > 0 && (
                <div className="text-sm text-gray-600">
                  Avg Rating: {reviews.length > 0 ? 
                    (reviews.reduce((sum, r) => sum + parseInt(r.Rating || 0), 0) / reviews.length).toFixed(1) 
                    : 'N/A'} ⭐
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No reviews submitted yet</div>
                <div className="text-gray-500 text-sm">Be the first to share your experience!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => {
                  const key = review.Review_ID || `review-${index}`;
                  return (
                    <div key={key} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">Customer Review</span>
                            <span className="text-sm text-gray-500">
                              for Haulier #{review.Haulier_ID}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-1">Rating:</span>
                              <span className="text-lg">{formatStars(review.Rating)}</span>
                              <span className="text-sm text-gray-500 ml-1">({review.Rating}/5)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-1">Score:</span>
                              <span className="font-medium text-blue-600">{review.Customer_Feedback_Score}/10</span>
                            </div>
                          </div>
                          {review.Customer_Feedback_Notes && (
                            <div className="text-gray-700 bg-white p-3 rounded border">
                              <span className="text-sm font-medium text-gray-900 block mb-1">Feedback:</span>
                              "{review.Customer_Feedback_Notes}"
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(review.Date)}
                          </div>
                          {review.Job_Done_Customer === '1' && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1 inline-block">
                              ✓ Customer Confirmed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Submit a Review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Haulier ID *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Haulier ID"
                  value={reviewData.haulierId}
                  onChange={(e) => setReviewData({...reviewData, haulierId: e.target.value})}
                  required
                />
                {quotes.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Available: {quotes.map(q => q.Haulier_ID).join(', ')}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Customer ID (optional)"
                  value={reviewData.customerId}
                  onChange={(e) => setReviewData({...reviewData, customerId: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating (1-5) *
                </label>
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent </option>
                  <option value="4">⭐⭐⭐⭐ Very Good </option>
                  <option value="3">⭐⭐⭐ Good </option>
                  <option value="2">⭐⭐ Fair </option>
                  <option value="1">⭐ Poor </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Score (1-10) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rate service quality 1-10"
                  value={reviewData.feedbackScore}
                  onChange={(e) => setReviewData({...reviewData, feedbackScore: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Share your experience with this transport service..."
                  value={reviewData.feedbackNotes}
                  onChange={(e) => setReviewData({...reviewData, feedbackNotes: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={postingReview}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-medium transition-colors"
              >
                {postingReview ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Review...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
