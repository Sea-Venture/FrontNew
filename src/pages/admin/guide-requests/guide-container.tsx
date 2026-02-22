import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAllGuideRequests, type GuideRequest } from "@/services/guideService";
import GuideCard from "./guide-card";

export default function GuideContainer() {
  const [requests, setRequests] = useState<GuideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const fetchGuideRequests = async () => {
    if (!accessToken) {
      setError("No access token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAllGuideRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch guide requests");
      console.error("Failed to fetch guide requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuideRequests();
  }, [accessToken]);

  const handleRequestUpdated = () => {
    // Refresh the list after approval/rejection
    fetchGuideRequests();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading guide requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading guide requests</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
          <p className="font-medium">No guide requests found</p>
          <p className="text-sm mt-1">There are currently no pending guide applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Guide Requests</h2>
        <p className="text-gray-600">Review and manage guide applications</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <GuideCard 
            key={request.id} 
            request={request} 
            onRequestUpdated={handleRequestUpdated}
          />
        ))}
      </div>
    </div>
  );
}