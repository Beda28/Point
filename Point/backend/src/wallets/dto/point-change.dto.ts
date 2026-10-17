import { IsInt, Min, Max, IsString, Length, IsOptional } from "class-validator";

export class PointChangeDto {
    @IsString() @Length(1, 128)
    user_id: string;

    @IsInt() @Min(0) @Max(Number.MAX_SAFE_INTEGER)
    amount : number;

    @IsOptional() @IsInt() @Min(1) @Max(Number.MAX_SAFE_INTEGER)
    point? : number | null;

    @IsString() @Length(1, 128)
    ref_id : string;
}
