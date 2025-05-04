import bcryptjs from "bcryptjs";

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

function getSauce(password) {
  const pepper = process.env.PEPPER || "any";
  return password + pepper;
}

async function hash(password) {
  const rounds = getNumberOfRounds();
  const pepperPassword = getSauce(password);
  return await bcryptjs.hash(pepperPassword, rounds);
}

async function compare(providedPassword, storedPassword) {
  const pepperPassword = getSauce(providedPassword);
  return await bcryptjs.compare(pepperPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
