using MongoDB.Driver;

namespace ElectroShop
{
    public class DatabaseRepository
    {
        private readonly IMongoDatabase _database;

        public DatabaseRepository()
        {
            MongoDefaults.GuidRepresentation = MongoDB.Bson.GuidRepresentation.Standard;
            
            var client = new MongoClient("mongodb://localhost:27017");
            _database = client.GetDatabase("ElectroShop");
        }

        public IMongoCollection<T> GetCollection<T>()
        {
            return _database.GetCollection<T>(typeof(T).Name);
        }
    }
}