import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma, OrderStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') as OrderStatus | null;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Build filter
    const where: Prisma.OrderWhereInput = { userId };
    if (status) {
      where.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get orders with count
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          },
          payment: true,
          shipment: true
        }
      }),
      prisma.order.count({ where })
    ]);
    
    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Types for order creation
interface OrderItem {
  productId: string;
  quantity: number;
}

interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const body: CreateOrderRequest = await request.json();
    const { userId, items, paymentMethod } = body;
    
    if (!userId || !items || items.length === 0 || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Fetch products to calculate prices and check stock
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });
    
    // Create a map for easy lookup
    const productMap = products.reduce<Record<string, any>>((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
    
    // Validate items and calculate total price
    let totalPrice = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: Prisma.Decimal | number;
    }> = [];
    
    for (const item of items) {
      const product = productMap[item.productId];
      
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Product '${product.name}' has insufficient stock` },
          { status: 400 }
        );
      }
      
      const itemPrice = parseFloat(product.price.toString()) * item.quantity;
      totalPrice += itemPrice;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Start a transaction to ensure data consistency
    const order = await prisma.$transaction(async (prismaTransaction) => {
      // Create order
      const newOrder = await prismaTransaction.order.create({
        data: {
          userId,
          totalPrice,
          status: 'PENDING',
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      
      // Create payment record
      await prismaTransaction.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod,
          status: 'PENDING'
        }
      });
      
      // Create shipment record
      await prismaTransaction.shipment.create({
        data: {
          orderId: newOrder.id,
          status: 'PENDING'
        }
      });
      
      // Update product stock
      for (const item of items) {
        await prismaTransaction.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      
      // Clear user's cart after successful order
      const cart = await prismaTransaction.cart.findUnique({
        where: { userId }
      });
      
      if (cart) {
        await prismaTransaction.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }
      
      return newOrder;
    });
    
    // Get complete order with related data
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payment: true,
        shipment: true
      }
    });
    
    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}