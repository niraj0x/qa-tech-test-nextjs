using System.Net;
using ApiRestSharpTests.Tests.Builders;
using ApiRestSharpTests.Tests.Clients;
using ApiRestSharpTests.Tests.Fixtures;
using ApiRestSharpTests.Tests.Models;

namespace ApiRestSharpTests.Tests.Tests;

public class ImageTests : IClassFixture<ApiTestFixture>
{
    private readonly BaseApiClient _client;

    public ImageTests(ApiTestFixture fixture)
    {
        _client = fixture.Client;
    }

    [Fact]
    public async Task GetImages_ReturnsImages_WithStatus200()
    {
        var response = await _client.GetAsync<List<Image>>("/api/images");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(response.Data);
        Assert.NotEmpty(response.Data);
    }

    [Fact]
    public async Task GetImages_FilterByKeyword_ReturnsMatchingImages()
    {
        var queryParams = new Dictionary<string, string> { ["keyword"] = "book" };

        var response = await _client.GetAsync<List<Image>>("/api/images", queryParams);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(response.Data);
        Assert.NotEmpty(response.Data);
        Assert.All(response.Data, image => Assert.Contains("book", image.Keywords, StringComparer.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetImages_FilterByKeyword_NoMatch_ReturnsEmptyList()
    {
        var queryParams = new Dictionary<string, string> { ["keyword"] = "no_match_xxxxxx" };

        var response = await _client.GetAsync<List<Image>>("/api/images", queryParams);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(response.Data);
        Assert.Empty(response.Data);
    }

    [Fact]
    public async Task CreateImage_WithValidPayload_ReturnsCreatedImage()
    {
        var request = new CreateImageRequestBuilder().Build();

        var response = await _client.PostAsync<Image>("/api/images", request);

        try
        {
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            Assert.NotNull(response.Data);
            Assert.False(string.IsNullOrEmpty(response.Data.Id));
            Assert.Equal(request.Title, response.Data.Title);
            Assert.Equal(request.Image, response.Data.ImageUrl);
            Assert.Equal(request.Keywords, response.Data.Keywords);
        }
        finally
        {
            await DeleteIfCreatedAsync(response.Data);
        }
    }

    [Fact]
    public async Task CreateImage_MissingTitle_ReturnsBadRequest()
    {
        var request = new CreateImageRequestBuilder().WithoutTitle().Build();

        var response = await _client.PostAsync<object>("/api/images", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateImage_MissingImage_ReturnsBadRequest()
    {
        var request = new CreateImageRequestBuilder().WithoutImage().Build();

        var response = await _client.PostAsync<object>("/api/images", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateImage_MissingKeywords_ReturnsBadRequest()
    {
        var request = new CreateImageRequestBuilder().WithoutKeywords().Build();

        var response = await _client.PostAsync<object>("/api/images", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateImage_MissingUploadDate_ReturnsBadRequest()
    {
        // uploadDate is required by the real API even though the OpenAPI spec doesn't document it (confirmed by probing).
        var request = new CreateImageRequestBuilder().WithoutUploadDate().Build();

        var response = await _client.PostAsync<object>("/api/images", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DeleteImage_ExistingId_ReturnsOk()
    {
        var createRequest = new CreateImageRequestBuilder().Build();
        var createResponse = await _client.PostAsync<Image>("/api/images", createRequest);
        Assert.NotNull(createResponse.Data);

        var queryParams = new Dictionary<string, string> { ["id"] = createResponse.Data.Id };
        var deleteResponse = await _client.DeleteAsync<object>("/api/images", queryParams);

        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteImage_NonexistentId_ReturnsNotFound()
    {
        var queryParams = new Dictionary<string, string> { ["id"] = "nonexistent-id-12345" };

        var response = await _client.DeleteAsync<object>("/api/images", queryParams);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private async Task DeleteIfCreatedAsync(Image? createdImage)
    {
        if (createdImage == null || string.IsNullOrEmpty(createdImage.Id))
        {
            return;
        }

        var queryParams = new Dictionary<string, string> { ["id"] = createdImage.Id };
        await _client.DeleteAsync<object>("/api/images", queryParams);
    }
}
