import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserUtil {
  // ユーザーが入力したパスワードをハッシュ化する
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // ログインの際に入力されたパスワードとハッシュ化されたパスワードを比較する
  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // ログインの際にトークンを発行する
  static async generateToken(userId: string, userEmail: string) {
    const payload = {
      userid: userId,
      email: userEmail,
    };
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(payload, secretKey, {
      expiresIn: '1h',
    });
    return token;
  }
}
