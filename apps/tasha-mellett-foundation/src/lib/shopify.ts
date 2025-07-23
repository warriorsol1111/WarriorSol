import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export function getShopifyClient() {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
  const storeFrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!storeDomain || !storeFrontAccessToken) {
    throw new Error("Missing required Shopify environment variables");
  }

  const cleanDomain = storeDomain.replace(/^https?:\/\//, "");

  return createStorefrontApiClient({
    storeDomain: cleanDomain,
    apiVersion: "2025-04",
    publicAccessToken: storeFrontAccessToken,
  });
}

export const fetchShopify = async (query: string, variables = {}) => {
  try {
    const client = getShopifyClient();

    const response = await client.request(query, { variables });

    return response.data;
  } catch (error) {
    console.error("Error details:", error);

    throw error;
  }
};
