import { Controller }   from '@nestjs/common';
import { PointService } from './point.service.js';

@Controller()
export class PointController {
  constructor(private readonly pointService: PointService) {}
}
