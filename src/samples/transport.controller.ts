import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TransportService } from './transport.service';
import { Transport } from './transport.entity';

@Controller('api/transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  async list(@Query() query): Promise<object> {
    const response: object = await this.transportService
      .getList(query)
      .then((result) => {
        const current = query.page !== undefined ? Number(query.page) : 1;
        const numberOfItems: number = Object.keys(result).length;
        const numberPerPage = 3;
        const numberOfPages: number = Math.ceil(numberOfItems / numberPerPage);
        const trimStart: number = (current - 1) * numberPerPage;
        const trimEnd: number = trimStart + numberPerPage;
        const obj: any = result.toArray();
        const page_lists: any = obj._settledValue.slice(trimStart, trimEnd);

        const final_data = {
          page_lists: page_lists,
          numberOfPages: numberOfPages,
          currentPage: current,
          previousPage: current !== 1 ? current - 1 : 0,
          nextPage: current !== numberOfPages ? current + 1 : 0,
          perPage: numberPerPage,
          totalItems: numberOfItems,
        };
        return final_data;
      })
      .catch((error) => {
        return error;
      });

    return response;
  }

  @Post('add')
  async add(@Body() transport: Transport): Promise<string> {
    transport.expenses = Number(transport.expenses);
    const response = await this.transportService
      .insert(transport)
      .then((result) => {
        return 'Data successfully added.';
      })
      .catch((error) => {
        return error;
      });

    return response;
  }

  @Get('edit/:id')
  async edit(@Param('id') id: string): Promise<Transport> {
    const response = await this.transportService
      .getData(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });

    return response;
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() transport: Transport,
  ): Promise<string> {
    const data = {
      transport: transport.transport,
      expenses: transport.expenses,
      reason: transport.reason,
      time_start: transport.time_start,
      time_end: transport.time_end,
    };

    const response = await this.transportService
      .update(id, data)
      .then((result) => {
        if (result.replaced === 1) {
          return 'Data was successfully updated.';
        }
      })
      .catch((error) => {
        return error;
      });

    return response;
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<string> {
    const response = await this.transportService
      .delete(id)
      .then((result) => {
        return `Record has been deleted.`;
      })
      .catch((error) => {
        return error;
      });

    return response;
  }

  @Get('reports')
  async reports(@Query() query): Promise<object> {
    console.log(query);
    const response = await this.transportService
      .getReports(query)
      .then((result) => {
        const label: string[] = [];
        const expense: number[] = [];
        const id: string[] = [];
        result.map((item) => {
          label.push(item.time_start.split('T')[0]);
          expense.push(item.expenses);
        });
        const data: object = {
          labels: label,
          expenses: expense,
          status: 200,
        };
        return data;
      })
      .catch((error) => {
        return error;
      });

    return response;
  }

  @Get('search')
  async search(): Promise<object> {
    return [];
  }
}
