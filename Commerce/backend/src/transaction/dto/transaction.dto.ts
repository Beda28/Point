import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class TransactionDto {
  @IsUUID()
  pid: string;

  @IsInt() @Min(1) @Max(100)
  quantity: number;

  @IsOptional()
  @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER)
  point_used?: number;
}
