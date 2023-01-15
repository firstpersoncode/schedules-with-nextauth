import db from "./db";

export async function getUser({ email }) {
  try {
    await db.$connect();
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    await db.$disconnect();
    return user;
  } catch (err) {
    await db.$disconnect();
    throw err;
  }
}

export async function getUserByID({ id }) {
  try {
    await db.$connect();
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    await db.$disconnect();
    return user;
  } catch (err) {
    await db.$disconnect();
    throw err;
  }
}

export async function createUser({ name, email, password }) {
  try {
    await db.$connect();
    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    await db.$disconnect();
    return user;
  } catch (err) {
    await db.$disconnect();
    throw err;
  }
}

export async function updateUser(id, data) {
  try {
    await db.$connect();
    const user = await db.user.update({
      where: {
        id,
      },
      data,
    });
    await db.$disconnect();
    return user;
  } catch (err) {
    await db.$disconnect();
    throw err;
  }
}
