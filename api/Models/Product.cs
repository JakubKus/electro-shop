using System;

namespace ElectroShop.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }

        public Product(string name, double price, int amount)
        {
            Id = Guid.NewGuid();
            Name = name;
            Price = price;
            Amount = amount;
        }

        public Product(Guid id, string name, double price, int amount)
        {
            Id = id;
            Name = name;
            Price = price;
            Amount = amount;
        }
    }

    public class ProductRequest
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
    }
}