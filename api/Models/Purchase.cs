using System;
using System.Collections.Generic;

namespace ElectroShop.Models
{
    public class Purchase
    {
        public Guid Id { get; set; }
        public DateTime AddedOn { get; set; }
        public List<Product> Products { get; set; }
        
        public Purchase(List<Product> products)
        {
            Id = Guid.NewGuid();
            AddedOn = DateTime.Today;
            Products = products;
        }
    }
    
    public class PurchaseRequest
    {
        public List<ProductAmountRequest> Cart { get; set; }
    }

    public class ProductAmountRequest
    {
        public string ProductId { get; set; }
        public int Amount { get; set; }
    }
}