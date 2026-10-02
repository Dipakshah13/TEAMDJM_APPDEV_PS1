import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.billbuddy.app',
  appName: 'BillBuddy',
  webDir: 'out',
  server: {
    url: 'http://192.168.0.117:3000', // Your computer's local Wi-Fi IP Address
    cleartext: true
  }
};

export default config;
