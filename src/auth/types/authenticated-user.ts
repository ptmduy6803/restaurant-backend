export interface AuthenticatedUser {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN';
}
