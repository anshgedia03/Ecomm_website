import ProductCard from "@/components/client/ProductCard"
import { getAdminDb } from "@/lib/firebase/admin"
import type { Product } from "@/types"

export const dynamic = "force-dynamic"

async function getProducts() {
  try {
    const adminDb = getAdminDb()
    const snapshot = await adminDb.collection("products").get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()
  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              All Products
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
              Explore all available products.
            </p>
          </div>
          <p className="inline-flex w-fit rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-gray-500 shadow-sm sm:p-8 sm:text-base">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
