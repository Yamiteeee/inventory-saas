import { supabase } from "@/lib/supabase";

export interface Product {
  id?: string;
  user_id?: string;
  name: string;
  price: number;            // Re-sell value
  cost_price: number;       // Initial buy value
  stock: number;
  low_stock_threshold: number;
  currency_code: string;    // Store the item's base currency
  sku?: string;             // Item identifier
  created_at?: string;
}

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async getProductsByStatus(status: 'low' | 'all') {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    
    if (status === 'low') {
      return data?.filter(p => (p.stock ?? 0) <= (p.low_stock_threshold ?? 5)) || [];
    }
    return data || [];
  },

  async addProduct(product: Omit<Product, "id" | "user_id" | "created_at">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("products")
      .insert([{ 
        ...product, 
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async deleteMultipleProducts(ids: string[]) {
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (error) throw error;
  },

  async getDashboardSummary() {
    const { data: products, error } = await supabase
      .from("products")
      .select("price, cost_price, stock, low_stock_threshold");

    if (error) throw error;

    if (!products || products.length === 0) {
      return { 
        totalProducts: 0, 
        totalStock: 0, 
        lowStockItems: 0,
        potentialRevenue: 0,
        potentialProfit: 0 
      };
    }

    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const lowStockItems = products.filter(
      (p) => (p.stock ?? 0) <= (p.low_stock_threshold ?? 0)
    ).length;

    // Financial calculations remain as numbers; 
    // formatting happens only at the Component level via Context
    const potentialRevenue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const totalCostValue = products.reduce((acc, p) => acc + (p.cost_price * p.stock), 0);
    const potentialProfit = potentialRevenue - totalCostValue;

    return { 
      totalProducts, 
      totalStock, 
      lowStockItems, 
      potentialRevenue, 
      potentialProfit 
    };
  }
};