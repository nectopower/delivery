import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleType, DeliveryPersonStatus } from '@prisma/client';

@Injectable()
export class DeliveryPersonsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
    vehicleType: VehicleType;
    vehiclePlate?: string;
  }) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // Deve ser criptografada antes
        name: data.name,
        role: 'DELIVERY_PERSON',
        deliveryPerson: {
          create: {
            cpf: data.cpf,
            phone: data.phone,
            vehicleType: data.vehicleType,
            vehiclePlate: data.vehiclePlate,
          },
        },
      },
      include: {
        deliveryPerson: true,
      },
    });

    return user;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: DeliveryPersonStatus;
    isActive?: boolean;
    search?: string;
  }) {
    const { skip, take, status, isActive, search } = params;
    
    const where = {
      status: status ? status : undefined,
      isActive: typeof isActive === 'boolean' ? isActive : undefined,
      user: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    };

    const deliveryPersons = await this.prisma.deliveryPerson.findMany({
      skip,
      take,
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.deliveryPerson.count({ where });

    return {
      data: deliveryPersons,
      total,
    };
  }

  async findOne(id: string) {
    return this.prisma.deliveryPerson.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        deliveries: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            order: {
              select: {
                id: true,
                status: true,
                total: true,
                address: true,
                createdAt: true,
                customer: {
                  select: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                restaurant: {
                  select: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                    address: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    phone?: string;
    vehicleType?: VehicleType;
    vehiclePlate?: string;
    status?: DeliveryPersonStatus;
    isActive?: boolean;
  }) {
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!deliveryPerson) {
      throw new Error('Delivery person not found');
    }

    // Atualizar dados do usuário se necessário
    if (data.name) {
      await this.prisma.user.update({
        where: { id: deliveryPerson.userId },
        data: { name: data.name },
      });
    }

    // Atualizar dados do entregador
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: {
        phone: data.phone,
        vehicleType: data.vehicleType,
        vehiclePlate: data.vehiclePlate,
        status: data.status,
        isActive: data.isActive,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
      },
    });
  }

  async updateStatus(id: string, status: DeliveryPersonStatus) {
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    // Em vez de excluir, apenas desativar
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getDeliveryStats(id: string) {
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id },
      select: {
        totalDeliveries: true,
        rating: true,
      },
    });

    const completedDeliveries = await this.prisma.delivery.count({
      where: {
        deliveryPersonId: id,
        status: 'DELIVERED',
      },
    });

    const canceledDeliveries = await this.prisma.delivery.count({
      where: {
        deliveryPersonId: id,
        status: 'CANCELLED',
      },
    });

    const totalEarnings = await this.prisma.delivery.aggregate({
      where: {
        deliveryPersonId: id,
        status: 'DELIVERED',
      },
      _sum: {
        fee: true,
      },
    });

    return {
      totalDeliveries: deliveryPerson.totalDeliveries,
      rating: deliveryPerson.rating,
      completedDeliveries,
      canceledDeliveries,
      totalEarnings: totalEarnings._sum.fee || 0,
    };
  }

  async getAvailableDeliveryPersons(restaurantLatitude: number, restaurantLongitude: number) {
    // Buscar entregadores disponíveis, ordenados por proximidade
    const availableDeliveryPersons = await this.prisma.deliveryPerson.findMany({
      where: {
        status: 'AVAILABLE',
        isActive: true,
        currentLatitude: { not: null },
        currentLongitude: { not: null },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calcular distância e ordenar por proximidade
    return availableDeliveryPersons
      .map(dp => ({
        ...dp,
        distance: this.calculateDistance(
          restaurantLatitude,
          restaurantLongitude,
          dp.currentLatitude,
          dp.currentLongitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Implementação do cálculo de distância usando a fórmula de Haversine
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
