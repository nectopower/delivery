import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DeliveryPersonsService } from './delivery-persons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VehicleType, DeliveryPersonStatus } from '@prisma/client';

@Controller('delivery-persons')
export class DeliveryPersonsController {
  constructor(private readonly deliveryPersonsService: DeliveryPersonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDeliveryPersonDto: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
    vehicleType: VehicleType;
    vehiclePlate?: string;
  }) {
    return this.deliveryPersonsService.create(createDeliveryPersonDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: DeliveryPersonStatus,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    return this.deliveryPersonsService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      status,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  findOne(@Param('id') id: string) {
    return this.deliveryPersonsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryPersonDto: {
      name?: string;
      phone?: string;
      vehicleType?: VehicleType;
      vehiclePlate?: string;
      status?: DeliveryPersonStatus;
      isActive?: boolean;
    },
  ) {
    return this.deliveryPersonsService.update(id, updateDeliveryPersonDto);
  }

  @Patch(':id/location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DELIVERY_PERSON')
  updateLocation(
    @Param('id') id: string,
    @Body() locationData: { latitude: number; longitude: number },
  ) {
    return this.deliveryPersonsService.updateLocation(id, locationData.latitude, locationData.longitude);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DELIVERY_PERSON', 'ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() statusData: { status: DeliveryPersonStatus },
  ) {
    return this.deliveryPersonsService.updateStatus(id, statusData.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.deliveryPersonsService.remove(id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  getDeliveryStats(@Param('id') id: string) {
    return this.deliveryPersonsService.getDeliveryStats(id);
  }

  @Get('available/near')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RESTAURANT')
  getAvailableDeliveryPersons(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return this.deliveryPersonsService.getAvailableDeliveryPersons(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }
}
