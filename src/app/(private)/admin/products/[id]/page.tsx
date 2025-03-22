// File: app/admin/products/[id]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import ProductUpdateForm from '../../../../../../modules/admin/components/editProduct';

export default function EditProductPage() {
  const params = useParams();
  const productId = Number();

  return (
    <div className="container mx-auto py-8">
      {/* <ProductUpdateForm productId={productId} /> */}
      <ProductUpdateForm />
    </div>
  );
}