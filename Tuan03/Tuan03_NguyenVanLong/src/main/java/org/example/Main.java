package org.example;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {
        File file1 = new File("a.txt");
        File file2 = new File("b.txt");

        Folder folder1 = new Folder("Documents");
        folder1.add(file1);
        folder1.add(file2);

        Folder root = new Folder("Root");
        root.add(folder1);

        root.display();
    }
}