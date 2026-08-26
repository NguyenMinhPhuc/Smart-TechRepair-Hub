import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  CreatePartDto,
  UpdatePartDto,
  UpdateCategoryDto,
} from '../dtos/inventory/create-part.dto';
import { ManageInventoryUseCase } from '../../application/inventory/manage-inventory.use-case';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';

import { DataSource } from 'typeorm';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('api/inventory')
export class InventoryController {
  constructor(
    private readonly inventoryUseCase: ManageInventoryUseCase,
    private readonly dataSource: DataSource,
  ) {}

  // --- Parts ---
  @Get('parts')
  @ApiOperation({ summary: 'Danh sách linh kiện' })
  async listParts(
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.inventoryUseCase.listParts({
      categoryId,
      status,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('parts/search')
  @ApiOperation({
    summary: 'Tìm kiếm linh kiện gần đúng (Fuzzy/Accent-Insensitive)',
  })
  async searchParts(@Query('q') query = '') {
    const raw = (query || '').trim();
    if (!raw) return [];

    const tokens = raw.split(/\s+/).filter((t) => t.length > 0);

    const makeWhereClause = (isAnd: boolean) => {
      const tokenConditions = tokens.map((token) => {
        const safe = token.replace(/'/g, "''");
        return `(
          P.Name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%${safe}%'
          OR P.SerialIMEI LIKE '%${safe}%'
          OR CAT.Name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%${safe}%'
          OR CAST(P.PartId AS VARCHAR(50)) LIKE '%${safe}%'
        )`;
      });
      return tokenConditions.join(isAnd ? ' AND ' : ' OR ');
    };

    let whereClause = makeWhereClause(true);
    let sql = `
      SELECT TOP 15 P.PartId, P.Name, P.SerialIMEI, P.Price, P.Status, CAT.Name AS CategoryName
      FROM Parts P
      INNER JOIN Categories CAT ON P.CategoryId = CAT.CategoryId
      WHERE P.IsDeleted = 0 AND P.Status IN ('New', 'Used') AND (${whereClause})
      ORDER BY CASE WHEN P.Status = 'New' THEN 0 ELSE 1 END, P.CreatedAt DESC
    `;

    let results = await this.dataSource.query(sql);

    if ((!results || results.length === 0) && tokens.length > 1) {
      whereClause = makeWhereClause(false);
      sql = `
        SELECT TOP 15 P.PartId, P.Name, P.SerialIMEI, P.Price, P.Status, CAT.Name AS CategoryName
        FROM Parts P
        INNER JOIN Categories CAT ON P.CategoryId = CAT.CategoryId
        WHERE P.IsDeleted = 0 AND P.Status IN ('New', 'Used') AND (${whereClause})
        ORDER BY CASE WHEN P.Status = 'New' THEN 0 ELSE 1 END, P.CreatedAt DESC
      `;
      results = await this.dataSource.query(sql);
    }

    return results;
  }

  @Post('parts')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({ summary: 'Thêm linh kiện mới vào kho' })
  async createPart(@Body() dto: CreatePartDto) {
    return this.inventoryUseCase.createPart(dto);
  }

  @Put('parts/:id')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({ summary: 'Cập nhật thông tin linh kiện' })
  async updatePart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePartDto,
  ) {
    return this.inventoryUseCase.updatePart({ partId: id, ...dto });
  }

  @Delete('parts/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa mềm linh kiện' })
  async deletePart(@Param('id', ParseUUIDPipe) id: string) {
    await this.inventoryUseCase.deletePart(id);
    return { message: 'Linh kiện đã được xóa.' };
  }

  // --- Categories ---
  @Get('categories')
  @ApiOperation({ summary: 'Danh sách danh mục' })
  async listCategories() {
    return this.inventoryUseCase.listCategories();
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Thêm danh mục linh kiện' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.inventoryUseCase.createCategory(dto.name, dto.description);
  }

  @Put('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục linh kiện' })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.inventoryUseCase.updateCategory(id, dto.name, dto.description);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa mềm danh mục' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    await this.inventoryUseCase.deleteCategory(id);
    return { message: 'Danh mục đã được xóa.' };
  }
}
