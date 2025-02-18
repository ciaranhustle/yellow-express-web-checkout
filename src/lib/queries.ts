// import { API_URL } from "@/lib/secrets";

// export const getProducts = async (slug: string, category: ProductCategory) => {
//   "use server";
//   const res = await fetch(
//     `${API_URL}/v1/product?site=${slug}&category=${category}`
//   );

//   if (!res.ok) {
//     console.log("Failed to get products", slug, category);
//     return [];
//   }

//   const { products }: { products: Product[] } = await res.json();

//   return products;
// };
