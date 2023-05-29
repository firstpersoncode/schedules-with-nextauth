import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";

export default async function validateToken(req, res) {
  if (req.method !== "POST") return res.status(405).send();
  const { key } = req.body;
  if (!key) return res.status(401).send();

  try {
    const validToken = await makeDBConnection(async (db) => {
      return await db.token.findUnique({
        where: {
          key,
        },
      });
    });

    if (!validToken) return res.status(401).send();
    else if (isAfter(new Date(), new Date(validToken.expiredAt)))
      return res.status(401).send();

    res.status(200).json({ message: "Token validated successfully!", key });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
