package BaiCoPhieu;

public class Main {
    public static void main(String[] args) {
        Stock appleStock = new Stock();

        Investor investor1 = new Investor("Alice");
        Investor investor2 = new Investor("Bob");

        appleStock.attach(investor1);
        appleStock.attach(investor2);

        appleStock.setPrice(150.5);
        appleStock.setPrice(155.0);
    }
}
