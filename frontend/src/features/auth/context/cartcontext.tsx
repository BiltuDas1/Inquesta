import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import React, { createContext, useContext, useState } from "react";

// GraphQL mutation
const ADD_COURSE_TO_CART = gql`
  mutation addCourseToCart ($courseId: String!) {
    addCourseToCart(courseId: $courseId) {
      success
      message
    }
  }
`;

interface AddToCartResponse {
  addCourseToCart: {
    success: boolean;
    message: string;
  };
}

interface CartContextType {
  cartCount: number;
  addToCart: (courseId: string) => Promise<{ success: boolean; message: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Initialize the mutation hook
  const [addCourseToCartMutation] = useMutation<AddToCartResponse>(ADD_COURSE_TO_CART);

  const addToCart = async (courseId: string) => {
    try {
      // 3. Execute the mutation using Apollo
      const { data } = await addCourseToCartMutation({
        variables: { courseId },
      });

      const result = data?.addCourseToCart;

      if (result?.success) {
        // Increment global navbar counter immediately on success
        setCartCount((prev) => prev + 1);
        return { success: true, message: result.message };
      }

      return { success: false, message: result?.message || "Failed to add to cart" };
    } catch (error) {
      console.error("Cart error:", error);
      return { success: false, message: "Network error adding to cart" };
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};