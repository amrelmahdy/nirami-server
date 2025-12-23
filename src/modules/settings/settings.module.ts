import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingSchema } from './schemas/setting.schema';

@Module({
  imports: [
     MongooseModule.forFeature([{ name: 'Setting', schema: SettingSchema },]),
  ],  
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
