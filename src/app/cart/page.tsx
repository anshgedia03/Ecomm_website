"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { auth } from "@/lib/firebase/client"
import CartItem from "@/components/client/CartItem"
import { checkoutOrder } from "@/services/checkoutService"
import useHandleCart from "@/hooks/useHandleCart"
import useVerify from "@/hooks/useVerify"
import { getTokenFromLocalStorage, decodeToken, isTokenExpired } from "@/utils/tokenUtils"
import { MESSAGES, ROUTES } from "@/constants/CONSTANTS"

export default function CartPage() {
  const router = useRouter()
  const { verifyOrRedirect } = useVerify()
  const {
    items,
    loading: cartLoading,
    handleIncrease,
    handleDecrease,
    handleRemove,
  } = useHandleCart()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getTokenFromLocalStorage()

      if (!token || isTokenExpired(token) || !decodeToken(token)) {
        setIsAuthenticated(false)
        setCheckingAuth(false)
        return
      }

      // Wait for Firebase auth to initialize
      const authReady = await new Promise<boolean>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe()
          resolve(!!user)
        })
      })

      setIsAuthenticated(authReady)
      setCheckingAuth(false)
    }

    checkAuth()
  }, [])

  const handleCheckout = async () => {
    const verified = verifyOrRedirect({
      noTokenMessage: MESSAGES.CHECKOUT.AUTH_REQUIRED,
    })
    if (!verified) {
      return
    }

    try {
      await checkoutOrder(items)
      toast.success(MESSAGES.CHECKOUT.SUCCESS)
      // The listener will automatically handle any cart changes if checkout removes items,
      // though usually checkout just places an order.
    } catch (error: any) {
      toast.error(error.message || MESSAGES.CHECKOUT.FAILED)
    }
  }

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
              Review the products you added to your cart.
            </p>
          </div>
          <p className="inline-flex w-fit rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>

        {checkingAuth ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-gray-600 shadow-sm sm:p-8 sm:text-base">
            Checking authentication...
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
              Login Required
            </h2>
            <p className="mb-5 text-sm text-gray-600 sm:mb-6 sm:text-base">
              {MESSAGES.AUTH.REQUIRED}
            </p>
            <button
              onClick={() => router.push(ROUTES.LOGIN)}
              className="rounded-lg bg-black px-5 py-2 text-sm text-white transition hover:bg-gray-800 sm:px-6 sm:text-base"
            >
              Login to Continue
            </button>
          </div>
        ) : cartLoading ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-gray-600 shadow-sm sm:p-8 sm:text-base">
            Loading cart...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-gray-500 shadow-sm sm:p-8 sm:text-base">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="h-fit rounded-2xl border bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                Order Summary
              </h2>

              <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="mb-5 flex items-center justify-between text-base font-semibold text-gray-900 sm:mb-6">
                <span>Total Price</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:py-2.5"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
