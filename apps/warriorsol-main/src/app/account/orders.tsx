"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import Link from "next/link";

type LineItem = {
  id: string;
  title: string;
  productId: string;
  image: string;
  quantity: number;
  price: number;
  review?: {
    id: string;
    score: number;
    text: string;
  } | null;
};

type Order = {
  id: string;
  shopifyOrderId: string;
  date: string;
  total: number;
  lineItems: LineItem[];
  financialStatus: string;
  fulfillmentStatus: string;
  cancelledAt: string | null;
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [editingReview, setEditingReview] = useState<null | {
    id: string;
    score: number;
    text: string;
  }>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  // Refetch flag for modal
  const [shouldRefetchOrders, setShouldRefetchOrders] = useState(false);

  useEffect(() => {
    if (!session?.user?.token) return;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );

        const json = await res.json();
        setOrders(json.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.user?.token]);

  // Refetch orders after review modal closes and refetch is requested
  useEffect(() => {
    if (!reviewModalOpen && shouldRefetchOrders) {
      // Refetch orders
      (async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${session?.user.token}`,
              },
            }
          );
          const json = await res.json();
          setOrders(json.data || []);
        } catch (err) {
          console.error("Error refetching orders after review:", err);
        } finally {
          setLoading(false);
          setShouldRefetchOrders(false);
        }
      })();
    }
  }, [reviewModalOpen, shouldRefetchOrders, session?.user?.token]);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fulfillmentColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "fulfilled":
        return "bg-green-100 text-green-700";
      case "unfulfilled":
        return "bg-yellow-100 text-yellow-700";
      case "request_declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openReviewModal = (
    productId: string,
    review?: { id: string; score: number; text: string } | null
  ) => {
    setSelectedProductId(productId);
    if (review) {
      setEditingReview(review);
      setRating(review.score);
      setComment(review.text);
    } else {
      setEditingReview(null);
      setRating(0);
      setComment("");
    }
    setReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!selectedProductId || rating < 1 || !comment.trim()) {
      toast.dismiss();
      toast.error("Please provide both rating and comment.");
      return;
    }
    setReviewLoading(true);
    try {
      let res;
      if (editingReview) {
        // Update review
        res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({
            productId: extractNumericId(selectedProductId),
            rating,
            comment,
          }),
        });
      } else {
        // Create review
        res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({
            productId: extractNumericId(selectedProductId),
            rating,
            comment,
          }),
        });
      }
      const json = await res.json();
      if (res.ok) {
        toast.success(
          editingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        setReviewModalOpen(false);
        setShouldRefetchOrders(true);
      } else {
        toast.error(
          json.message ||
            (editingReview
              ? "Failed to update review"
              : "Failed to submit review")
        );
      }
    } catch (err) {
      console.error(
        editingReview ? "Error updating review:" : "Error submitting review:",
        err
      );
      toast.error("Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  const extractNumericId = (id: string): string => {
    const match = id.match(/\d+$/);
    return match ? match[0] : id;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {orders.map((order) => (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="border rounded-lg shadow-sm bg-white"
            >
              <AccordionTrigger className="cursor-pointer px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="text-left">
                  <p className="text-xl sm:text-2xl font-semibold text-[#1F1F1F]">
                    Order #{order.shopifyOrderId.slice(0, 8)}
                  </p>
                  <p className="text-base sm:text-lg text-gray-500">
                    {format(new Date(order.date), "PPP")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full font-medium",
                        statusColor(order.financialStatus)
                      )}
                    >
                      {order.financialStatus}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full font-medium",
                        fulfillmentColor(order.fulfillmentStatus)
                      )}
                    >
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-[#EE9254]">
                  ${order.total.toFixed(2)}
                </p>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 space-y-3">
                {order.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 items-center sm:items-start border rounded p-3 hover:shadow-md transition"
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <Link
                        href={`/products/${extractNumericId(item.productId)}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          openReviewModal(item.productId, item.review ?? null)
                        }
                      >
                        {item.review ? "Edit Review" : "Leave a Review"}
                      </Button>
                      {item.review && (
                        <div className="mt-1 text-sm text-gray-700">
                          <span className="text-yellow-500 mr-1">
                            {"★".repeat(item.review.score)}
                          </span>
                          <span>{item.review.text}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader className="flex justify-between items-center">
            <DialogClose className="absolute top-3 right-3" asChild>
              <button
                className="cursor-pointer text-gray-500 items-end justify-end hover:text-gray-700 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
            <DialogTitle>
              {editingReview ? "Edit Review" : "Leave a Review"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={cn(
                    "text-2xl cursor-pointer",
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  )}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button
              className="bg-[#EE9254] text-white hover:bg-[#EE9254]/80"
              onClick={submitReview}
              disabled={reviewLoading}
            >
              {reviewLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              {reviewLoading
                ? editingReview
                  ? "Updating..."
                  : "Submitting..."
                : editingReview
                  ? "Update"
                  : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
