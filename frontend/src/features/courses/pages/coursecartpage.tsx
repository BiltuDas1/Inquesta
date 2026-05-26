// import { useState } from "react";
// import { Link } from "react-router";

// // --- Mock Data ---
// const initialCartItems = [
//   {
//     id: 1,
//     title: "Spring Boot 4, Spring 7 & Hibernate for Beginners",
//     level: "All Levels",
//     price: 469.00,
//     originalPrice: 4229.00,
//     isPremium: true,
//     image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop",
//   },
//   {
//     id: 2,
//     title: "Java Masterclass 2025: 130+ Hours of Expert Lessons",
//     level: "All Levels",
//     price: 399.00,
//     originalPrice: 3549.00,
//     isPremium: true,
//     image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&auto=format&fit=crop",
//   },
//   {
//     id: 3,
//     title: "Java Tutorial for Complete Beginners",
//     level: "Beginner",
//     price: 399.00,
//     originalPrice: 799.00,
//     isPremium: false,
//     image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=300&auto=format&fit=crop",
//   },
// ];

// export default function CourseCartPage() {
//   const [cartItems, setCartItems] = useState(initialCartItems);

//   // Calculations
//   const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
//   const totalOriginalPrice = cartItems.reduce((sum, item) => sum + item.originalPrice, 0);
//   const discountPercentage = totalOriginalPrice > 0
//     ? Math.round(((totalOriginalPrice - totalPrice) / totalOriginalPrice) * 100)
//     : 0;

//   const handleRemove = (id: number) => {
//     setCartItems(cartItems.filter((item) => item.id !== id));
//   };

//   // Format currency
//   const formatINR = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   return (
//     <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] pb-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {/* Header */}
//         <h1 className="text-3xl sm:text-4xl font-bold text-[#dfe2eb] mb-8 font-headline">
//           Shopping Cart
//         </h1>

//         <div className="flex flex-col lg:flex-row gap-10 items-start">

//           {/* --- Left Column: Cart Items --- */}
//           <div className="flex-1 w-full">
//             <h2 className="text-sm font-bold mb-4 text-[#dfe2eb] border-b border-[#3b4a44] pb-4">
//               {cartItems.length} Course{cartItems.length !== 1 ? "s" : ""} in Cart
//             </h2>

//             <div className="flex flex-col">
//               {cartItems.map((item) => (
//                 // Applied the CourseCard wrapper layout here
//                 <div
//                   key={item.id}
//                   className="relative flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group hover:bg-[#181c22] rounded-lg px-2 sm:-mx-2 transition-colors"
//                 >
//                   {/* Course Image */}
//                   <div className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-24 md:w-56 md:h-36 overflow-hidden rounded z-0">
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//                         e.currentTarget.onerror = null;
//                         e.currentTarget.style.background = "#1c2026";
//                         e.currentTarget.src =
//                           "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//                       }}
//                     />
//                   </div>

//                   {/* Course Info */}
//                   <div className="flex-1 min-w-0 flex flex-col">
//                     <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
//                       <Link
//                         to={`/course/${item.id}`}
//                         className="outline-none"
//                       >
//                         {item.title}
//                       </Link>
//                     </h3>

//                     {/* Tags (Level, Premium) */}
//                     <div className="flex flex-wrap items-center gap-2 mt-2">
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#31353c] text-[#dfe2eb] uppercase tracking-wider">
//                         {item.level}
//                       </span>
//                       {item.isPremium && (
//                          <div className="inline-flex items-center gap-1 bg-[#343d96]/20 text-[#bdc2ff] border border-[#343d96]/50 px-2 py-0.5 rounded text-[10px] font-bold">
//                            <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
//                            Premium
//                          </div>
//                       )}
//                     </div>

//                     {/* Mobile Price & Actions (Hidden on Desktop) */}
//                     <div className="mt-auto pt-3 md:hidden">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-sm font-bold text-[#dfe2eb]">{formatINR(item.price)}</span>

//                       </div>
//                       <div className="flex items-center gap-4 text-xs font-semibold text-[#6fffd9]">
//                         <button
//                           onClick={() => handleRemove(item.id)}
//                           className="hover:text-[#5cebc5] transition-colors relative z-20"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Desktop Price & Actions */}
//                   <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-28 lg:w-32">
//                     <div className="text-lg font-bold text-[#dfe2eb] flex items-center justify-end gap-1.5">
//                       {formatINR(item.price)}
//                       <span className="material-symbols-outlined text-[18px] text-[#6fffd9]">sell</span>
//                     </div>

//                     <div className="flex flex-col items-end gap-2 mt-4 text-sm text-[#6fffd9] font-medium">
//                       <button
//                         onClick={() => handleRemove(item.id)}
//                         className="hover:text-[#5cebc5] transition-colors relative z-20"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {cartItems.length === 0 && (
//                 <div className="py-12 text-center">
//                   <p className="text-[#84948e] mb-4">Your cart is empty. Keep shopping to find a course!</p>
//                   <Link to="/courses" className="inline-block bg-[#1c2026] text-[#dfe2eb] border border-[#3b4a44] px-6 py-2 rounded font-bold hover:border-[#6fffd9] transition-colors">
//                     Keep Shopping
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* --- Right Column: Checkout Summary --- */}
//           <div className="w-full lg:w-[340px] shrink-0">
//             <div className="bg-[#1c2026] border border-[#3b4a44] p-6 rounded-xl sticky top-24 shadow-2xl">
//               <h2 className="text-[#84948e] font-bold mb-2">Total:</h2>

