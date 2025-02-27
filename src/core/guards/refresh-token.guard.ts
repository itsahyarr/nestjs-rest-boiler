import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    // if (context.getType() === 'http') {
    //   const req = context.switchToHttp().getRequest();
    //   return req;
    // }
    const req = context.switchToHttp().getRequest();
    return req;
    // const ctx = GqlExecutionContext.create(context);
    // return ctx.getContext().req;
  }
}
