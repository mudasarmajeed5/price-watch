import productsDataRaw from "@/lib/products-data";

export type Product = {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  dropAmount?: number;
  dropPercent?: number;
  store?: string;
  status?: string;
  addedAt?: string;
  image: string;
};

type ProductsData = {
  products: Product[];
  collections: Record<string, string[]>;
};

const productsData: ProductsData = productsDataRaw;

type CollectionKey = keyof typeof productsData.collections;

const productsById = new Map<string, Product>(
  productsData.products.map((product) => [product.id, product]),
);

export const getProductById = (id: string) => productsById.get(id);

export const getCollection = (key: CollectionKey) =>
  productsData.collections[key]
    .map((id) => productsById.get(id))
    .filter((item): item is Product => Boolean(item));

export default productsData;
