import WarriorProducts from "@/components/products/warrior-products";
export const dynamic = "force-dynamic";


export const metadata = {
  title: "Warrior Products | WarriorSol",
  description:
    "Explore our exclusive Warrior Products collection at WarriorSol. Support families in need with every purchase.",
};
export default function ProductsPage() {
  return <WarriorProducts />;
}
