import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class AddReviewDto {


  @IsNotEmpty()
  @IsString()
  review: string; // renamed from reviewText

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsBoolean()
  showName: boolean = true;

  @IsOptional()
  @IsNumber()
  helpfulVotes?: number = 0;

}
