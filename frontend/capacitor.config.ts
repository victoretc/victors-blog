import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'guru.qa.bookclub',
  appName: 'book-club-ui',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true, 
    },
  },
};

export default config;
