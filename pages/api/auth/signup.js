import { genSalt, hash } from "bcrypt";
import { makeDBConnection } from "prisma/db";
import transporter from "services/transporter";
import validateEmail from "utils/validateEmail";
import validatePassword from "utils/validatePassword";

export default async function signup(req, res) {
  if (req.method !== "POST") res.status(405).send();
  try {
    const { name, email, password } = req.body;
    if (!validateEmail(email)) throw new Error("Invalid email");
    if (!validatePassword(password))
      throw new Error(
        "Password must contain at least 1 lowercase, 1 uppercase, 1 numeric character, 1 special character, and minimum of 8 characters long"
      );

    const newUser = await makeDBConnection(async (db) => {
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (user)
        throw new Error(
          `User with email <strong>${email}</strong> already exists`
        );

      const salt = await genSalt(10);
      const encryptedPassword = await hash(password, salt);
      return await db.user.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_TRANSPORTER,
      to: email,
      subject: "[App Schedules] Verify your email address",
      html: `<p>Click the link below to verify your email</p><a href="${process.env.URL}/auth?verificationId=${newUser.id}">Verify</a>`,
    });
    res.status(200).json({ message: "User created successfully!" });
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.toString());
  }
}
