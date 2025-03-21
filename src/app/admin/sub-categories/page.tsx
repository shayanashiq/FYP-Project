// app/admin/subcategories/page.tsx
import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

// This is a server component that fetches data
const prisma = new PrismaClient();

export default async function SubcategoriesPage() {
  const subcategories = await prisma.subCategory.findMany({
    include: {
      category: true, // Include parent category
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subcategories</h1>
        <Link
          href="/admin/subcategories/add"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Subcategory
        </Link>
      </div>

      {subcategories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No subcategories found.</p>
          <p className="mt-2">
            <Link
              href="/admin/subcategories/add"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Create your first subcategory
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
                  Parent Category
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subcategories.map((subcategory) => (
                <tr key={subcategory.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subcategory.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subcategory.category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {subcategory.description || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/admin/subcategories/${subcategory.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
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