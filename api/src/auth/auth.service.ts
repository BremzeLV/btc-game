import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/types';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) { }
    
    async verifyToken(token: string) {
        return await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('app.jwtSecret', { infer: true }),
        });
    } 

    async signInAnnonymous(token?: string): Promise<{ accessToken: string }> {
        let user: User | null;

        if (token) { 
            const decodedToken = this.jwtService.decode(token);
            
            user = await this.userService.findOne({
                where: { uuid: decodedToken.uuid },
            });
        }
        
        // @ts-ignore -- complains about checking the value before assignment
        if (!user) {
        user = await this.userService.createAnonymousUser();
        }

        return {
            accessToken: await this.jwtService.signAsync({ sub: user.id, uuid: user.uuid }),
        };
    }
}
