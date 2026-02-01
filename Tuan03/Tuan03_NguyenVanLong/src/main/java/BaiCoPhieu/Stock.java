package BaiCoPhieu;

public class Stock extends Subject{
    private double price;

    public void setPrice(double price) {
        this.price = price;
        notifyObservers(price);
    }
}
