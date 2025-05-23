import { BadRequestException, Controller, Get, NotFoundException, Patch, Post, Req, UseGuards, Delete, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    try {
      const user = await this.userService.findByEmail(req.user.email);
      if (!user) return { message: 'User not found' };

      if (!user.linkedinFullName && user.linkedInUrl) {
        await this.userService.enrichUserWithLinkedIn(req.user.email);
      }

      const { password, ...rest } = user.toObject();
      return rest;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new NotFoundException('User fucked up');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addTaskToUser(@Req() req, @Body() taskData) {
   
    const updatedUser = await this.userService.addTaskToUser(req.user.email, taskData);

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return {
      ...userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateTask(@Req() req, @Body() taskData) {
    console.log(taskData);


    if (!taskData || !taskData.oldTitle) {
      throw new BadRequestException('oldTitle is required to identify the task');
    }

    const updatedUser = await this.userService.updateTask(req.user.email, taskData);

    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete")
  async deleteTaskFromUser(@Req() req, @Body() taskData) {
    if (!req.body) {
      throw new BadRequestException("Task is required");
    }

    const updatedUser = await this.userService.deleteTaskFromUser(req.user.email, taskData);

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return {
      ...userWithoutPassword
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('mark-completed')
  async markTaskAsCompleted(@Req() req, @Body() taskData) {
    if (!taskData || !taskData.title) {
      throw new BadRequestException('title is required to identify the task');
    }

    const updatedUser = await this.userService.markTaskAsCompleted(req.user.email, taskData);

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return userWithoutPassword;
  }
}

