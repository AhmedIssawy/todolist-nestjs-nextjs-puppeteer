import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async register(userData: any) {
        const existing = await this.userService.findByEmail(userData.email);
        if (existing) throw new BadRequestException('Email already exists. Try to login.');

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = await this.userService.create({
            ...userData,
            password: hashedPassword,
        });

        const payload = { email: newUser.email, sub: newUser._id };
        const token = this.jwtService.sign(payload);

        return { token };
    }


    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user._id, email: user.email };
        const token = this.jwtService.sign(payload);
        

        return { token };
    }
}
