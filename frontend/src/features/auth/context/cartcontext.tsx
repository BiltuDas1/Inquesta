import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import React, { createContext, useContext } from "react";

// 1. Export GET_CART_ITEMS so both the context and the page can share the exact same query cache
export const GET_CART_ITEMS = gql`
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

const ADD_COURSE_TO_CART = gql`
  mutation addCourseToCart($courseId: String!) {
    addCourseToCart(courseId: $courseId) {
      success
      message
    }
  }
`;

interface CartItem {
  id: string;
}

interface GetCartItemsResponse {
  getCartItems: {
    data: CartItem[];
  };
}

interface AddToCartResponse {
  addCourseToCart: {
    success: boolean;
    message: string;
  };
}

interface CartContextType {
  cartCount: number;
  loading: boolean;
  addToCart: (
    courseId: string,
  ) => Promise<{ success: boolean; message: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 2. Fetch the cart globally to drive the count
  const { data, loading } = useQuery<GetCartItemsResponse>(GET_CART_ITEMS, {
    fetchPolicy: "cache-and-network", // Keeps it fast but checks server for updates
  });

  // 3. Derive count directly from Apollo's cached data! (No useState needed)
  const cartCount = data?.getCartItems?.data?.length || 0;

  // 4. Add refetchQueries so adding an item updates the GET_CART_ITEMS data
  const [addCourseToCartMutation] = useMutation<AddToCartResponse>(
    ADD_COURSE_TO_CART,
    {
      refetchQueries: [{ query: GET_CART_ITEMS }],
    },
  );

  const addToCart = async (courseId: string) => {
    try {
      const { data: mutationData } = await addCourseToCartMutation({
        variables: { courseId },
      });

      const result = mutationData?.addCourseToCart;

      if (result?.success) {
        // We no longer need setCartCount() here. The refetchQueries above
        // will automatically fetch the new list and update the cartCount variable!
        return { success: true, message: result.message };
      }

      return {
        success: false,
        message: result?.message || "Failed to add to cart",
      };
    } catch (error) {
      console.error("Cart error:", error);
      return { success: false, message: "Network error adding to cart" };
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, loading, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
