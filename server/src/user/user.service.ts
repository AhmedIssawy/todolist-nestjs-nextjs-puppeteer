// src/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { Task } from 'types';
import { LinkedinScraperService } from './puppeteer/linkedin-scraper.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private linkedinScraperService: LinkedinScraperService
  ) { }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }

  async enrichUserWithLinkedIn(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user || !user.linkedInUrl) return;

    const scraped = await this.linkedinScraperService.scrapeProfile(user.linkedInUrl);
    if (!scraped) {
      throw new BadRequestException('Failed to scrape LinkedIn profile');
    }
    console.log("Scraped data:", scraped);

    user.linkedinFullName = scraped.fullName || '';
    user.linkedinHeadline = scraped.headline || '';
    try {
      await user.save();
    } catch (error) {
      console.error('Error saving user:', error);
      throw new BadRequestException('Failed to save LinkedIn data');
    }

  }

  async addTaskToUser(email: string, task: any) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    const alreadyExists = user.taskList.some(t => t.title === task.title);
    if (alreadyExists) {
      throw new BadRequestException('Task with this title already exists');
    }

    user.taskList.push(task);
    return user.save();
  }

  async deleteTaskFromUser(email: string, task: any) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }


    user.taskList = user.taskList.filter(t => t.title !== task.title);


    return user.save();
  }

  async updateTask(email: string, data: { oldTitle: string;[key: string]: any }) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const taskIndex = user.taskList.findIndex(t => t.title === data.oldTitle);
    if (taskIndex === -1) {
      throw new BadRequestException('Task not found');
    }

    const { oldTitle, ...updatedTaskData } = data;
    user.taskList[taskIndex] = {
      ...user.taskList[taskIndex] ? user.taskList[taskIndex] : user.taskList[taskIndex],
      ...updatedTaskData,
    };

    return user.save();
  }

  async markTaskAsCompleted(email: string, task: Task) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const taskIndex = user.taskList.findIndex(t => t.title === task.title);
    if (taskIndex === -1) {
      throw new BadRequestException('Task not found');
    }
    user.taskList[taskIndex].completed = true;
    return user.save();

  }
}
