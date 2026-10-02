import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.billbuddy.app',
  appName: 'BillBuddy',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3000', // For local Android emulator testing. Replace with production URL when live.
    cleartext: true
  }
};

export default config;
