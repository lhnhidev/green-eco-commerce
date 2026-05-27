namespace GreenEcoCommerce.WebAPI.OpenApi
{
    public class ApiEndpointDoc
    {
        public string Description { get; set; } = string.Empty;
        public Dictionary<string, string> Responses { get; set; } = new();
    }
}
