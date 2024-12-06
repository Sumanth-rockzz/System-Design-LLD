class Bank {
  constructor(name) {
    this.name = name;
    this.accounts = new Map();
  }

  addAccount(account) {
    this.accounts.set(account.accountNumber, account);
  }

  performWithdraw(accountNumber, amount) {
    const account = this.accounts.get(accountNumber);
    account.withdraw(amount);
    if (account && account.withdraw(amount)) {
      return true;
    }
    return false;
  }

  performDeposit(accountNumber, amount) {
    const account = this.accounts.get(accountNumber);
    account.deposit(amount);
  }

  getBalance(accountNumber) {
    const account = this.accounts.get(accountNumber);
    return account ? account.getBalance() : 0;
  }
}

class Account {
  constructor(accountNumber, balance) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }
  withdraw(amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  deposit(amount) {
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}

class CashDispenser {
  dispense(amount) {
    console.log(`Dispensing $${amount}.`);
  }
}

class CashDepositSlot {
  deposit(amount) {
    console.log(`Deposited $${amount}.`);
  }
}

class Screen {
  displayMessage(message) {
    console.log(message);
  }
}

class Printer {
  printReceipt(transaction) {
    console.log(
      `Receipt: Transaction Type: ${transaction.type}, Amount: $${transaction.amount}`
    );
  }
}

class CardReader {
  readCard(card) {
    return card instanceof Card;
  }

  verifyPin(card, enteredPin) {
    return card.pin === enteredPin;
  }
}

class Card {
  constructor(cardNumber, pin, accountNumber) {
    this.cardNumber = cardNumber;
    this.pin = pin;
    this.accountNumber = accountNumber;
  }
}

class ATM {
  constructor(atmId, bank, location) {
    this.atmId = atmId;
    this.bank = bank;
    this.location = location;
    this.cardReader = new CardReader();
    this.cashDispenser = new CashDispenser();
    this.cashDepositSlot = new CashDepositSlot();
    this.screen = new Screen();
    this.printer = new Printer();
  }

  startTransaction(card, pin, transactionType, amount = 0) {
    if (this.cardReader.readCard(card)) {
      if (this.cardReader.verifyPin(card, pin)) {
        console.log("Successfully Verified PIN");
        switch (transactionType) {
          case "withdraw":
            if (this.bank.performWithdraw(card.accountNumber, amount)) {
              this.cashDispenser.dispense(amount);
              this.printer.printReceipt({ type: "Withdraw", amount });
            } else {
              this.screen.displayMessage("Insufficient funds.");
            }
            break;
          case "deposit":
            this.bank.performDeposit(card.accountNumber, amount);
            this.cashDepositSlot.deposit(amount);
            this.printer.printReceipt({ type: "Deposit", amount });
            break;
          case "balance":
            this.bank.getBalance();
            this.printer.printReceipt({ type: "Balance", amount });
            this.screen.displayMessage("Card not recognized.");
            break;
          case "transfer":
            console.log("Currently this service is unavailable Server Issue");
            break;
          default:
            this.screen.displayMessage("Invalid Transaction Type.");
        }
      } else {
        console.log("Invalid Pin");
      }
    } else {
      this.screen.displayMessage("Card not recognized.");
    }
  }
}

const bank = new Bank("Bank Of Baroda");
const account = new Account(12345, 1000);
bank.addAccount(account);
const card = new Card(123456789, 1001, 12345);
const atm = new ATM(1, bank, "Bengaluru");

atm.startTransaction(card, 1001, "withdraw", 300);
atm.startTransaction(card, 1001, "deposit", 200);
atm.startTransaction(card, 1001, "balance");
