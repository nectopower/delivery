import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderStatus } from '@prisma/client';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RESTAURANT')
  create(@Body() createDeliveryDto: {
    orderId: string;
    distance: number;
  }) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RESTAURANT', 'DELIVERY_PERSON')
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
    @Query('deliveryPersonId') deliveryPersonId?: string,
  ) {
    return this.deliveriesService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      status,
      deliveryPersonId,
    });
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  getPendingDeliveries() {
    return this.deliveriesService.getPendingDeliveries();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  assignDeliveryPerson(
    @Param('id') id: string,
    @Body() assignDto: { deliveryPersonId: string },
  ) {
    return this.deliveriesService.assignDeliveryPerson(id, assignDto.deliveryPersonId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON', 'RESTAURANT')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: OrderStatus },
  ) {
    return this.deliveriesService.updateStatus(id, statusDto.status);
  }

  @Patch(':id/rate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CUSTOMER')
  rateDelivery(
    @Param('id') id: string,
    @Body() rateDto: { rating: number; feedback?: string },
  ) {
    return this.deliveriesService.rateDelivery(id, rateDto);
  }
}
