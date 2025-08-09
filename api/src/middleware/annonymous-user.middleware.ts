import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AnonymousUserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.accessToken;

    const { accessToken } = await this.authService.signInAnnonymous(token);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24,
    });
    req.cookies.accessToken = accessToken;
    
    next();
  }
}
