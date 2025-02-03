import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // POST /orders – tworzenie zamówienia
    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.create(createOrderDto)
    }

    // GET /orders – pobieranie wszystkich zamówień
    @Get()
    findAll() {
        return this.orderService.findAll()
    }

    // GET /orders/:id – pobieranie zamówienia po ID
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.findOne(id)
    }

    // PATCH /orders/:id – aktualizacja zamówienia
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.orderService.update(id, updateOrderDto)
    }

    // DELETE /orders/:id – usuwanie zamówienia
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(id)
    }
}
