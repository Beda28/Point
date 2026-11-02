import { IsInt, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class SettleDto {
  @IsUUID()
  transaction_id: string;

  @IsString() @Length(1, 128)
  seller_id: string;

  @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER)
  amount: number;

  @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER)
  point: number;
}
