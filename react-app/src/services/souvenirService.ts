import { supabase } from '../lib/supabase';
import type { SouvenirItemDB } from '../types';

export class SouvenirService {
  // Get all souvenir items
  static async getSouvenirItems(): Promise<SouvenirItemDB[]> {
    const { data, error } = await supabase
      .from('souvenirs')
      .select('*')
      .order('owner', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching souvenir items:', error);
      throw error;
    }

    return data || [];
  }

  // Get souvenir items by owner
  static async getSouvenirItemsByOwner(owner: 'なおき' | 'まひろ'): Promise<SouvenirItemDB[]> {
    const { data, error } = await supabase
      .from('souvenirs')
      .select('*')
      .eq('owner', owner)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching souvenir items by owner:', error);
      throw error;
    }

    return data || [];
  }

  // Toggle souvenir item checked status
  static async toggleSouvenirItem(id: number): Promise<SouvenirItemDB | null> {
    // First get the current item
    const { data: currentItem, error: fetchError } = await supabase
      .from('souvenirs')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current souvenir item:', fetchError);
      throw fetchError;
    }

    // Toggle the is_checked status
    const { data, error } = await supabase
      .from('souvenirs')
      .update({ is_checked: !currentItem.is_checked })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating souvenir item:', error);
      throw error;
    }

    return data;
  }

  // Add new souvenir item
  static async addSouvenirItem(
    text: string, 
    owner: 'なおき' | 'まひろ'
  ): Promise<SouvenirItemDB | null> {
    // Get the max sort_order for the owner
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('souvenirs')
      .select('sort_order')
      .eq('owner', owner)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) {
      console.error('Error getting max sort order for souvenirs:', maxOrderError);
      throw maxOrderError;
    }

    const nextSortOrder = (maxOrderData[0]?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('souvenirs')
      .insert({
        text,
        owner,
        sort_order: nextSortOrder,
        is_checked: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding souvenir item:', error);
      throw error;
    }

    return data;
  }

  // Delete souvenir item
  static async deleteSouvenirItem(id: number): Promise<void> {
    const { error } = await supabase
      .from('souvenirs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting souvenir item:', error);
      throw error;
    }
  }

  // Update souvenir item text
  static async updateSouvenirItemText(id: number, text: string): Promise<SouvenirItemDB | null> {
    const { data, error } = await supabase
      .from('souvenirs')
      .update({ text })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating souvenir item text:', error);
      throw error;
    }

    return data;
  }

  // Update item order and owner (for drag & drop)
  static async updateSouvenirItemPosition(
    id: number, 
    newOwner: 'なおき' | 'まひろ', 
    newSortOrder: number
  ): Promise<SouvenirItemDB | null> {
    const { data, error } = await supabase
      .from('souvenirs')
      .update({ 
        owner: newOwner,
        sort_order: newSortOrder
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating souvenir item position:', error);
      throw error;
    }

    return data;
  }

  // Reorder items within the same owner group
  static async reorderSouvenirItems(items: { id: number; sort_order: number }[]): Promise<void> {
    const updates = items.map(item => 
      supabase
        .from('souvenirs')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    
    for (const result of results) {
      if (result.error) {
        console.error('Error reordering souvenir items:', result.error);
        throw result.error;
      }
    }
  }
}