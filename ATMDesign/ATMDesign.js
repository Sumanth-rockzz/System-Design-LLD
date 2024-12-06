// ATM Class
class ATM {
    constructor(atmID, location, bank) {
        this.atmID = atmID;
        this.location = location;
        this.bank = bank;
        this.cardReader = new CardReader();
        this.cashDispenser = new CashDispenser();
        this.screen = new Screen();
        this.printer = new Printer();
        this.depositSlot = new DepositSlot();
    }

    startTransaction(card, pin, transactionType, amount = 0) {
        if (this.cardReader.readCard(card)) {
            if (this.cardReader.verifyPin(card, pin)) {
                this.screen.displayMessage("Authentication Successful.");
                switch (transactionType) {
                    case "Withdraw":
                        if (this.bank.performWithdraw(card.accountNumber, amount)) {
                            this.cashDispenser.dispense(amount);
                            this.printer.printReceipt({ type: "Withdraw", amount });
                        } else {
                            this.screen.displayMessage("Insufficient funds.");
                        }
                        break;

                    case "Deposit":
                        this.depositSlot.acceptDeposit(amount);
                        this.bank.performDeposit(card.accountNumber, amount);
                        this.printer.printReceipt({ type: "Deposit", amount });
                        break;

                    case "BalanceInquiry":
                        const balance = this.bank.getBalance(card.accountNumber);
                        this.screen.displayMessage(`Current Balance: $${balance}`);
                        break;

                    default:
                        this.screen.displayMessage("Invalid Transaction Type.");
                }
            } else {
                this.screen.displayMessage("Invalid PIN.");
            }
        } else {
            this.screen.displayMessage("Card not recognized.");
        }
    }
}

// CardReader Class
class CardReader {
    readCard(card) {
        return card instanceof Card; // Validate card
    }

    verifyPin(card, enteredPin) {
        return card.pin === enteredPin; // PIN Verification
    }
}

// CashDispenser Class
class CashDispenser {
    dispense(amount) {
        console.log(`Dispensing $${amount}.`);
    }
}

// Screen Class
class Screen {
    displayMessage(message) {
        console.log(message);
    }
}

// Printer Class
class Printer {
    printReceipt(transaction) {
        console.log(`Receipt: Transaction Type: ${transaction.type}, Amount: $${transaction.amount}`);
    }
}

// DepositSlot Class
class DepositSlot {
    acceptDeposit(amount) {
        console.log(`Deposited $${amount}.`);
    }
}

// Bank Class
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
        if (account && account.withdraw(amount)) {
            return true;
        }
        return false;
    }

    performDeposit(accountNumber, amount) {
        const account = this.accounts.get(accountNumber);
        if (account) {
            account.deposit(amount);
        }
    }

    getBalance(accountNumber) {
        const account = this.accounts.get(accountNumber);
        return account ? account.getBalance() : 0;
    }
}

// Account Class
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

// Card Class
class Card {
    constructor(cardNumber, pin, accountNumber) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
    }
}

// Example Usage
const bank = new Bank("Global Bank");

// Setup accounts and cards
const account1 = new Account("123456", 5000);
bank.addAccount(account1);
const card1 = new Card("9876543210", "1234", "123456");

// Setup ATM
const atm = new ATM("ATM001", "Main Street", bank);

// Transactions
atm.startTransaction(card1, "1234", "Withdraw", 300);
atm.startTransaction(card1, "1234", "Deposit", 200);
atm.startTransaction(card1, "1234", "BalanceInquiry");
