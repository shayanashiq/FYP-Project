// app/admin/categories/page.tsx
import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

// This is a server component that fetches data
const prisma = new PrismaClient();

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true, // Include subcategories
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="space-x-2">
          <Link
            href="/admin/categories/add"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Category
          </Link>
          <Link
            href="/admin/sub-categories/add"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Subcategory
          </Link>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No categories found.</p>
          <p className="mt-2">
            <Link
              href="/admin/categories/add"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Create your first category
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subcategories
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {category.description || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {category.subcategories.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {category.subcategories.map((subcategory) => (
                            <li key={subcategory.id}>
                              {subcategory.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '—'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    
                    <Link 
                      href={`/admin/categories/${category.id}/sub-categories/add`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Add Subcategory
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}