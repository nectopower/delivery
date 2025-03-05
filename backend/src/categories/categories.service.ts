import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: { name: string; restaurantId: string }) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        restaurant: {
          connect: { id: createCategoryDto.restaurantId }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        restaurant: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        restaurant: true,
        dishes: true
      }
    });
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.category.findMany({
      where: {
        restaurantId
      },
      include: {
        dishes: true
      }
    });
  }

  async update(id: string, updateCategoryDto: { name: string }) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name
      }
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id }
    });
  }
}
