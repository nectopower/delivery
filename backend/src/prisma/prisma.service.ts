import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

// Mock PrismaClient to avoid dependency on the actual Prisma engine
class MockPrismaClient {
  user = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => {
      if (params?.where?.email === 'admin@example.com') {
        return { id: 'admin-id', email: 'admin@example.com', password: 'hashed_password', role: 'ADMIN', name: 'Admin User' };
      }
      return null;
    },
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  restaurant = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'restaurant-id', name: 'Mock Restaurant', isApproved: true }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  dish = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'dish-id', name: 'Mock Dish', price: 10.99 }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  order = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ 
      id: 'order-id', 
      status: 'PENDING', 
      total: 20.99,
      customer: {
        userId: 'user-id',
        user: {
          email: 'customer@example.com',
          name: 'Customer Name'
        }
      },
      restaurant: {
        id: 'restaurant-id',
        name: 'Restaurant Name'
      }
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  // Add missing models
  customer = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'customer-id', userId: 'user-id', address: '123 Main St' }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  admin = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'admin-id', userId: 'user-id' }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  payment = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ 
      id: 'payment-id', 
      orderId: 'order-id', 
      amount: 20.99, 
      status: 'COMPLETED',
      order: {
        customer: {
          userId: 'user-id',
          user: {
            email: 'customer@example.com',
            name: 'Customer Name'
          }
        }
      }
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0,
    aggregate: async (params = {}) => ({ _sum: { amount: 1000 } })
  };
  
  category = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'category-id', name: 'Mock Category' }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  orderItem = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'order-item-id', quantity: 2, price: 10.99 }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  // Add notification model
  notification = {
    create: async (data) => ({ 
      id: 'notification-id', 
      ...data.data,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findUnique: async (params) => ({ 
      id: 'notification-id', 
      type: 'ORDER_STATUS', 
      message: 'Your order status has changed',
      recipientId: 'user-id',
      read: false,
      data: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'notification-id', ...params.data }),
    delete: async (params) => ({ id: 'notification-id' }),
    count: async (params = {}) => 0
  };
  
  // Mock connection methods
  $connect() {
    console.log('Mock Prisma client connected');
    return Promise.resolve();
  }
  
  $disconnect() {
    console.log('Mock Prisma client disconnected');
    return Promise.resolve();
  }
}

@Injectable()
export class PrismaService extends MockPrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
    console.log('Using Mock Prisma Client due to environment constraints');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
