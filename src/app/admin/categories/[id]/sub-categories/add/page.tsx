'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash, ChevronRight } from 'lucide-react';
import CategoryForm from '../../../components/CategoryForm';
import SubcategoryForm from '../../../components/SubcategoryForm';
import DeleteConfirmDialog from '../../../components/DeleteConfirmDialog';

// Type definitions based on your Prisma schema
interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Selected item states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [deleteType, setDeleteType] = useState<'category' | 'subcategory'>('category');
  
  // Expanded categories (for mobile view)
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
      setError('');
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Category operations
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setDeleteType('category');
    setShowDeleteDialog(true);
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      // Refresh categories list
      await fetchCategories();
      setShowDeleteDialog(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Subcategory operations
  const handleAddSubcategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setShowSubcategoryForm(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory, category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowSubcategoryForm(true);
  };

  const handleDeleteSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteType('subcategory');
    setShowDeleteDialog(true);
  };

  const confirmDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;
    
    try {
      const response = await fetch(`/api/sub-categories/${selectedSubcategory.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete subcategory');
      }
      
      // Refresh categories list
      await fetchCategories();
      setShowDeleteDialog(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Toggle category expansion (for mobile view)
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Save handlers
  const handleSaveCategory = async (formData: { name: string; description?: string }) => {
    try {
      if (selectedCategory) {
        // Update existing category
        const response = await fetch(`/api/categories/${selectedCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update category');
        }
      } else {
        // Create new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create category');
        }
      }
      
      // Refresh categories and close form
      await fetchCategories();
      setShowCategoryForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveSubcategory = async (formData: { name: string; description?: string; categoryId?: string }) => {
    try {
      if (selectedSubcategory) {
        // Update existing subcategory
        const response = await fetch(`/api/sub-categories/${selectedSubcategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            categoryId: formData.categoryId || selectedCategory?.id,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update subcategory');
        }
      } else {
        // Create new subcategory
        // Using the same endpoint as in the AddSubcategoryPage component
        const response = await fetch('/api/sub-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId || selectedCategory?.id,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create subcategory');
        }
      }
      
      // Refresh categories and close form
      await fetchCategories();
      setShowSubcategoryForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleAddCategory}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="border rounded-lg shadow bg-white">
              <div className="pt-6 px-6">
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">No categories found</p>
                  <button 
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-auto"
                    onClick={handleAddCategory}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Category
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg shadow bg-white">
                  <div className="py-4 px-6 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <button 
                          className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} />
                        </button>
                        <h2 className="text-lg font-semibold">{category.name}</h2>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                          onClick={() => handleAddSubcategory(category)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Subcategory
                        </button>
                        <button 
                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                  
                  <div className={`px-6 py-4 ${expandedCategories[category.id] ? 'block' : 'hidden md:block'}`}>
                    {category.subcategories.length > 0 ? (
                      <div className="border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {category.subcategories.map((subcategory) => (
                              <tr key={subcategory.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subcategory.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subcategory.description || '—'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <button 
                                      className="p-1 rounded-full hover:bg-gray-100"
                                      onClick={() => handleEditSubcategory(subcategory, category)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-1 rounded-full hover:bg-gray-100"
                                      onClick={() => handleDeleteSubcategory(subcategory)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No subcategories found for this category
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={selectedCategory}
          onSave={handleSaveCategory}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}

      {/* Subcategory Form Modal */}
      {showSubcategoryForm && (
        <SubcategoryForm
          subcategory={selectedSubcategory}
          category={selectedCategory}
          categories={categories}
          onSave={handleSaveSubcategory}
          onCancel={() => setShowSubcategoryForm(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          type={deleteType}
          itemName={deleteType === 'category' 
            ? selectedCategory?.name || '' 
            : selectedSubcategory?.name || ''}
          onConfirm={deleteType === 'category' 
            ? confirmDeleteCategory 
            : confirmDeleteSubcategory}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}