import applicationData from '../../application.yaml';

export interface IConfig {
  bitpay: {
    token: string;
    notificationEmail: string;
    environment: string;
    design: {
      hero: {
        bgColor: string;
        title: string;
        body: string;
      };
      logo: string;
      posData: {
        fields: {
          type: string;
          required: boolean;
          id: string;
          name: string;
          label: string;
          currency?: string;
          options: {
            id: string;
            label: string;
            value: string;
          }[];
        }[];
      };
    };
  };
}

const config: IConfig = {
  ...applicationData,
};

export default config;
