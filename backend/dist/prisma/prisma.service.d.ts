import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
declare class MockPrismaClient {
    user: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            email: string;
            password: string;
            role: string;
            name: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    restaurant: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            name: string;
            isApproved: boolean;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    dish: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            name: string;
            price: number;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    order: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            status: string;
            total: number;
            customer: {
                userId: string;
                user: {
                    email: string;
                    name: string;
                };
            };
            restaurant: {
                id: string;
                name: string;
            };
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    customer: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            userId: string;
            address: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    admin: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            userId: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    payment: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
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
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
        aggregate: (params?: {}) => Promise<{
            _sum: {
                amount: number;
            };
        }>;
    };
    category: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            name: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    orderItem: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            quantity: number;
            price: number;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    notification: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            type: string;
            message: string;
            recipientId: string;
            read: boolean;
            data: {};
            createdAt: Date;
            updatedAt: Date;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}
export declare class PrismaService extends MockPrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export {};
