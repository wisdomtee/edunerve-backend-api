export const generateToken = (user: any) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};