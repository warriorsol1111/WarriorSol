import Products from "@/components/products";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | WarriorSol",
  description:
    "Explore our collection of clothing, accessories, and more at WarriorSol. Support families in need with every purchase.",
};
export default function ProductsPage() {
  return <Products />;
}
