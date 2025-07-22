"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Mail, Calendar, Loader2 } from "lucide-react";
import { Donation } from "@/components/donor-wall";
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  type SupportApplication = {
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
  };

  const [applications, setApplications] = useState<SupportApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (session?.user?.token) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/user-donations`,
            {
              headers: {
                authorization: `Bearer ${session.user.token}`,
              },
              cache: "no-store",
            }
          );
          const result = await res.json();
          setDonations(result.data || []);
        }
      } catch (e) {
        console.error("Error fetching donations or session:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  useEffect(() => {
    async function fetchApplications() {
      if (!session?.user?.token) return;
      setApplicationsLoading(true);
      setApplicationsError(false);
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
              (app: SupportApplication) => app.userId === session.user.id
            )
          );
        } else {
          setApplicationsError(true);
        }
      } catch {
        setApplicationsError(true);
      } finally {
        setApplicationsLoading(false);
      }
    }
    fetchApplications();
  }, [session]);

  const typeColors: Record<string, string> = {
    one_time: "bg-green-100 text-green-700",
    recurring: "bg-blue-100 text-blue-700",
    gift_card: "bg-purple-100 text-purple-700",
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 px-4 py-12 max-w-7xl mx-auto w-full">
          <Tabs defaultValue="donations" className="w-full">
            <TabsList className="mb-20 flex flex-wrap justify-center gap-3 rounded-full backdrop-blur p-1 shadow-inner">
              <TabsTrigger
                value="donations"
                className="rounded-full px-5 py-2 text-base sm:text-lg"
              >
                My Donations
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="rounded-full px-5 py-2 text-base sm:text-lg"
              >
                My Applications
              </TabsTrigger>
            </TabsList>

            {/* 💰 Donations Tab */}
            <TabsContent value="donations">
              <section>
                {loading ? (
                  <Card className="flex flex-col items-center justify-center text-gray-500 py-8">
                    <Loader2 className="animate-spin w-8 h-8 mb-2 text-indigo-500" />
                    <span className="font-medium text-lg">
                      Loading your good deeds...
                    </span>
                  </Card>
                ) : !session ? (
                  <Card className="text-center text-gray-600 p-6 text-lg">
                    Please log in to view your donations.
                  </Card>
                ) : donations.length === 0 ? (
                  <Card className="text-center text-gray-600 p-6">
                    <p className="text-2xl mb-1"> No donations yet</p>
                    <p className="text-sm">
                      Go spread some kindness, we believe in you!
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((donation) => (
                      <Card
                        key={donation.id}
                        className="p-5 sm:p-6 bg-white/80 backdrop-blur border shadow-sm rounded-3xl transition duration-200 hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="mb-4 space-y-1">
                          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            {donation.name}
                          </h3>
                          <p className="flex items-center text-base sm:text-xl text-gray-500">
                            <Mail className="w-4 h-4 mr-1" /> {donation.email}
                          </p>
                          <p className="flex items-center text-base sm:text-xl text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(donation.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col items-start mt-4">
                          <span className="text-xl sm:text-2xl font-bold text-orange-500">
                            ${(donation.amount / 100).toLocaleString()}
                          </span>
                          <span
                            className={clsx(
                              "text-sm sm:text-lg px-2 py-0.5 mt-1 rounded-full capitalize font-medium",
                              typeColors[donation.donationType] ||
                                "bg-gray-100 text-gray-700"
                            )}
                          >
                            {donation.donationType.replace("_", " ")}
                          </span>

                          {donation.stripeReceiptUrl && (
                            <Button
                              variant="link"
                              className="text-base sm:text-lg text-blue-600 mt-2 p-0 h-auto"
                              asChild
                            >
                              <a
                                href={donation.stripeReceiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                View Receipt
                              </a>
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>

            {/* 📄 Applications Tab */}
            <TabsContent value="applications">
              <section>
                {applicationsLoading ? (
                  <Card className="flex flex-col items-center justify-center text-gray-500 py-8">
                    <Loader2 className="animate-spin w-8 h-8 mb-2 text-indigo-500" />
                    <span className="font-medium text-lg">
                      Fetching applications...
                    </span>
                  </Card>
                ) : applicationsError ? (
                  <Card className="text-center text-red-600 p-6 text-lg">
                    Something went wrong. Please try again later.
                  </Card>
                ) : !session ? (
                  <Card className="text-center text-gray-600 p-6 text-lg">
                    Please log in to view your support applications.
                  </Card>
                ) : applications.length === 0 ? (
                  <Card className="text-center text-gray-600 p-6">
                    <p className="text-2xl mb-1">No applications yet</p>
                    <p className="text-sm">
                      Once you request support, your applications will appear
                      here.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                      <Card
                        key={app.id}
                        className="border bg-white/80 backdrop-blur p-5 sm:p-6 rounded-2xl shadow hover:shadow-lg transition"
                      >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                          {app.familyName} —{" "}
                          <span className="text-indigo-600">
                            {app.supportType}
                          </span>
                        </h3>
                        <p className="text-base sm:text-lg text-gray-600 mb-1">
                          <strong>Situation:</strong> {app.situation}
                        </p>
                        <p className="text-base sm:text-lg">
                          <strong>Requested:</strong>{" "}
                          <span className="text-rose-600 font-semibold">
                            ${app.requestedAmount}
                          </span>
                        </p>
                        <p className="text-sm sm:text-base text-gray-500">
                          Submitted: {new Date(app.createdAt).toLocaleString()}
                        </p>
                        <p className="text-base sm:text-lg mt-1">
                          <strong>Status:</strong>{" "}
                          <span
                            className={clsx(
                              "font-medium",
                              app.status === "approved"
                                ? "text-green-600"
                                : app.status === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            )}
                          >
                            {app.status}
                          </span>
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
}
