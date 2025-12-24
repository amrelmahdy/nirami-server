import { Injectable, NotFoundException } from '@nestjs/common';
import { Setting } from './schemas/setting.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Setting.name) private settingsModel: mongoose.Model<Setting>
    ) { }


    async getAllSettings(): Promise<Setting> {
        const settings = await this.settingsModel.findOne();
        if (!settings) {
            return this.settingsModel.create({
                aboutUs: {
                    en: '',
                    ar: ''
                },
                ourStory: {
                    en: '',
                    ar: ''
                },
                returnAndExchangePolicy: {
                    en: '',
                    ar: ''
                },
                contactWhatsapp: '',
                contactPhone: '',
                contactEmail: '',
            });
        }
        return settings;
    }


    async updateSettings(setting: Setting): Promise<Setting> {
        const updatedSettings = await this.settingsModel.findOneAndReplace({}, setting, { new: true });
        if (!updatedSettings) {
            throw new NotFoundException("Setting not found");
        }
        return updatedSettings;
    }
}
