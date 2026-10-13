import { IsUUID } from "class-validator";

export class ReverseTransactionDto {
    @IsUUID()
    transaction_id: string;
}