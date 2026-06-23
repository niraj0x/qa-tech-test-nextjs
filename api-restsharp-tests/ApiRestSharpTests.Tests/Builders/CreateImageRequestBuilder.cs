using ApiRestSharpTests.Tests.Models;

namespace ApiRestSharpTests.Tests.Builders;

public class CreateImageRequestBuilder
{
    private string? _title = "Default Title";
    private string? _image = "https://example.com/sample-image.png";
    private List<string>? _keywords = new() { "sample", "default" };
    private DateTime? _uploadDate = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public CreateImageRequestBuilder WithTitle(string? title)
    {
        _title = title;
        return this;
    }

    public CreateImageRequestBuilder WithoutTitle() => WithTitle(null);

    public CreateImageRequestBuilder WithImage(string? image)
    {
        _image = image;
        return this;
    }

    public CreateImageRequestBuilder WithoutImage() => WithImage(null);

    public CreateImageRequestBuilder WithKeywords(params string[] keywords)
    {
        _keywords = keywords.ToList();
        return this;
    }

    public CreateImageRequestBuilder WithoutKeywords()
    {
        _keywords = null;
        return this;
    }

    public CreateImageRequestBuilder WithUploadDate(DateTime? uploadDate)
    {
        _uploadDate = uploadDate;
        return this;
    }

    public CreateImageRequestBuilder WithoutUploadDate() => WithUploadDate(null);

    public CreateImageRequest Build() => new()
    {
        Title = _title,
        Image = _image,
        Keywords = _keywords is null ? null : new List<string>(_keywords),
        UploadDate = _uploadDate
    };
}
