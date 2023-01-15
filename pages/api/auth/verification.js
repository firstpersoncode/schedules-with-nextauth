import { getUserByID, updateUser } from "prisma/users";

export default async function verification(req, res) {
  if (req.method !== "GET") res.status(405).send();

  try {
    const { verificationId } = req.query;
    if (!verificationId) throw new Error("Verification ID required");
    const user = await getUserByID({ id: verificationId });
    if (!user) throw new Error(`User not found`);
    if (user.emailVerified)
      return res
        .status(200)
        .json({ message: "User email already verified successfully!" });

    await updateUser(verificationId, { emailVerified: new Date() });

    res.status(200).json({ message: "User email verified successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
}
