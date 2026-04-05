export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  xp: number;
  level: number;
  streakCount: number;
  totalCO2: number;
  credits: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
