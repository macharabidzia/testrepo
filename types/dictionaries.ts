export interface Country {
  countryId: number;
  countryName: string;
  countryDictionaryKey: string;
  sendAllowed: "Y" | "N";
  receivedAllowed: "Y" | "N";
}

export interface City {
  cityId: number;
  countryId: number;
  cityName: string;
  cityDictionaryKey: string;
  sendAllowed: "Y" | "N";
  receivedAllowed: "Y" | "N";
}
