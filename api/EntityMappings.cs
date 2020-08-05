using ElectroShop.Models;
using MongoDB.Bson.Serialization;

namespace ElectroShop
{
    public static class EntityMappings
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<Product>(x => 
            {
                x.AutoMap();
                x.SetIgnoreExtraElements(true);
                x.MapIdMember(y => y.Id);
            });

            BsonClassMap.RegisterClassMap<Purchase>(x => 
            {
                x.AutoMap();
                x.SetIgnoreExtraElements(true);
                x.MapIdMember(y => y.Id);
            });
        }
    }
}