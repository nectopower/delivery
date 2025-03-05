import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalRestaurants = await this.prisma.restaurant.count();
    const totalOrders = await this.prisma.order.count();
    
    // Get orders by status
    const ordersByStatus = {
      PENDING: await this.prisma.order.count({ 
        where: { status: 'PENDING' } 
      }),
      ACCEPTED: await this.prisma.order.count({ 
        where: { status: 'ACCEPTED' } 
      }),
      PREPARING: await this.prisma.order.count({ 
        where: { status: 'PREPARING' } 
      }),
      READY_FOR_PICKUP: await this.prisma.order.count({ 
        where: { status: 'READY_FOR_PICKUP' } 
      }),
      OUT_FOR_DELIVERY: await this.prisma.order.count({ 
        where: { status: 'OUT_FOR_DELIVERY' } 
      }),
      DELIVERED: await this.prisma.order.count({ 
        where: { status: 'DELIVERED' } 
      }),
      CANCELLED: await this.prisma.order.count({ 
        where: { status: 'CANCELLED' } 
      }),
    };
    
    // Get users by role
    const usersByRole = {
      ADMIN: await this.prisma.user.count({ 
        where: { role: 'ADMIN' } 
      }),
      RESTAURANT: await this.prisma.user.count({ 
        where: { role: 'RESTAURANT' } 
      }),
      CUSTOMER: await this.prisma.user.count({ 
        where: { role: 'CUSTOMER' } 
      }),
    };
    
    // Get recent orders
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        restaurant: true,
        customer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    
    return {
      totalUsers,
      totalRestaurants,
      totalOrders,
      ordersByStatus,
      usersByRole,
      recentOrders,
    };
  }
}
