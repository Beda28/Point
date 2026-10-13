import { IsString, Length } from "class-validator";

export class InitWalletDto {
    @IsString() @Length(1, 128)
    user_id: string;
}
