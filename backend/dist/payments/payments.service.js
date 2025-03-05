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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(data) {
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
        await this.notificationsService.createPaymentNotification(payment.id, payment.status);
        return payment;
    }
    async findById(id) {
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
    async updateStatus(id, status) {
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
        await this.notificationsService.createPaymentNotification(payment.id, payment.status);
        return payment;
    }
    async findByOrder(orderId) {
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
        const completedPayments = await this.prisma.payment.count({
            where: { status: 'COMPLETED' },
        });
        const pendingPayments = await this.prisma.payment.count({
            where: { status: 'PENDING' },
        });
        const failedPayments = await this.prisma.payment.count({
            where: { status: 'FAILED' },
        });
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map