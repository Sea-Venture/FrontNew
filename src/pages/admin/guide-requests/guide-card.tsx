import { useState } from "react";
import { CheckCircle, XCircle, FileText, Phone, CreditCard, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { approveGuideRequest, rejectGuideRequest, type GuideRequest } from "@/services/guideService";

interface GuideCardProps {
  request: GuideRequest;
  onRequestUpdated: () => void;
}

export default function GuideCard({ request, onRequestUpdated }: GuideCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken } = useAuthStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleApprove = async () => {
    if (!accessToken) {
      alert("No access token available. Please log in again.");
      return;
    }

    if (!confirm("Are you sure you want to approve this guide request?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await approveGuideRequest(request.id);
      alert("Guide request approved successfully!");
      onRequestUpdated();
    } catch (error) {
      console.error("Failed to approve request:", error);
      alert(`Failed to approve request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!accessToken) {
      alert("No access token available. Please log in again.");
      return;
    }

    if (!confirm("Are you sure you want to reject this guide request?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await rejectGuideRequest(request.id);
      alert("Guide request rejected.");
      onRequestUpdated();
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert(`Failed to reject request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-blue-200/50 bg-white/80 backdrop-blur-lg overflow-hidden ghibli-card">
      <CardHeader className="bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-sky-400/20 border-b border-blue-200/50 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold ghibli-text-gradient mb-2">
              Guide Request #{request.id}
            </h3>
            <p className="text-xs sm:text-sm text-blue-600 flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{formatDate(request.createdAt)}</span>
            </p>
          </div>
          <Badge 
            variant={request.approved ? "default" : "secondary"}
            className={`flex-shrink-0 text-xs sm:text-sm ${request.approved ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            {request.approved ? "✓ Approved" : "⏳ Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-start gap-3">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">NIC</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800 break-all">{request.NIC}</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-blue-200 to-transparent"></div>

        <div className="flex items-start gap-3">
          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Phone</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800">{request.phone}</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-cyan-200 to-transparent"></div>

        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Registration</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800 break-all">{request.registrationNumber}</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-sky-200 to-transparent"></div>

        <div className="flex items-start gap-3">
          <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Licence Document</p>
            <a 
              href={request.licenceDocumentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-blue-500 hover:text-blue-700 hover:underline font-medium transition-colors duration-200 break-all"
            >
              View Document →
            </a>
          </div>
        </div>
      </CardContent>

      {!request.approved && (
        <CardFooter className="bg-gradient-to-r from-blue-50/50 via-cyan-50/50 to-sky-50/50 border-t border-blue-200/50 p-3 sm:p-4 flex gap-2 sm:gap-3">
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Approve</span>
                <span className="sm:hidden">Yes</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1 bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Reject</span>
                <span className="sm:hidden">No</span>
              </>
            )}
          </Button>
        </CardFooter>
      )}

      {request.approved && (
        <CardFooter className="bg-gradient-to-r from-green-50/50 via-emerald-50/50 to-teal-50/50 border-t border-green-200/50 p-3 sm:p-4">
          <div className="w-full text-center">
            <p className="text-sm sm:text-base text-green-600 font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Approved on {formatDate(request.updatedAt)}
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}