// Industry ID type
export type IndustryId = 'general' | 'coach' | 'restaurant' | 'ecommerce';

// Industry theme interface
export interface IndustryTheme {
  primary: string;
  secondary: string;
  icon: string;
  bgColor: string;
  headerColor: string;
}

// Industry configuration interface
export interface IndustryConfig {
  name: string;
  theme: IndustryTheme;
  samplePrompts: string[];
}

// Industry configurations type
export type IndustryConfigs = {
  [key in IndustryId]: IndustryConfig;
}; 