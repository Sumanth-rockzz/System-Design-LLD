//First List Down Requirements

/* SIMPLE PARKING LOT
1.ParkingLot
2.ParkingFloor
3.ParkingSpot
4.ParkingDisplayBoard
5.ParkingTicket
6.Vehicles
7.EntryGate - Issue Ticket
8.ExitGate - Collect Ticket
9.ParkingRate
 */

class ParkingLot {
  constructor(name, location) {
    this.name = name;
    this.location = location;
    this.floors = [];
    this.entranceGates = [];
    this.exitGates = [];
  }

  addFloor(floor) {
    this.floors.push(floor);
  }
  addEntryGate(entryGate) {
    this.entranceGates.push(entryGate);
  }

  addExitGate(exitGate) {
    this.exitGates.push(exitGate);
  }
}

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

class ParkingSpot {
  constructor(id, floorNumber, type) {
    this.id = id;
    this.floorNumber = floorNumber;
    this.type = type;
    this.isAvailable = true;
  }
  assignSpot() {
    this.isAvailable = false;
  }
  unassignSpot() {
    this.isAvailable = false;
  }
}

class ParkingTicket {
  constructor(ticketId, vehicle, spot, entryTime) {
    this.ticketId = ticketId;
    this.vehicle = vehicle;
    this.spot = spot;
    this.entryTime = new Date();
    this.isPaid = false;
  }

  pay() {
    this.isPaid = true;
  }
}

class ParkingRate {
  static calculateFee(duration) {
    if (duration <= 1) return 4;
    if (duration <= 3) return 4 + (duration - 1) * 3.5;
    return 4 + 2 * 3.5 + (duration - 3) * 2.5;
  }
}

class Vehicle {
  constructor(vehicleNumber, type) {
    this.vehicleNumber = vehicleNumber;
    this.type = type;
  }
}

class EntranceGate {
  constructor(id) {
    this.id = id;
  }
  issueTicket(vehicle, spot) {
    const ticket = new ParkingTicket(1, vehicle, spot);

    ticket.spot.assignSpot();
    return ticket;
  }
}

class ExitGate {
  constructor(id) {
    this.id = id;
  }
  collectTicketPayment(ticket, paymentMethod = "CASH") {
    const duration = (new Date() - ticket.entryTime) / (1000 * 60 * 60);
    const fee = ParkingRate.calculateFee(duration);
    ticket.pay();
    console.log(
      `Ticket ID: ${ticket.ticketId} processed. Fee: ${fee} Rs Through ${paymentMethod}`
    );
    ticket.spot.unassignSpot();
  }
}

const lot = new ParkingLot("Hustle Hub", "HSR layout");
const floor1 = new ParkingFloor(1);
lot.addFloor(floor1);

floor1.addParkingSpot(new ParkingSpot(1, 1, "Compact"));
floor1.addParkingSpot(new ParkingSpot(2, 1, "Large"));
floor1.addParkingSpot(new ParkingSpot(3, 1, "Electric", true));

floor1.updateDisplayBoard();

const vehicle = new Vehicle("KA14EP7428", "Compact");
const spot = floor1.spots.find((s) => s.type === "Compact" && s.isAvailable);

const ticket = new EntranceGate(1).issueTicket(vehicle, spot);

floor1.updateDisplayBoard();

//Collect Ticket"
new ExitGate(1).collectTicketPayment(ticket);
floor1.updateDisplayBoard();
