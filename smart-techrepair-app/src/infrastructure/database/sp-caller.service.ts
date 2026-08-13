import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SpCallerService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Execute a Stored Procedure and return result rows.
   * All data mutations MUST go through this method.
   */
  async execute<T = Record<string, unknown>>(
    spName: string,
    params: Record<string, unknown> = {},
  ): Promise<T[]> {
    const paramEntries = Object.entries(params);
    const paramList = paramEntries
      .map(([key, val]) => {
        if (val === null || val === undefined) return `@${key} = NULL`;
        if (typeof val === 'string') return `@${key} = N'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'boolean') return `@${key} = ${val ? 1 : 0}`;
        if (val instanceof Date) return `@${key} = '${val.toISOString()}'`;
        return `@${key} = ${val}`;
      })
      .join(', ');

    const sql = paramList ? `EXEC ${spName} ${paramList}` : `EXEC ${spName}`;
    return this.dataSource.query(sql) as Promise<T[]>;
  }

  /**
   * Execute a Stored Procedure with OUTPUT parameters.
   * Returns a single row with the output values.
   */
  async executeWithOutput<T = Record<string, unknown>>(
    spName: string,
    params: Record<string, unknown> = {},
    outputParams: string[] = [],
  ): Promise<T> {
    const declarations = outputParams
      .map((p) => `DECLARE @Out_${p} NVARCHAR(MAX) = NULL;`)
      .join(' ');

    const paramEntries = Object.entries(params);
    const inputList = paramEntries
      .filter(([key]) => !outputParams.includes(key))
      .map(([key, val]) => {
        if (val === null || val === undefined) return `@${key} = NULL`;
        if (typeof val === 'string') return `@${key} = N'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'boolean') return `@${key} = ${val ? 1 : 0}`;
        if (val instanceof Date) return `@${key} = '${val.toISOString()}'`;
        return `@${key} = ${val}`;
      });

    const outputList = outputParams.map((p) => `@${p} = @Out_${p} OUTPUT`);
    const allParams = [...inputList, ...outputList].join(', ');

    const selectOutputs = outputParams.map((p) => `@Out_${p} AS ${p}`).join(', ');

    const sql = `
      ${declarations}
      EXEC ${spName} ${allParams};
      SELECT ${selectOutputs};
    `;

    const result = await this.dataSource.query(sql);
    return (result[0] ?? {}) as T;
  }
}
