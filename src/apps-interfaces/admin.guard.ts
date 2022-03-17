import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/security/auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.get('authorization');
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return new Promise(async function (resolve) {
      if (!authorization) {
        return resolve(false);
      }
      const authHeaderValues = authorization.split(' ');
      if (authHeaderValues.length != 2) {
        return resolve(false);
      }

      const token = authHeaderValues[1];
      that.authService
        .verifyAccessToken({ accessToken: token })
        .then((verificationResult) => {
          resolve(
            verificationResult != null && verificationResult.role === 'admin'
              ? true
              : false,
          );
        });
    });
  }
}
