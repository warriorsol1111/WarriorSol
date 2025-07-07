import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";
import { cookies } from "next/headers";

const REMOVE_CART_ITEM_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
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
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function DELETE(request: NextRequest) {
  try {
    const { lineId } = await request.json();
    const cookiesStore = await cookies();
    const cartId = cookiesStore.get("cartId")?.value;

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: "Missing cartId or lineId" },
        { status: 400 }
      );
    }

    const variables = {
      cartId,
      lineIds: [lineId],
    };

    const data = await fetchShopify(REMOVE_CART_ITEM_MUTATION, variables);

    if (data.cartLinesRemove.userErrors.length > 0) {
      return NextResponse.json(
        { error: data.cartLinesRemove.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: data.cartLinesRemove.cart });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
