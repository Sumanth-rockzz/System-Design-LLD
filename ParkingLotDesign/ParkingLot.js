//Parking Lot Design

// ParkingLot Class
class ParkingLot {
  constructor(name, address) {
    this.name = name;
    this.address = address;
    this.floors = [];
    this.entryPanels = [];
    this.exitPanels = [];
  }

  addFloor(floor) {
    this.floors.push(floor);
  }

  addEntryPanel(panel) {
    this.entryPanels.push(panel);
  }

  addExitPanel(panel) {
    this.exitPanels.push(panel);
  }
}

// ParkingFloor Class
class ParkingFloor {
  constructor(floorNumber) {
    this.floorNumber = floorNumber;
    this.spots = [];
    this.displayBoard = new ParkingDisplayBoard(floorNumber);
  }

  addParkingSpot(spot) {
    this.spots.push(spot);
  }

  updateDisplayBoard() {
    const availability = this.spots.reduce((acc, spot) => {
      acc[spot.type] = acc[spot.type] || 0;
      if (spot.isAvailable) acc[spot.type]++;
      return acc;
    }, {});
    this.displayBoard.updateAvailability(availability);
  }
}

// ParkingSpot Class
class ParkingSpot {
  constructor(id, type, floorNumber, hasElectricPanel = false) {
    this.id = id;
    this.type = type;
    this.isAvailable = true;
    this.floorNumber = floorNumber;
    this.hasElectricPanel = hasElectricPanel;
  }

  occupy() {
    this.isAvailable = false;
  }

  release() {
    this.isAvailable = true;
  }
}

// Account Class
class Account {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role; // "Admin" or "ParkingAttendant"
  }
}

// ParkingTicket Class
class ParkingTicket {
  constructor(ticketId, vehicle, spot, entryTime) {
    this.ticketId = ticketId;
    this.vehicle = vehicle;
    this.spot = spot;
    this.entryTime = entryTime;
    this.isPaid = false;
  }

  pay() {
    this.isPaid = true;
  }
}

// Vehicle Class
class Vehicle {
  constructor(licensePlate, type) {
    this.licensePlate = licensePlate;
    this.type = type; // "Car", "Truck", "Electric", "Van", "Motorcycle"
  }
}

// EntrancePanel Class
class EntrancePanel {
  constructor(id) {
    this.id = id;
  }

  generateTicket(vehicle, spot) {
    const ticket = new ParkingTicket(
      `${vehicle.licensePlate}-${Date.now()}`,
      vehicle,
      spot,
      new Date()
    );
    spot.occupy();
    return ticket;
  }
}

// ExitPanel Class
class ExitPanel {
  constructor(id) {
    this.id = id;
  }

  processPayment(ticket, paymentMethod, parkingRate) {
    const duration = (new Date() - ticket.entryTime) / (1000 * 60 * 60); // in hours
    const fee = parkingRate.calculateFee(duration);
    console.log(`Payment of $${fee} received via ${paymentMethod}`);
    ticket.pay();
    ticket.spot.release();
    return fee;
  }
}

// Payment Class
class Payment {
  constructor(ticketId, amount, method) {
    this.ticketId = ticketId;
    this.amount = amount;
    this.method = method; // "Cash" or "CreditCard"
  }
}

// ParkingRate Class
class ParkingRate {
  static calculateFee(duration) {
    if (duration <= 1) return 4;
    if (duration <= 3) return 4 + (duration - 1) * 3.5;
    return 4 + 2 * 3.5 + (duration - 3) * 2.5;
  }
}

// ParkingDisplayBoard Class
class ParkingDisplayBoard {
  constructor(floorNumber) {
    this.floorNumber = floorNumber;
    this.availability = {};
  }

  updateAvailability(availability) {
    this.availability = availability;
    this.display();
  }

  display() {
    console.log(`Floor ${this.floorNumber} Availability:`, this.availability);
  }
}

// ParkingAttendantPortal Class
class ParkingAttendantPortal {
  constructor(id) {
    this.id = id;
  }

  processTicket(ticket, paymentMethod = "CASH", parkingRate) {
    const duration = (new Date() - ticket.entryTime) / (1000 * 60 * 60); // in hours
    const fee = parkingRate.calculateFee(duration);
    ticket.pay();
    console.log(
      `Ticket ID: ${ticket.ticketId} processed. Fee: $${fee} Through ${paymentMethod}`
    );
    ticket.spot.release();
  }
}

// CustomerInfoPortal Class
class CustomerInfoPortal {
  constructor(id) {
    this.id = id;
  }

  payTicket(ticket, paymentMethod, parkingRate) {
    const duration = (new Date() - ticket.entryTime) / (1000 * 60 * 60); // in hours
    const fee = parkingRate.calculateFee(duration);
    ticket.pay();
    console.log(
      `Payment of $${fee} completed at Customer Info Portal via ${paymentMethod}`
    );
  }
}

// ElectricPanel Class
class ElectricPanel {
  constructor(id) {
    this.id = id;
  }

  processPayment(ticket, parkingRate, chargingFee) {
    const duration = (new Date() - ticket.entryTime) / (1000 * 60 * 60); // in hours
    const parkingFee = parkingRate.calculateFee(duration);
    const totalFee = parkingFee + chargingFee;
    console.log(`Electric Panel: Payment of $${totalFee} completed.`);
    ticket.pay();
  }
}

// Example Usage
const lot = new ParkingLot("City Center Parking", "123 Main Street");
const floor1 = new ParkingFloor(1);
lot.addFloor(floor1);

floor1.addParkingSpot(new ParkingSpot(1, "Compact", 1));
floor1.addParkingSpot(new ParkingSpot(2, "Large", 1));
floor1.addParkingSpot(new ParkingSpot(3, "Electric", 1, true));

floor1.updateDisplayBoard();

const entrancePanel = new EntrancePanel(1);
const vehicle = new Vehicle("ABC123", "Compact");
const spot = floor1.spots.find((s) => s.type === "Compact" && s.isAvailable);
const ticket = entrancePanel.generateTicket(vehicle, spot);
floor1.updateDisplayBoard();

const exitPanel = new ExitPanel(1);
const fee = exitPanel.processPayment(ticket, "CreditCard", ParkingRate);
floor1.updateDisplayBoard();
