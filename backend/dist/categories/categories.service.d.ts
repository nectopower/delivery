import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: {
        name: string;
        restaurantId: string;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
    }>;
    findByRestaurant(restaurantId: string): Promise<any[]>;
    update(id: string, updateCategoryDto: {
        name: string;
    }): Promise<any>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
