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

export default function SettingsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

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

  const typeColors: Record<string, string> = {
    one_time: "bg-green-100 text-green-700",
    recurring: "bg-blue-100 text-blue-700",
    gift_card: "bg-purple-100 text-purple-700",
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text mb-8">
            My Donations
          </h2>

          {loading ? (
            <Card className="p-6 shadow-2xl rounded-3xl bg-white/90 backdrop-blur flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="animate-spin w-8 h-8 mb-2 text-indigo-500" />
              <span className="font-medium text-lg">Loading</span>
            </Card>
          ) : !session ? (
            <Card className="p-6 text-center text-gray-600 text-lg">
              Please log in to view your donations.
            </Card>
          ) : donations.length === 0 ? (
            <Card className="p-6 text-center text-gray-600">
              <p className="text-2xl mb-2">💤 No donations yet</p>
              <p className="text-sm">
                When you spread some love, it&apos;ll show up right here.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <Card
                  key={donation.id}
                  className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-3xl transition hover:shadow-2xl"
                >
                  <div className="mb-4">
                    <p className="text-3xl font-semibold text-gray-900">
                      {donation.name}
                    </p>
                    <div className="flex items-center text-xl text-gray-600 gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {donation.email}
                    </div>
                    <div className="flex items-center text-lg text-gray-400 mt-1 gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(donation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-orange-500">
                      ${(donation.amount / 100).toLocaleString()}
                    </span>
                    <span
                      className={clsx(
                        "text-lg  py-0.5 mt-1 rounded-full capitalize font-medium",
                        typeColors[donation.donationType] ||
                          "bg-gray-100 text-gray-700"
                      )}
                    >
                      {donation.donationType.replace("_", " ")}
                    </span>
                    {donation.stripeReceiptUrl && (
                      <Button
                        variant="link"
                        className="text-xs text-blue-600 mt-2 flex items-center  p-0 h-auto"
                        asChild
                      >
                        <a
                          href={donation.stripeReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Receipt className="w-4 h-4" />
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
      </div>
      <Footer />
    </>
  );
}
