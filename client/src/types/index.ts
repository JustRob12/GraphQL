export interface Country {
  code: string;
  name: string;
  capital: string;
  currency: string;
  emoji: string;
  continent: {
    name: string;
    code: string;
  };
}

export type RootStackParamList = {
  Splash: undefined;
  Countries: undefined;
  CountryDetail: { country: Country };
}; 