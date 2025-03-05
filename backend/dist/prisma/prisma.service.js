"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
class MockPrismaClient {
    constructor() {
        this.user = {
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
        this.restaurant = {
            create: async (data) => ({ id: 'mock-id', ...data.data }),
            findUnique: async (params) => ({ id: 'restaurant-id', name: 'Mock Restaurant', isApproved: true }),
            findMany: async (params = {}) => [],
            update: async (params) => ({ id: 'mock-id', ...params.data }),
            delete: async (params) => ({ id: 'mock-id' }),
            count: async (params = {}) => 0
        };
        this.dish = {
            create: async (data) => ({ id: 'mock-id', ...data.data }),
            findUnique: async (params) => ({ id: 'dish-id', name: 'Mock Dish', price: 10.99 }),
            findMany: async (params = {}) => [],
            update: async (params) => ({ id: 'mock-id', ...params.data }),
            delete: async (params) => ({ id: 'mock-id' }),
            count: async (params = {}) => 0
        };
        this.order = {
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
        this.customer = {
            create: async (data) => ({ id: 'mock-id', ...data.data }),
            findUnique: async (params) => ({ id: 'customer-id', userId: 'user-id', address: '123 Main St' }),
            findMany: async (params = {}) => [],
            update: async (params) => ({ id: 'mock-id', ...params.data }),
            delete: async (params) => ({ id: 'mock-id' }),
            count: async (params = {}) => 0
        };
        this.admin = {
            create: async (data) => ({ id: 'mock-id', ...data.data }),
            findUnique: async (params) => ({ id: 'admin-id', userId: 'user-id' }),
            findMany: async (params = {}) => [],
            update: async (params) => ({ id: 'mock-id', ...params.data }),
            delete: async (params) => ({ id: 'mock-id' }),
            count: async (params = {}) => 0
        };
        this.payment = {
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
        this.category = {
            create: async (data) => ({ id: 'mock-id', ...data.data }),
            findUnique: async (params) => ({ id: 'category-id', name: 'Mock Category' }),
            findMany: async (params = {}) => [],
            update: async (params) => ({ id: 'mock-id', ...params.data }),
            delete: async (params) => ({ id: 'mock-id' }),
            count: async (params = {}) => 0
        };
        this.orderItem = {
            create: async (data) => ({ id: 'mock-id', ...data.data }),
            findUnique: async (params) => ({ id: 'order-item-id', quantity: 2, price: 10.99 }),
            findMany: async (params = {}) => [],
            update: async (params) => ({ id: 'mock-id', ...params.data }),
            delete: async (params) => ({ id: 'mock-id' }),
            count: async (params = {}) => 0
        };
        this.notification = {
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
    }
    $connect() {
        console.log('Mock Prisma client connected');
        return Promise.resolve();
    }
    $disconnect() {
        console.log('Mock Prisma client disconnected');
        return Promise.resolve();
    }
}
let PrismaService = class PrismaService extends MockPrismaClient {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map