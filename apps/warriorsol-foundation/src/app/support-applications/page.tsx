"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface SupportApplication {
  id: number;
  userId: string;
  familyName: string;
  contactEmail: string;
  contactPhone?: string;
  familySize: number;
  supportType: string;
  requestedAmount: number;
  situation: string;
  status: string;
  createdAt: string;
}

const AdminSupportApplicationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<SupportApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{
    id: number | null;
    type: "accept" | "reject" | null;
  }>({ id: null, type: null });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchApplications = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/apply-for-support`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );

        const data = await res.json();
        if (data.status === "success") {
          setApplications(
            data.data.filter(
              (app: SupportApplication) => app.status === "pending"
            )
          );
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session]);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    setActionLoading({ id, type: action });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/apply-for-support/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        toast.success(
          action === "accept"
            ? "Application approved successfully!"
            : "Application rejected successfully!"
        );
      } else {
        toast.error(
          action === "accept"
            ? "Failed to approve application"
            : "Failed to reject application"
        );
      }
    } catch {
      toast.error("Action failed. Try again later.");
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  return (
    <>
      <Navbar />

      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-10 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-12 text-[#EE9254] text-left">
            Review Support Applications
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <span className="animate-spin h-12 w-12 border-4 border-[#EE9254] border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <p className="text-center text-lg text-red-500">
              Failed to load applications. Please try again later.
            </p>
          ) : applications.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p className="text-2xl font-medium">
                No applications to review yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header with name and support type badge */}
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                      {app.familyName}
                    </h2>
                    <span className="bg-[#FFE4CC] text-[#B8732D] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      {app.supportType}
                    </span>
                  </div>

                  {/* Situation */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Situation:
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {app.situation}
                    </p>
                  </div>

                  {/* Amount and Family Size */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Amount:
                      </p>
                      <p className="text-lg font-bold text-[#EE9254]">
                        ${app.requestedAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Family Size:
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {app.familySize}
                      </p>
                    </div>
                  </div>

                  {/* Submission Date */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Submitted:{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6 space-y-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm">
                      <span className="mr-2">📧</span>
                      <span className="font-medium text-gray-700 mr-2">
                        Email:
                      </span>
                      <span className="text-gray-600 break-all">
                        {app.contactEmail}
                      </span>
                    </div>
                    {app.contactPhone && (
                      <div className="flex items-center text-sm">
                        <span className="mr-2">📞</span>
                        <span className="font-medium text-gray-700 mr-2">
                          Phone:
                        </span>
                        <span className="text-gray-600">
                          {app.contactPhone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      className="bg-[#EE9254] hover:bg-[#D67E43] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 flex-1"
                      onClick={() => handleAction(app.id, "accept")}
                      disabled={
                        actionLoading.id === app.id &&
                        actionLoading.type === "accept"
                      }
                    >
                      {actionLoading.id === app.id &&
                      actionLoading.type === "accept" ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Approving...
                        </>
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 flex-1"
                      onClick={() => handleAction(app.id, "reject")}
                      disabled={
                        actionLoading.id === app.id &&
                        actionLoading.type === "reject"
                      }
                    >
                      {actionLoading.id === app.id &&
                      actionLoading.type === "reject" ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Rejecting...
                        </>
                      ) : (
                        "Reject"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AdminSupportApplicationsPage;
