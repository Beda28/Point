import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class ChargeDto {
  @IsInt() @Min(1) @Max(Number.MAX_SAFE_INTEGER)
  amount: number;

  @IsUUID()
  req_key: string;
}
