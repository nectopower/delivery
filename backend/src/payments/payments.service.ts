import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: any) {
    const payment = await this.prisma.payment.create({
      data,
      include: {
        order: {
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
        },
      },
    });

    // Send notification
    await this.notificationsService.createPaymentNotification(
      payment.id,
      payment.status,
    );

    return payment;
  }

  async findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                dish: true,
              },
            },
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
        },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        order: {
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
        },
      },
    });

    // Send notification
    await this.notificationsService.createPaymentNotification(
      payment.id,
      payment.status,
    );

    return payment;
  }

  async findByOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      include: {
        order: {
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
        },
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPaymentStats() {
    // Get total payments by status
    const completedPayments = await this.prisma.payment.count({
      where: { status: 'COMPLETED' },
    });
    
    const pendingPayments = await this.prisma.payment.count({
      where: { status: 'PENDING' },
    });
    
    const failedPayments = await this.prisma.payment.count({
      where: { status: 'FAILED' },
    });
    
    // Get total revenue
    const totalRevenue = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: {
        amount: true,
      },
    });
    
    return {
      completedPayments,
      pendingPayments,
      failedPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }
}
