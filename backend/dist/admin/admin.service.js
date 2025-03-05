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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count();
        const totalRestaurants = await this.prisma.restaurant.count();
        const totalOrders = await this.prisma.order.count();
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map