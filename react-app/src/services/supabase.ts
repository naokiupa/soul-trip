import { supabase } from '../lib/supabase';
import type { WishlistItemDB } from '../types';

export class WishlistService {
  // Get all wishlist items
  static async getWishlistItems(): Promise<WishlistItemDB[]> {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .order('owner', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching wishlist items:', error);
      throw error;
    }

    return data || [];
  }

  // Get wishlist items by owner
  static async getWishlistItemsByOwner(owner: 'なおき' | 'まひろ' | '共通'): Promise<WishlistItemDB[]> {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('owner', owner)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching wishlist items by owner:', error);
      throw error;
    }

    return data || [];
  }

  // Toggle wishlist item checked status
  static async toggleWishlistItem(id: number): Promise<WishlistItemDB | null> {
    // First get the current item
    const { data: currentItem, error: fetchError } = await supabase
      .from('wishlist')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current item:', fetchError);
      throw fetchError;
    }

    // Toggle the is_checked status
    const { data, error } = await supabase
      .from('wishlist')
      .update({ is_checked: !currentItem.is_checked })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating wishlist item:', error);
      throw error;
    }

    return data;
  }

  // Add new wishlist item
  static async addWishlistItem(
    text: string, 
    owner: 'なおき' | 'まひろ' | '共通'
  ): Promise<WishlistItemDB | null> {
    // Get the max sort_order for the owner
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('wishlist')
      .select('sort_order')
      .eq('owner', owner)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) {
      console.error('Error getting max sort order:', maxOrderError);
      throw maxOrderError;
    }

    const nextSortOrder = (maxOrderData[0]?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        text,
        owner,
        sort_order: nextSortOrder,
        is_checked: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding wishlist item:', error);
      throw error;
    }

    return data;
  }

  // Delete wishlist item
  static async deleteWishlistItem(id: number): Promise<void> {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting wishlist item:', error);
      throw error;
    }
  }

  // Update wishlist item text
  static async updateWishlistItemText(id: number, text: string): Promise<WishlistItemDB | null> {
    const { data, error } = await supabase
      .from('wishlist')
      .update({ text })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating wishlist item text:', error);
      throw error;
    }

    return data;
  }

  // Update item order and owner (for drag & drop)
  static async updateItemPosition(
    id: number, 
    newOwner: 'なおき' | 'まひろ' | '共通', 
    newSortOrder: number
  ): Promise<WishlistItemDB | null> {
    const { data, error } = await supabase
      .from('wishlist')
      .update({ 
        owner: newOwner,
        sort_order: newSortOrder
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item position:', error);
      throw error;
    }

    return data;
  }

  // Reorder items within the same owner group
  static async reorderItems(items: { id: number; sort_order: number }[]): Promise<void> {
    const updates = items.map(item => 
      supabase
        .from('wishlist')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    
    for (const result of results) {
      if (result.error) {
        console.error('Error reordering items:', result.error);
        throw result.error;
      }
    }
  }
}