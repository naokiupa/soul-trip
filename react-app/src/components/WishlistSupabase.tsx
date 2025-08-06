import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { WishlistService } from '../services/supabase';
import type { WishlistItemDB } from '../types';
import styles from '../App.module.css';

interface WishlistSupabaseProps {
  onError?: (error: string) => void;
}

// Draggable Item Component
const DraggableWishlistItem: React.FC<{
  item: WishlistItemDB;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ item, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(item.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`「${item.text}」を削除しますか？`)) {
      onDelete(item.id);
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${styles.wishlistItem} ${item.is_checked ? styles.completed : ''}`}
    >
      <div 
        className={`${styles.itemCheckbox} ${item.is_checked ? styles.checked : ''}`}
        onClick={handleToggleClick}
      ></div>
      <span style={{ flex: 1, cursor: 'pointer' }} onClick={handleToggleClick}>
        {item.text}
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginLeft: '10px'
      }}>
        <button
          onClick={handleDeleteClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#e74c3c',
            fontSize: '16px',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24px',
            minHeight: '24px'
          }}
          title="削除"
        >
          🗑️
        </button>
        <div 
          {...listeners}
          style={{
            cursor: 'grab',
            color: '#95a5a6',
            fontSize: '14px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="ドラッグして移動"
        >
          ⋮⋮
        </div>
      </div>
    </li>
  );
};

// Add Item Form Component
const AddItemForm: React.FC<{
  owner: 'なおき' | 'まひろ' | '共通';
  onAdd: (text: string, owner: 'なおき' | 'まひろ' | '共通') => void;
  onCancel: () => void;
}> = ({ owner, onAdd, onCancel }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), owner);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      margin: '10px 0', 
      padding: '10px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '6px',
      border: '2px dashed #bdc3c7'
    }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいやりたいことを入力..."
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          marginBottom: '8px'
        }}
        autoFocus
      />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          キャンセル
        </button>
        <button
          type="submit"
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#3498db',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          追加
        </button>
      </div>
    </form>
  );
};

// Droppable Section Component
const DroppableSection: React.FC<{
  owner: 'なおき' | 'まひろ' | '共通';
  items: WishlistItemDB[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: (text: string, owner: 'なおき' | 'まひろ' | '共通') => void;
  isOver?: boolean;
}> = ({ owner, items, onToggle, onDelete, onAdd, isOver }) => {
  const [isAddingItem, setIsAddingItem] = useState(false);

  const getBadgeClass = (owner: string) => {
    switch (owner) {
      case 'なおき':
        return styles.naokiBadge;
      case 'まひろ':
        return styles.mahiroBadge;
      case '共通':
        return styles.commonBadge;
      default:
        return '';
    }
  };


  const handleAdd = (text: string, owner: 'なおき' | 'まひろ' | '共通') => {
    onAdd(text, owner);
    setIsAddingItem(false);
  };

  return (
    <div 
      className={styles.wishlistSection}
      style={{
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
        border: isOver ? '2px dashed #2196f3' : 'none',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
      }}
    >
      <div className={styles.wishlistHeader}>
        <span className={`${styles.personBadge} ${getBadgeClass(owner)}`}>{owner}</span>
        {/* <span>{getDisplayText(owner)}</span> */}
        <button
          onClick={() => setIsAddingItem(true)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#3498db',
            fontSize: '18px',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="新しいアイテムを追加"
        >
          ➕
        </button>
      </div>
      
      {isAddingItem && (
        <AddItemForm 
          owner={owner}
          onAdd={handleAdd}
          onCancel={() => setIsAddingItem(false)}
        />
      )}
      
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <ul className={styles.wishlistItems}>
          {items.map((item) => (
            <DraggableWishlistItem 
              key={item.id} 
              item={item} 
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
};

export const WishlistSupabase: React.FC<WishlistSupabaseProps> = ({ onError }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<WishlistItemDB | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadWishlistItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await WishlistService.getWishlistItems();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist items:', error);
      if (onError) {
        onError('やりたいことリストの読み込みに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // Load data from Supabase
  useEffect(() => {
    loadWishlistItems();
  }, [loadWishlistItems]);

  const handleToggle = async (id: number) => {
    try {
      await WishlistService.toggleWishlistItem(id);
      // Update local state immediately for better UX
      setWishlistItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, is_checked: !item.is_checked } : item
        )
      );
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      if (onError) {
        onError('チェック状態の更新に失敗しました');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await WishlistService.deleteWishlistItem(id);
      // Update local state immediately for better UX
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      if (onError) {
        onError('アイテムの削除に失敗しました');
      }
    }
  };

  const handleAdd = async (text: string, owner: 'なおき' | 'まひろ' | '共通') => {
    try {
      const newItem = await WishlistService.addWishlistItem(text, owner);
      if (newItem) {
        // Add to local state immediately for better UX
        setWishlistItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      if (onError) {
        onError('アイテムの追加に失敗しました');
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const item = wishlistItems.find(item => item.id === event.active.id);
    setActiveItem(item || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = wishlistItems.find(item => item.id === active.id);
    if (!activeItem) return;

    // Check if we're dragging over a different owner section
    const overOwner = over.id as string;
    if (['なおき', 'まひろ', '共通'].includes(overOwner) && activeItem.owner !== overOwner) {
      // Move item to different owner section
      setWishlistItems(prev => {
        const newItems = [...prev];
        const activeIndex = newItems.findIndex(item => item.id === active.id);
        if (activeIndex === -1) return prev;

        const activeItem = newItems[activeIndex];
        const targetOwnerItems = newItems.filter(item => item.owner === overOwner);
        const newSortOrder = targetOwnerItems.length > 0 ? Math.max(...targetOwnerItems.map(item => item.sort_order)) + 1 : 1;

        newItems[activeIndex] = {
          ...activeItem,
          owner: overOwner as 'なおき' | 'まひろ' | '共通',
          sort_order: newSortOrder
        };

        return newItems;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || active.id === over.id) return;

    const activeItem = wishlistItems.find(item => item.id === active.id);
    if (!activeItem) return;

    try {
      // If dragging over an owner section (cross-owner move)
      if (['なおき', 'まひろ', '共通'].includes(over.id as string)) {
        const newOwner = over.id as 'なおき' | 'まひろ' | '共通';
        const targetOwnerItems = wishlistItems.filter(item => item.owner === newOwner && item.id !== active.id);
        const newSortOrder = targetOwnerItems.length > 0 ? Math.max(...targetOwnerItems.map(item => item.sort_order)) + 1 : 1;

        await WishlistService.updateItemPosition(activeItem.id, newOwner, newSortOrder);
      } else {
        // Same-owner reordering
        const overItem = wishlistItems.find(item => item.id === over.id);
        if (!overItem || activeItem.owner !== overItem.owner) return;

        const ownerItems = wishlistItems.filter(item => item.owner === activeItem.owner);
        const activeIndex = ownerItems.findIndex(item => item.id === active.id);
        const overIndex = ownerItems.findIndex(item => item.id === over.id);

        if (activeIndex !== overIndex) {
          const reorderedItems = arrayMove(ownerItems, activeIndex, overIndex);
          
          // Update sort_order for all affected items
          const updatePromises = reorderedItems.map((item, index) => ({
            id: item.id,
            sort_order: index + 1
          }));

          await WishlistService.reorderItems(updatePromises);
        }
      }

      // Reload data to sync with database
      await loadWishlistItems();
    } catch (error) {
      console.error('Error updating item position:', error);
      if (onError) {
        onError('項目の移動に失敗しました');
      }
      // Reload on error to reset state
      await loadWishlistItems();
    }
  };

  // Group items by owner
  const naokiItems = wishlistItems.filter(item => item.owner === 'なおき').sort((a, b) => a.sort_order - b.sort_order);
  const mahiroItems = wishlistItems.filter(item => item.owner === 'まひろ').sort((a, b) => a.sort_order - b.sort_order);
  const commonItems = wishlistItems.filter(item => item.owner === '共通').sort((a, b) => a.sort_order - b.sort_order);

  if (loading) {
    return (
      <div className={styles.wishlistContainer}>
        <h2>✨ やりたいことリスト ✨</h2>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistContainer}>
      <h2>✨ やりたいことリスト ✨</h2>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          id="なおき"
          style={{ minHeight: '50px' }}
        >
          <DroppableSection 
            owner="なおき" 
            items={naokiItems} 
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        </div>

        <div
          id="まひろ"
          style={{ minHeight: '50px' }}
        >
          <DroppableSection 
            owner="まひろ" 
            items={mahiroItems} 
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        </div>

        <div
          id="共通"
          style={{ minHeight: '50px' }}
        >
          <DroppableSection 
            owner="共通" 
            items={commonItems} 
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className={`${styles.wishlistItem} ${activeItem.is_checked ? styles.completed : ''}`} style={{ opacity: 0.8 }}>
              <div className={`${styles.itemCheckbox} ${activeItem.is_checked ? styles.checked : ''}`}></div>
              <span>{activeItem.text}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};