export type Role = "user" | "owner" | "admin";

const demoUsers = [
  { email: "user@gmail.com", password: "123456", role: "user" },
  { email: "owner@gmail.com", password: "123456", role: "owner" },
  { email: "admin@gmail.com", password: "123456", role: "admin" },
];

export function demoLogin(email: string, password: string, role: Role) {
  return demoUsers.find(
    (u) => u.email === email && u.password === password && u.role === role
  );
}