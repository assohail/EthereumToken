# Prepairing for the Deployment   
1)Set the project for the deployment of the contracts on the Network\
2)Deploy the contracts on the Network\
3)Prepare the project for the Frontend\
4)Make changes in the bs-config file (Comment 1st 2 lines incase you wanna run it locally)\
5)Added the lite-server key-value from dev-dependecies object to dependencies object in package.json file\
6)Create Procfile (Heroku specific file to tell Heroku run the commands defined in it)\
7)Deploy the Frontend on the Cloud

## Tasks Remaining
- [x] selfdestruct token contract
- [] set totalSupply to zero in token contract
- [] initialSupply strategy, decimals
- [] shift tokenPrice to the token contract
- [] move from node 14.17.6 to latest
- [] error of address payable(admin) in tokenSale.sol
- [] work on failed test
- [x] tokensSold issue
- [] endSale functionality frontend 

## Project Setup
```
git clone https://github.com/assohail/EthereumToken.git
npm install
npm install -g truffle
-> start ganache, [for use in terminal](https://www.npmjs.com/package/ganache)
truffle migrate
npm start
```

```
asdf list all nodejs
asdf install nodejs 14.17.6
asdf install nodejs latest:16
```