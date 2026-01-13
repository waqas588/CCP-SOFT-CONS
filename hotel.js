package com.ccp.hotel.enums;

public enum RoomKind {
    SINGLE, DOUBLE, SUITE
}

package com.ccp.hotel.value;

public class Money {
    private final double amount;

    public Money(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }
}
package com.ccp.hotel.value;

public class Identity {
    private final String id;

    public Identity(String id) {
        if (id == null || id.isBlank())
            throw new IllegalArgumentException("Identity cannot be empty");
        this.id = id;
    }

    public String getId() {
        return id;
    }
}
package com.ccp.hotel.domain;

public class Guest {
    private final String name;
    private final String addressDetails;

    private Guest(String name, String addressDetails) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Guest name required");
        this.name = name;
        this.addressDetails = addressDetails;
    }

    public static Guest create(String name, String address) {
        return new Guest(name, address);
    }

    public String getName() {
        return name;
    }
}
package com.ccp.hotel.domain;

import com.ccp.hotel.enums.RoomKind;
import com.ccp.hotel.value.Money;

public class RoomType {
    private final RoomKind kind;
    private final Money cost;

    public RoomType(RoomKind kind, Money cost) {
        if (kind == null || cost == null)
            throw new IllegalArgumentException("Invalid room type");
        this.kind = kind;
        this.cost = cost;
    }
}
package com.ccp.hotel.domain;

import java.time.LocalDate;

public class Reservation {
    private final LocalDate reservationDate;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final int number;

    private Reservation(LocalDate start, LocalDate end, int number) {
        if (start.isAfter(end))
            throw new IllegalArgumentException("Invalid dates");
        this.reservationDate = LocalDate.now();
        this.startDate = start;
        this.endDate = end;
        this.number = number;
    }

    public static Reservation create(LocalDate start, LocalDate end, int number) {
        return new Reservation(start, end, number);
    }
}
package com.ccp.hotel.domain;

import java.util.ArrayList;
import java.util.List;

public class Hotel {
    private final String name;
    private final List<Room> rooms = new ArrayList<>();

    public Hotel(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Hotel name required");
        this.name = name;
    }

    public void addRoom(Room room) {
        rooms.add(room);
    }

    public boolean available() {
        return rooms.stream().anyMatch(r -> !r.isOccupied());
    }

    public Reservation createReservation() {
        if (!available())
            throw new IllegalStateException("No rooms available");
        return Reservation.create(
                java.time.LocalDate.now(),
                java.time.LocalDate.now().plusDays(1),
                rooms.size()
        );
    }
}
package com.ccp.hotel.domain;

import com.ccp.hotel.value.Identity;

public class ReservorPayer {
    private final Identity id;

    private ReservorPayer(Identity id) {
        this.id = id;
    }

    public static ReservorPayer create(Identity id) {
        if (id == null)
            throw new IllegalArgumentException("Identity required");
        return new ReservorPayer(id);
    }
}
package com.ccp.hotel.domain;

import java.util.ArrayList;
import java.util.List;

public class HotelChain {
    private final List<Hotel> hotels = new ArrayList<>();

    public void addHotel(Hotel hotel) {
        hotels.add(hotel);
    }

    public Reservation makeReservation(Hotel hotel) {
        return hotel.createReservation();
    }

    public void cancelReservation() {
        // business rule placeholder
    }

    public void checkInGuest(Room room, Guest guest) {
        room.createGuest(guest);
    }

    public void checkOutGuest(Room room) {
        room.createGuest(null);
    }
}
package com.ccp.hotel;

import com.ccp.hotel.domain.*;

public class Main {
    public static void main(String[] args) {

        Hotel hotel = new Hotel("Pearl Continental");
        Room room1 = new Room(101);
        hotel.addRoom(room1);

        HotelChain chain = new HotelChain();
        chain.addHotel(hotel);

        Guest guest = Guest.create("Ali", "Lahore");

        chain.checkInGuest(room1, guest);

        System.out.println("Room occupied: " + room1.isOccupied());
    }
}
package com.ccp.hotel.domain;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class RoomTest {

    @Test
    void roomShouldBeOccupiedAfterGuestAssigned() {
        Room room = new Room(1);
        Guest guest = Guest.create("Test", "Address");

        room.createGuest(guest);

        assertTrue(room.isOccupied());
    }
}
