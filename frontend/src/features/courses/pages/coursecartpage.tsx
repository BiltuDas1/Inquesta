import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { GET_CART_ITEMS } from "../../auth/context/cartcontext";
import { useEffect } from "react";
import { useAuth } from "../../auth/context/authcontext";

// --- TypeScript Interfaces ---

interface CartItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  slug: string;
  icon: string;
  price: number;
}

interface RemoveFromCartData {
  removeCourseFromCart: {
    success: boolean;
    message: string;
  };
}

interface GetCartItemsResponse {
  getCartItems: {
    data: CartItem[];
  };
}

// --- GraphQL Mutations ---

const REMOVE_COURSE_FROM_CART = gql`
  mutation removeCourseFromCart($courseId: String!) {
    removeCourseFromCart(courseId: $courseId) {
      success
      message
    }
  }
`;

// --- Main Component ---

export default function CourseCartPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Please login to view your cart.");
        navigate("/login");
      } else if (user.role !== "student" && user.role !== "user") {
        toast.error("Access denied. Only students can access the cart.");
        navigate("/");
      }
    }
  }, [user, authLoading, navigate]);

  // 1. Fetch Cart Items using the shared query from Context
  const { data, loading, error } = useQuery<GetCartItemsResponse>(
    GET_CART_ITEMS,
    {
      fetchPolicy: "cache-first", // Prioritize the cache to keep the UI instant
    },
  );

  // 2. Initialize the Remove Mutation
  const [removeCourse] = useMutation<RemoveFromCartData>(
    REMOVE_COURSE_FROM_CART,
    {
      // Automatically refresh the cache (and navbar count!) after a successful delete
      refetchQueries: [{ query: GET_CART_ITEMS }],
    },
  );

  const cartItems = data?.getCartItems?.data || [];

  // 3. Calculations
  const totalPrice = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0,
  );

  const totalOriginalPrice = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * 1.2, // Assuming a 20% mock discount for original price
    0,
  );

  const discountPercentage =
    totalOriginalPrice > 0
      ? Math.round(
          ((totalOriginalPrice - totalPrice) / totalOriginalPrice) * 100,
        )
      : 0;

  // 4. Enhanced Remove Handler
  const handleRemove = async (courseId: string) => {
    try {
      const { data } = await removeCourse({
        variables: { courseId },
      });

      if (data?.removeCourseFromCart?.success) {
        toast.success("Course removed successfully!");
      } else {
        toast.error(data?.removeCourseFromCart?.message || "Failed to remove");
      }
    } catch (err) {
      console.error("Error executing remove mutation:", err);
      toast.error("Network error while removing course");
    }
  };

  // 5. Format currency helper
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] flex items-center justify-center">
        <p className="text-[#6fffd9] font-headline text-xl flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-[24px]">
            sync
          </span>
          Loading cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] flex items-center justify-center flex-col gap-4">
        <span className="material-symbols-outlined text-[48px] text-[#ffb4ab]">
          error
        </span>
        <p className="text-[#ffb4ab]">
          Failed to load cart items. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#dfe2eb] mb-8 font-headline">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* --- Left Column: Cart Items --- */}
          <div className="flex-1 w-full">
            <h2 className="text-sm font-bold mb-4 text-[#dfe2eb] border-b border-[#3b4a44] pb-4">
              {cartItems.length} Course{cartItems.length !== 1 ? "s" : ""} in
              Cart
            </h2>

            <div className="flex flex-col">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="relative flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group hover:bg-[#181c22] rounded-lg px-2 sm:-mx-2 transition-colors"
                >
                  {/* Course Image */}
                  <div className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-24 md:w-56 md:h-36 overflow-hidden rounded z-0">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>,
                      ) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.background = "#1c2026";
                        e.currentTarget.src =
                          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                      }}
                    />
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
                      <Link
                        to={`/course/${item.slug}`}
                        className="outline-none"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#31353c] text-[#dfe2eb] uppercase tracking-wider">
                        {item.level}
                      </span>
                    </div>

                    {/* Mobile Price & Actions */}
                    <div className="mt-auto pt-3 md:hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-[#dfe2eb]">
                          {formatINR(item.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-[#6fffd9]">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="hover:text-[#5cebc5] transition-colors relative z-20 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            delete
                          </span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Price & Actions */}
                  <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-28 lg:w-32">
                    <div className="text-lg font-bold text-[#dfe2eb] flex items-center justify-end gap-1.5">
                      {formatINR(item.price)}
                      <span className="material-symbols-outlined text-[18px] text-[#6fffd9]">
                        sell
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2 mt-4 text-sm text-[#6fffd9] font-medium">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="hover:text-[#5cebc5] transition-colors relative z-20 flex items-center gap-1.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty Cart State */}
              {cartItems.length === 0 && (
                <div className="py-16 text-center flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[64px] text-[#3b4a44] mb-4">
                    shopping_cart_off
                  </span>
                  <p className="text-[#84948e] mb-6 text-lg">
                    Your cart is empty. Keep shopping to find a course!
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block bg-[#1c2026] text-[#dfe2eb] border border-[#3b4a44] px-8 py-3 rounded-lg font-bold hover:border-[#6fffd9] hover:text-[#10141a] hover:bg-[#6fffd9] transition-all duration-200"
                  >
                    Keep Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* --- Right Column: Checkout Summary --- */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-[#1c2026] border border-[#3b4a44] p-6 rounded-xl sticky top-24 shadow-2xl">
              <h2 className="text-[#84948e] font-bold mb-2 uppercase tracking-wider text-sm">
                Total:
              </h2>

              <div className="text-4xl font-bold text-[#dfe2eb] font-headline tracking-tight mb-2">
                {formatINR(totalPrice)}
              </div>

              {discountPercentage > 0 && (
                <div className="flex items-center gap-2 mb-6 text-[#84948e] text-sm">
                  <span className="line-through">
                    {formatINR(totalOriginalPrice)}
                  </span>
                  <span className="text-[#6fffd9] font-semibold bg-[#6fffd9]/10 px-2 py-0.5 rounded">
                    {discountPercentage}% off
                  </span>
                </div>
              )}

              <button
                disabled={cartItems.length === 0}
                className="w-full bg-[#6fffd9] text-[#10141a] font-bold py-4 rounded-lg text-base hover:bg-[#5cebc5] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(111,255,217,0.15)] disabled:opacity-50 disabled:cursor-not-allowed mb-4 relative z-20 group"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <p className="text-xs text-[#84948e] text-center flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  lock
                </span>
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
