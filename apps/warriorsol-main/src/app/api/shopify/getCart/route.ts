import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../../../auth";
const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                }
                product {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface ShopifyCartLineNode {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      price: { amount: string; currencyCode: string };
      selectedOptions?: { name: string; value: string }[];
      image?: { url: string };
      product: { title: string };
    };
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;
    const session = await getServerSession(authConfig);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    let setCartIdCookie = false;
    let newCartId = "";
    // Step 1: Try fetching from your backend
    if (!cartId) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session.user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const backendData = data;
        const fullCartId = backendData?.data?.cartID;
        if (fullCartId?.includes("/Cart/")) {
          const backendCartId = fullCartId;
          const cookieCartId = cartId;

          // If cookieCartId exists but doesn't match backendCartId, override it
          if (!cookieCartId || cookieCartId !== backendCartId) {
            cartId = backendCartId;
            newCartId = backendCartId.split("/Cart/")[1]; // for cookie saving
            setCartIdCookie = true;
          }
        }
      }
    }

    // Still no cart? Bail.
    if (!cartId) {
      return NextResponse.json(
        { error: "No cart ID found in backend or cookies" },
        { status: 404 }
      );
    }

    // Fetch from Shopify
    const data = await fetchShopify(GET_CART_QUERY, { cartId });
    if (!data.cart) {
      console.warn("Cart is expired or invalid, creating a new one...");

      // Create new cart
      const CREATE_CART_MUTATION = `
        mutation CreateCart {
          cartCreate {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              message
            }
          }
        }
      `;

      const newCartData = await fetchShopify(CREATE_CART_MUTATION, {});
      const newCart = newCartData?.cartCreate?.cart;

      if (!newCart) {
        return NextResponse.json(
          { error: "Failed to create new cart" },
          { status: 500 }
        );
      }

      // Save new cart ID
      const newId = newCart.id.split("/Cart/")[1];
      const newCartId = `gid://shopify/Cart/${newId}`;
      const response = NextResponse.json({
        cart: {
          id: newCart.id.split("?")[0],
          checkoutUrl: newCart.checkoutUrl,
          items: [],
        },
      });

      response.cookies.set("cartId", newCartId, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    const items = (data.cart.lines.edges as ShopifyCartLineNode[]).map(
      ({ node }) => {
        const variant = node.merchandise;
        let color = "";
        let size = "";
        for (const opt of variant.selectedOptions || []) {
          if (opt.name.toLowerCase() === "color") color = opt.value;
          if (opt.name.toLowerCase() === "size") size = opt.value;
        }

        return {
          id: variant.id,
          name: variant.product.title,
          quantity: node.quantity,
          price: parseFloat(variant.price.amount),
          color,
          size,
          image: variant.image?.url || "",
          lineId: node.id,
        };
      }
    );

    const cleanCartId = data.cart.id.split("?")[0];

    const response = NextResponse.json({
      cart: {
        id: cleanCartId, // ✅ sanitized ID for safe mutation use
        checkoutUrl: data.cart.checkoutUrl,
        items,
      },
    });

    if (setCartIdCookie && newCartId) {
      response.cookies.set("cartId", `gid://shopify/Cart/${newCartId}`, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
