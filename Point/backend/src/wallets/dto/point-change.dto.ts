import { IsInt, Min, Max, IsString, Length } from "class-validator";

export class PointChangeDto {
    @IsString() @Length(1, 128)
    user_id: string;

    @IsInt() @Min(1) @Max(Number.MAX_SAFE_INTEGER)
    amount : number;

    @IsString() @Length(1, 128)
    ref_id : string;
}
