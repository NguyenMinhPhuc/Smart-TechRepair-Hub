import { Controller, Get, Render } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Public()
@Controller('login')
export class AuthViewController {
  @Get()
  @Render('auth/login')
  loginPage() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng nhập — Smart TechRepair Hub',
    };
  }
}
