const Migrations = artifacts.require("Migrations");
// request.setTimeout(0);

module.exports = async function (deployer, networks, accounts) {
  admin = accounts[4];

  console.log(accounts[4]);

  await deployer.deploy(Migrations, {from: admin});
};

