export default async function hello(req, res) {
  res.status(200).json({ data: "Hello" });
}
