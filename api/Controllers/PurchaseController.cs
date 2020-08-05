using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ElectroShop.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace ElectroShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PurchaseController: ControllerBase
    {
        private readonly DatabaseRepository _repository;

        public PurchaseController()
        {
            _repository = new DatabaseRepository();
        }

        [HttpGet]
        public async Task<ActionResult<List<Purchase>>> Get()
        {
            return await _repository.GetCollection<Purchase>().AsQueryable().ToListAsync();
        }
        
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PurchaseRequest purchaseRequest)
        {
            var productsList = _repository.GetCollection<Product>();
            var productsInCart = new List<Product>();

            foreach (var cartProduct in purchaseRequest.Cart)
            {
                var productGuid = Guid.Parse(cartProduct.ProductId);
                var product = await productsList
                    .AsQueryable()
                    .FirstOrDefaultAsync(x => x.Id == productGuid);

                if (product.Amount < cartProduct.Amount || cartProduct.Amount <= 0)
                {
                    return BadRequest();
                }
                
                var decreasedAmountProduct = new Product(
                    product.Id,
                    product.Name,
                    product.Price,
                    product.Amount - cartProduct.Amount);

                await productsList
                    .ReplaceOneAsync(x => x.Id == productGuid, decreasedAmountProduct);
                
                productsInCart.Add(new Product(
                    product.Id,
                    product.Name,
                    product.Price,
                    cartProduct.Amount));
            }

            var newPurchase = new Purchase(productsInCart);
            await _repository
                .GetCollection<Purchase>()
                .InsertOneAsync(newPurchase);

            return Ok();
        }

        [HttpDelete("{purchaseId:guid}")]
        public async Task<ActionResult> Delete(Guid purchaseId)
        {
            var purchases = _repository.GetCollection<Purchase>();
            var products = _repository.GetCollection<Product>();
            var purchase = await purchases.AsQueryable().FirstOrDefaultAsync(x => x.Id == purchaseId);

            foreach (var cartProduct in purchase.Products)
            {
                var product = await products
                    .AsQueryable()
                    .FirstOrDefaultAsync(x => x.Id == cartProduct.Id);
                
                var increasedAmountProduct = new Product(
                    cartProduct.Id,
                    cartProduct.Name,
                    cartProduct.Price,
                    product.Amount + cartProduct.Amount);
                
                await products.ReplaceOneAsync(x => x.Id == product.Id, increasedAmountProduct);
            }

            await purchases.DeleteOneAsync(x => x.Id == purchaseId);
            return Ok();
        }
    }
}