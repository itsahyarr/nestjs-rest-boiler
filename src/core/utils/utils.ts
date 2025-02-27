import * as argon2 from 'argon2';

export async function passwordHash(plain: string): Promise<string> {
  return await argon2.hash(plain, {
    secret: Buffer.from(process.env.PASSWORD_SECRET),
  });
}

export async function passwordVerify(
  hashed: string,
  plain: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hashed, plain, {
      secret: Buffer.from(process.env.PASSWORD_SECRET),
    });
  } catch (err) {
    throw err;
  }
}
