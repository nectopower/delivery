import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(data: any): Promise<any>;
    findById(id: string): Promise<{
        id: string;
        orderId: string;
        amount: number;
        status: string;
        order: {
            customer: {
                userId: string;
                user: {
                    email: string;
                    name: string;
                };
            };
        };
    }>;
    updateStatus(id: string, status: string): Promise<any>;
    findByOrder(orderId: string): Promise<any[]>;
    findAll(): Promise<any[]>;
    getPaymentStats(): Promise<{
        completedPayments: number;
        pendingPayments: number;
        failedPayments: number;
        totalRevenue: number;
    }>;
}
