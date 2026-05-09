import { supabase } from "@/lib/supabase";

export interface Product {
  id?: string;
  user_id?: string;
  name: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  created_at?: string;
}

export const productService = {
  /**
   * Fetch all products belonging to the authenticated user.
   * RLS policies in Supabase will automatically filter data by user_id.
   */
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  /**
   * Add a new product to the inventory.
   */
  async addProduct(product: Omit<Product, "id" | "user_id" | "created_at">) {
    // Get current user to satisfy the 'user_id' requirement in your schema
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("products")
      .insert([{ ...product, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  /**
   * Delete a product by its ID.
   */
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Dashboard Summary Logic
   * Fetches minimal data to calculate totals and alerts.
   */
  async getDashboardSummary() {
    const { data: products, error } = await supabase
      .from("products")
      .select("stock, low_stock_threshold");

    if (error) throw error;

    if (!products) {
      return { totalProducts: 0, totalStock: 0, lowStockItems: 0 };
    }

    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const lowStockItems = products.filter(
      (p) => (p.stock ?? 0) <= (p.low_stock_threshold ?? 0)
    ).length;

    return { totalProducts, totalStock, lowStockItems };
  }
};