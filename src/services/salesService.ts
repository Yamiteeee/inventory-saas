import { supabase } from "@/lib/supabase";

export interface Sale {
  id?: string;
  product_id: string;
  quantity: number;
  total_price: number;
  created_at?: string;
}

export const salesService = {
  /**
   * Record a new sale and update inventory stock
   */
  async recordSale(sale: Omit<Sale, "id" | "created_at">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 1. Insert the sale record
    const { data, error: saleError } = await supabase
      .from("sales")
      .insert([{ ...sale, user_id: user.id }])
      .select()
      .single();

    if (saleError) throw saleError;

    // 2. Update the product stock (Subtract the sold quantity)
    // In a real pro app, you'd use a RPC/Database Function, 
    // but for now, we'll do a simple update:
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", sale.product_id)
      .single();

    if (product) {
      await supabase
        .from("products")
        .update({ stock: product.stock - sale.quantity })
        .eq("id", sale.product_id);
    }

    return data;
  },

  async getSalesHistory() {
    const { data, error } = await supabase
      .from("sales")
      .select(`
        *,
        products ( name )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
};