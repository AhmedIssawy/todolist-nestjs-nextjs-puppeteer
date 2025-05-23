import { Controller, Post, Body, Res, InternalServerErrorException, Req, } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: any, @Res({ passthrough: true }) res: Response, @Req() req: Request) {

        const { token } = await this.authService.register(body);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = body

        res.status(201).json({
            message: 'User registered successfully',
        });
    }


    @Post('login')
    async login(@Body() body: any, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const { token } = await this.authService.login(body.email, body.password);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = body
        return res.status(200).json({
            message: 'User logged in successfully',
        });
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        req.user = ""
        return res.status(200).json({
            message: 'User logged out successfully',
        });
    }
}
