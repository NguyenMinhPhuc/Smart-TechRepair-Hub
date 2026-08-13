import { Module, Global } from '@nestjs/common';
import { RealtimeGateway } from '../infrastructure/gateways/realtime.gateway';

@Global()
@Module({
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
