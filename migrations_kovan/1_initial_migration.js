const Migrations = artifacts.require("Migrations");
// request.setTimeout(0);

module.exports = async function (deployer, networks, accounts) {
  console.log(accounts[0]);
  console.log(accounts[1]);
  console.log(accounts[2]);

  await deployer.deploy(Migrations);
};

