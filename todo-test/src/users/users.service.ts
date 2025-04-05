import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_REPOSITORY') private usersRepository: Repository<User>) {}

  findAll = async (): Promise<Array<User>> => {
    return this.usersRepository.find();
  };

  findAllPublic = async (): Promise<Array<{ id: string; username: string }>> => {
    const users = await this.usersRepository.find();
    return users.map((user: User) => ({
      id: user.id,
      username: user.username,
    }));
  };

  findOneByEmail = async (email: string): Promise<User | null> => {
    return this.usersRepository.findOne({ where: { email } });
  };

  create = async (createUserDto: CreateUserDto): Promise<User> => {
    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    return await this.usersRepository.save(newUser);
  };

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<User | null> => {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  };
}