//               <div className="text-4xl font-bold text-[#dfe2eb] font-headline tracking-tight mb-2">
//                 {formatINR(totalPrice)}
//               </div>

//               {discountPercentage > 0 && (
//                 <div className="flex items-center gap-3 mb-6">
//                   <span className="text-[#84948e] line-through text-base">
//                     {formatINR(totalOriginalPrice)}
//                   </span>
//                   <span className="text-[#6fffd9] font-bold text-base">
//                     {discountPercentage}% off
//                   </span>
//                 </div>
//               )}

//               <button
//                 disabled={cartItems.length === 0}
//                 className="w-full bg-[#6fffd9] text-[#10141a] font-bold py-3.5 rounded-lg text-base hover:bg-[#5cebc5] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(111,255,217,0.15)] disabled:opacity-50 disabled:cursor-not-allowed mb-2 relative z-20"
//               >
//                 Proceed to Checkout
//                 <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
//               </button>

//               <p className="text-xs text-[#84948e] text-center mb-6">
//                 You won't be charged yet
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { Link } from "react-router";

// 1. Updated Interface to include 'id'
interface CartItem {
  id: string; // <-- Added so we can reference it for deletion
  title: string;
  description: string;
  duration: string;
  level: string;
  slug: string;
  icon: string;
  price: number;
}

// 2. Added 'id' to the fetch query
const GET_CART_ITEMS = gql`
  query getCartItems {
    getCartItems {
      data {
        id
        title
        description
        duration
        level
        slug
        icon
        price
      }
    }
  }
`;

// 3. Define the Remove Mutation
const REMOVE_COURSE_FROM_CART = gql`
  mutation removeCourseFromCart($courseId: String!) {
    removeCourseFromCart(courseId: $courseId) {
      success
      message
    }
  }
`;
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

export default function CourseCartPage() {
  // Fetch Cart Items
  const { data, loading, error } = useQuery<GetCartItemsResponse>(
    GET_CART_ITEMS,
    {
      fetchPolicy: "network-only",
    },
  );

  // Initialize the Remove Mutation
  const [removeCourse] = useMutation<RemoveFromCartData>(
    REMOVE_COURSE_FROM_CART,
    {
      // This tells Apollo to automatically refresh the cart data after a successful delete!
      refetchQueries: [{ query: GET_CART_ITEMS }],
    },
  );

  const cartItems = data?.getCartItems?.data || [];

  // Calculations
  const totalPrice = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0,
  );
  const totalOriginalPrice = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * 1.2,
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
        console.log("Course removed successfully!");
      } else {
        toast.error("Failed to remove");
        console.error("Failed to remove:", data?.removeCourseFromCart?.message);
      }
    } catch (err) {
      console.error("Error executing remove mutation:", err);
    }
  };

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] flex items-center justify-center">
        <p className="text-[#6fffd9] font-headline text-xl">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] flex items-center justify-center">
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
          <div className="flex-1 w-full">
            <h2 className="text-sm font-bold mb-4 text-[#dfe2eb] border-b border-[#3b4a44] pb-4">
              {cartItems.length} Course{cartItems.length !== 1 ? "s" : ""} in
              Cart
            </h2>

            <div className="flex flex-col">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item.id} // Replaced index with unique database ID
                  className="relative flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group hover:bg-[#181c22] rounded-lg px-2 sm:-mx-2 transition-colors"
                >
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
                          onClick={() => handleRemove(item.id)} // Passing ID instead of slug
                          className="hover:text-[#5cebc5] transition-colors relative z-20"
                        >
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
                        onClick={() => handleRemove(item.id)} // Passing ID instead of slug
                        className="hover:text-[#5cebc5] transition-colors relative z-20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-[#84948e] mb-4">
                    Your cart is empty. Keep shopping to find a course!
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block bg-[#1c2026] text-[#dfe2eb] border border-[#3b4a44] px-6 py-2 rounded font-bold hover:border-[#6fffd9] transition-colors"
                  >
                    Keep Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-[#1c2026] border border-[#3b4a44] p-6 rounded-xl sticky top-24 shadow-2xl">
              <h2 className="text-[#84948e] font-bold mb-2">Total:</h2>

              <div className="text-4xl font-bold text-[#dfe2eb] font-headline tracking-tight mb-2">
                {formatINR(totalPrice)}
              </div>

              {discountPercentage > 0 && (
                <div className="flex items-center gap-3 mb-6"></div>
              )}

              <button
                disabled={cartItems.length === 0}
                className="w-full bg-[#6fffd9] text-[#10141a] font-bold py-3.5 rounded-lg text-base hover:bg-[#5cebc5] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(111,255,217,0.15)] disabled:opacity-50 disabled:cursor-not-allowed mb-2 relative z-20"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>

              <p className="text-xs text-[#84948e] text-center mb-6">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
