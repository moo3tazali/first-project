import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiBearerAuth()
  @ApiOperation({})
  @ApiResponse({
    status: 200,
    description: 'Returns my profile',
  })
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Auth() user: User) {
    return user;
  }
}
