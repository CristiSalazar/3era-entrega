import jwt from 'jsonwebtoken';

export function generateAndSetToken(res, email, password) {
  const token = jwt.sign({ email, password, role: "user" }, "Secret-key", { expiresIn: "12h" });
  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  return token
}

//l