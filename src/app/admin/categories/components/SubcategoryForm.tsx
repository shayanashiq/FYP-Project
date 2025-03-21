'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
}

interface SubcategoryFormProps {
  subcategory: Subcategory | null;
  category: Category | null;
  categories: Category[];
  onSave: (data: { name: string; description?: string; categoryId?: string }) => void;
  onCancel: () => void;
}

export default function SubcategoryForm({ 
  subcategory, 
  category,
  categories, 
  onSave, 
  onCancel 
}: SubcategoryFormProps) {
  const [name, setName] = useState(subcategory?.name || '');
  const [description, setDescription] = useState(subcategory?.description || '');
  const [categoryId, setCategoryId] = useState(subcategory?.categoryId || category?.id || '');
  const [errors, setErrors] = useState<{ name?: string; categoryId?: string }>({});
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Update categoryId if category is provided and no subcategory exists
    if (category && !subcategory) {
      setCategoryId(category.id);
    }
  }, [category, subcategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors: { name?: string; categoryId?: string } = {};
    if (!name.trim()) {
      validationErrors.name = 'Subcategory name is required';
    }
    if (!categoryId) {
      validationErrors.categoryId = 'Parent category is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit the form
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      categoryId
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {subcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium text-sm">Subcategory Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subcategory name"
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="block font-medium text-sm">Parent Category</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="" disabled>Select a parent category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm">{errors.categoryId}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium text-sm">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter subcategory description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {subcategory ? 'Update Subcategory' : 'Create Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}