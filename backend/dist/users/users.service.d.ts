import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: string;
        name: string;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: string;
        name: string;
    }>;
    update(id: string, data: any): Promise<any>;
}
