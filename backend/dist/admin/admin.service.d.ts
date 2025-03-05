import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalRestaurants: number;
        totalOrders: number;
        ordersByStatus: {
            PENDING: number;
            ACCEPTED: number;
            PREPARING: number;
            READY_FOR_PICKUP: number;
            OUT_FOR_DELIVERY: number;
            DELIVERED: number;
            CANCELLED: number;
        };
        usersByRole: {
            ADMIN: number;
            RESTAURANT: number;
            CUSTOMER: number;
        };
        recentOrders: any[];
    }>;
}
