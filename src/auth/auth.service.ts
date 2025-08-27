import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateRoleDto, CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    // verify if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    // verify if rol exists
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId },
    });
    if (!role) {
      throw new BadRequestException('Role does not exist');
    }
    // encrypt password
    const saltsRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltsRounds);
    // create user

    const user = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
      isActive: createUserDto.active ?? true,
    });
    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      relations: ['role'],
      select: ['id', 'email', 'password'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException(`Rol ${createRoleDto.name} already exists`);
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Rol with id ${id} not found`);
    }
    return role;
  }

  async createDefaultRoles(): Promise<string> {
    const defaultRoles = [
      { name: 'admin', description: 'Administrator' },
      { name: 'cashier', description: 'A person who can register sales' },
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }
    return 'Roles created';
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // ✅ Validar usuario para login
  // async validateUser(email: string, password: string): Promise<User | null> {
  //   const user = await this.userRepository.findOne({
  //     where: { email, active: true },
  //     relations: ['role'],
  //   });

  //   if (user && (await bcrypt.compare(password, user.passwordHash))) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { passwordHash, ...result } = user;
  //     return result as User;
  //   }

  //   return null;
  // }
}
