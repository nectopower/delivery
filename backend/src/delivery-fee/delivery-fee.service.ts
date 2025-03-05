import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryFeeService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    // Buscar a configuração atual ou criar uma padrão se não existir
    const config = await this.prisma.deliveryFeeConfig.findFirst();
    
    if (!config) {
      return this.prisma.deliveryFeeConfig.create({
        data: {
          basePrice: 5.0,
          pricePerKm: 1.5,
          rushHourMultiplier: 1.5,
          rushHourStart: 17, // 17h (5pm)
          rushHourEnd: 21, // 21h (9pm)
          nightFeeMultiplier: 1.2,
          nightFeeStart: 22, // 22h (10pm)
          nightFeeEnd: 6, // 6h (6am)
        },
      });
    }
    
    return config;
  }

  async updateConfig(data: {
    basePrice?: number;
    pricePerKm?: number;
    rushHourMultiplier?: number;
    rushHourStart?: number;
    rushHourEnd?: number;
    nightFeeMultiplier?: number;
    nightFeeStart?: number;
    nightFeeEnd?: number;
  }) {
    const config = await this.getConfig();
    
    return this.prisma.deliveryFeeConfig.update({
      where: { id: config.id },
      data,
    });
  }

  async calculateDeliveryFee(distance: number, orderTime: Date = new Date()) {
    const config = await this.getConfig();
    
    // Calcular o preço base pela distância
    let fee = config.basePrice + (distance * config.pricePerKm);
    
    // Verificar se é horário de pico
    const hour = orderTime.getHours();
    if (
      (config.rushHourStart <= config.rushHourEnd && 
       hour >= config.rushHourStart && 
       hour < config.rushHourEnd) ||
      (config.rushHourStart > config.rushHourEnd && 
       (hour >= config.rushHourStart || hour < config.rushHourEnd))
    ) {
      fee *= config.rushHourMultiplier;
    }
    
    // Verificar se é horário noturno
    if (
      (config.nightFeeStart <= config.nightFeeEnd && 
       hour >= config.nightFeeStart && 
       hour < config.nightFeeEnd) ||
      (config.nightFeeStart > config.nightFeeEnd && 
       (hour >= config.nightFeeStart || hour < config.nightFeeEnd))
    ) {
      fee *= config.nightFeeMultiplier;
    }
    
    // Arredondar para 2 casas decimais
    return Math.round(fee * 100) / 100;
  }

  async getDeliveryTimeEstimate(distance: number, orderTime: Date = new Date()) {
    // Tempo base: 10 minutos + 3 minutos por km
    let timeInMinutes = 10 + (distance * 3);
    
    // Adicionar tempo extra em horário de pico (30%)
    const config = await this.getConfig();
    const hour = orderTime.getHours();
    
    if (
      (config.rushHourStart <= config.rushHourEnd && 
       hour >= config.rushHourStart && 
       hour < config.rushHourEnd) ||
      (config.rushHourStart > config.rushHourEnd && 
       (hour >= config.rushHourStart || hour < config.rushHourEnd))
    ) {
      timeInMinutes *= 1.3;
    }
    
    // Arredondar para o inteiro mais próximo
    return Math.round(timeInMinutes);
  }
}
