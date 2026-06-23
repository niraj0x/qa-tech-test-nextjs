
using System.Text.Json.Serialization;

namespace ApiRestSharpTests.Tests.Models;

public class Image
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("image")]
    public string ImageUrl { get; set; } = string.Empty;

    public List<string> Keywords { get; set; } = new();
    public DateTime UploadDate { get; set; }
}