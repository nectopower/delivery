import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private restaurantService;
    constructor(restaurantService: RestaurantService);
    findAll(): Promise<any[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        isApproved: boolean;
    }>;
    findByUserId(userId: string): Promise<{
        id: string;
        name: string;
        isApproved: boolean;
    }>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<{
        id: string;
    }>;
    approve(id: string): Promise<any>;
    reject(id: string): Promise<any>;
}
