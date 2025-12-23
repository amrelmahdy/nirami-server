import { Body, Controller, Get, Put } from '@nestjs/common';
import { Setting } from './schemas/setting.schema';
import { SettingsService } from './settings.service';
import { EditDepartmentDto } from '../departments/dtos/edit-department-dto';
import { EditSettingsDto } from './dtos/edit-settings-dto';

@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) { }

    @Get()
    getAllSettings(): Promise<Setting> {
        return this.settingsService.getAllSettings();
    }


    @Put()
    updateSettings(@Body() setting: EditSettingsDto): Promise<Setting> {
        return this.settingsService.updateSettings(setting);
    }

}
