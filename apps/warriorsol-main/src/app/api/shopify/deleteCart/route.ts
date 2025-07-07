import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json(
        { error: "No cart ID found in cookies" },
        { status: 404 }
      );
    }

    // Remove the cartId cookie (Shopify doesn't support full cart deletion, just clear reference)
    cookieStore.set("cartId", "", {
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ message: "Cart deleted (cookie cleared)" });
  } catch (error) {
    console.error("Error deleting cart cookie:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}
