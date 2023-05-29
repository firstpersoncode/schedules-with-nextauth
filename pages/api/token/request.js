import { makeDBConnection } from "prisma/db";
import validateEmail from "utils/validateEmail";

export default async function reqToken(req, res) {
  if (req.method !== "POST") return res.status(405).send();
  const { email } = req.body;
  if (!email || !validateEmail(email)) return res.status(401).send();

  try {
    await makeDBConnection(async (db) => {
      await db.requestToken.create({
        data: {
          email,
        },
      });
    });

    res.status(200).json({ message: "Token requested successfully!", email });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
