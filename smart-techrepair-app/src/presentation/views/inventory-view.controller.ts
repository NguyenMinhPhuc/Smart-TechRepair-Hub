import { Controller, Get, Post, Body, Param, Render, UseGuards, Redirect, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DataSource } from 'typeorm';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryViewController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('parts')
  @Render('inventory/parts')
  async parts(
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('page') page = 1,
  ) {
    const limit = 20;
    const offset = (Number(page) - 1) * limit;
    const filters: string[] = ['P.IsDeleted = 0'];
    if (categoryId) filters.push(`P.CategoryId = '${categoryId}'`);
    if (status) filters.push(`P.Status = '${status}'`);

    const keyword = (q || '').trim();
    if (keyword) {
      const tokens = keyword.split(/\s+/).filter((t) => t.length > 0);
      const tokenConds = tokens.map((token) => {
        const safe = token.replace(/'/g, "''");
        return `(P.Name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%${safe}%' OR P.SerialIMEI LIKE '%${safe}%' OR CAT.Name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%${safe}%' OR CAST(P.PartId AS VARCHAR(50)) LIKE '%${safe}%')`;
      });
      filters.push(`(${tokenConds.join(' AND ')})`);
    }

    const where = filters.join(' AND ');

    const [parts, total, categories] = await Promise.all([
      this.dataSource.query(
        `SELECT P.PartId, P.Name, P.SerialIMEI, P.Status, P.Price, P.CreatedAt,
                CAT.Name AS CategoryName, CAT.CategoryId
         FROM Parts P
         INNER JOIN Categories CAT ON P.CategoryId = CAT.CategoryId
         WHERE ${where}
         ORDER BY P.CreatedAt DESC
         OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`,
      ),
      this.dataSource.query(`SELECT COUNT(*) AS total FROM Parts P INNER JOIN Categories CAT ON P.CategoryId = CAT.CategoryId WHERE ${where}`),
      this.dataSource.query(`SELECT CategoryId, Name FROM Categories WHERE IsDeleted = 0 ORDER BY Name`),
    ]);

    return {
      title: 'Quản lý Linh kiện',
      parts,
      categories,
      total: Number(total[0]?.total ?? 0),
      page: Number(page),
      limit,
      currentCategory: categoryId ?? '',
      currentStatus: status ?? '',
      q: keyword,
    };
  }

  @Get('categories')
  @Render('inventory/categories')
  async categories() {
    const cats = await this.dataSource.query(
      `SELECT CategoryId, Name, Description, CreatedAt,
              (SELECT COUNT(*) FROM Parts WHERE CategoryId = Categories.CategoryId AND IsDeleted = 0) AS PartCount
       FROM Categories WHERE IsDeleted = 0 ORDER BY Name`,
    );
    return { title: 'Quản lý Danh mục', categories: cats };
  }
}
