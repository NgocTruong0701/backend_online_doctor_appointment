import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, Req, HttpException, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { UpdateResult } from 'typeorm';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { IPayload } from 'src/auth/auth.service';
import { ResponseData } from 'src/common/global/responde.data';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search/:id')
  findOne(@Body() loginDto: LoginDto): Promise<User> {
    return this.usersService.findOne(loginDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/profile')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  async getProfile(@Req() request): Promise<ResponseData<User>> {
    try {
      const user = await this.usersService.getProfile(request.user as IPayload);
      return new ResponseData<User>(user, HttpStatusCode.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('token-stream-chat')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  async getTokenStreamChat(@Req() request): Promise<ResponseData<string>> {
    try {
      const payload = request.user as IPayload;
      const token = await this.usersService.generateTokenStreamChat(payload);
      return new ResponseData<string>(token, HttpStatusCode.CREATED, HttpMessage.CREATED);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  // @Public()
  async uploadImage(
    @Req() request,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const payload = request.user as IPayload;
      const result = await this.usersService.uploadImage(payload, file.buffer, file.originalname);
      return new ResponseData(result, HttpStatusCode.CREATED, HttpMessage.CREATED);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
