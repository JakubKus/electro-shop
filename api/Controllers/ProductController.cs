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
    public class ProductController : ControllerBase
    {
        private readonly DatabaseRepository _repository;

        public ProductController()
        {
            _repository = new DatabaseRepository();
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> Get()
        {
            return await _repository
                .GetCollection<Product>()
                .AsQueryable()
                .ToListAsync();
        }
        
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ProductRequest productRequest)
        {
            var newProduct = new Product(
                productRequest.Name,
                productRequest.Price,
                productRequest.Amount);
            
            await _repository.GetCollection<Product>().InsertOneAsync(newProduct);
            return Ok();
        }
        
        [HttpPut("{prodId:guid}")]
        public async Task<ActionResult> Put(Guid prodId, [FromBody] ProductRequest productRequest)
        {
            var products = _repository.GetCollection<Product>();
            var productToUpdate = await products
                .AsQueryable()
                .FirstOrDefaultAsync(x => x.Id == prodId);
                
            if (productToUpdate == null)
            {
                return BadRequest();
            }
            
            var updatedProduct = new Product(
                prodId,
                productRequest.Name,
                productRequest.Price,
                productRequest.Amount);

            await products.ReplaceOneAsync(x => x.Id == prodId, updatedProduct);

            return Ok();
        }
    }
}