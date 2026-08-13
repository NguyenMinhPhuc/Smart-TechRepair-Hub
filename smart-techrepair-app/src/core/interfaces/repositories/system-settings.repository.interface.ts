export interface SystemStoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  storeLogoUrl: string;
  taxCode: string;
  receiptFooterNote: string;
}

export interface ISystemSettingsRepository {
  getSettings(): Promise<SystemStoreSettings>;
  updateSettings(settings: Partial<SystemStoreSettings>): Promise<SystemStoreSettings>;
  resetSystemData(): Promise<void>;
}

export const SYSTEM_SETTINGS_REPOSITORY = 'ISystemSettingsRepository';
