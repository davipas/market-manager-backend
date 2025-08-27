import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRoleDto } from './dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.authService.createRole(createRoleDto);
  }

  @Get()
  findAll() {
    return this.authService.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findRoleById(id);
  }
  // todo: protect this endpoint
  @Post('seed')
  async seedRoles() {
    return this.authService.createDefaultRoles();
  }
}
