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

type LineItem = {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  total: number;
  lineItems: LineItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "ORD1051",
        date: "2025-07-01T12:00:00Z",
        total: 89.97,
        lineItems: [
          {
            id: "p1",
            title: "Waffle Knit Hoodie",
            image: "/products/hoodie.png",
            quantity: 1,
            price: 59.99,
          },
          {
            id: "p2",
            title: "Cotton Crew Socks",
            image: "/products/socks.png",
            quantity: 2,
            price: 14.99,
          },
        ],
      },
      {
        id: "ORD1052",
        date: "2025-07-12T15:30:00Z",
        total: 49.95,
        lineItems: [
          {
            id: "p3",
            title: "Graphic Tee",
            image: "/products/tshirt.png",
            quantity: 3,
            price: 16.65,
          },
        ],
      },
      {
        id: "ORD1053",
        date: "2025-07-20T09:00:00Z",
        total: 24.99,
        lineItems: [
          {
            id: "p4",
            title: "Leather Keychain",
            image: "/products/keychain.png",
            quantity: 1,
            price: 24.99,
          },
        ],
      },
      {
        id: "ORD1054",
        date: "2025-07-22T10:15:00Z",
        total: 109.98,
        lineItems: [
          {
            id: "p5",
            title: "Canvas Backpack",
            image: "/products/backpack.png",
            quantity: 2,
            price: 54.99,
          },
        ],
      },
      {
        id: "ORD1055",
        date: "2025-07-28T18:45:00Z",
        total: 74.97,
        lineItems: [
          {
            id: "p6",
            title: "Fleece Joggers",
            image: "/products/joggers.png",
            quantity: 3,
            price: 24.99,
          },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
    }, 1000);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {orders.map((order) => (
          <AccordionItem
            key={order.id}
            value={order.id}
            className="border rounded-lg shadow-sm bg-white"
          >
            <AccordionTrigger className="cursor-pointer px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-left">
                <p className="text-xl sm:text-2xl font-semibold text-[#1F1F1F]">
                  Order #{order.id}
                </p>
                <p className="text-base sm:text-lg text-gray-500">
                  {format(new Date(order.date), "PPP")}
                </p>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-[#EE9254]">
                ${order.total.toFixed(2)}
              </p>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-3">
              {order.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 items-center sm:items-start border rounded p-3"
                >
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
