import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DeliveryFeeService } from './delivery-fee.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('delivery-fee')
export class DeliveryFeeController {
  constructor(private readonly deliveryFeeService: DeliveryFeeService) {}

  @Get('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getConfig() {
    return this.deliveryFeeService.getConfig();
  }

  @Post('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateConfig(@Body() updateConfigDto: {
    basePrice?: number;
    pricePerKm?: number;
    rushHourMultiplier?: number;
    rushHourStart?: number;
    rushHourEnd?: number;
    nightFeeMultiplier?: number;
    nightFeeStart?: number;
    nightFeeEnd?: number;
  }) {
    return this.deliveryFeeService.updateConfig(updateConfigDto);
  }

  @Post('calculate')
  calculateDeliveryFee(@Body() data: { distance: number; orderTime?: string }) {
    const orderTime = data.orderTime ? new Date(data.orderTime) : new Date();
    return this.deliveryFeeService.calculateDeliveryFee(data.distance, orderTime);
  }

  @Post('estimate-time')
  getDeliveryTimeEstimate(@Body() data: { distance: number; orderTime?: string }) {
    const orderTime = data.orderTime ? new Date(data.orderTime) : new Date();
    return this.deliveryFeeService.getDeliveryTimeEstimate(data.distance, orderTime);
  }
}
