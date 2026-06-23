using Microsoft.Extensions.Configuration;

namespace ApiRestSharpTests.Tests.Config;

public class TestSettings
{
    public string BaseUrl { get; set; } = string.Empty;
    public int TimeoutSeconds { get; set; } = 30;

    private static readonly Lazy<TestSettings> LazyInstance = new(Load);
    public static TestSettings Instance => LazyInstance.Value;

    private static TestSettings Load()
    {
        var environment = Environment.GetEnvironmentVariable("TEST_ENVIRONMENT") ?? "test";

        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("Config/appsettings.json", optional: false)
            .AddJsonFile($"Config/appsettings.{environment}.json", optional: true)
            .AddJsonFile($"Config/appsettings.{environment}.local.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var settings = new TestSettings();
        configuration.GetSection("ApiSettings").Bind(settings);
        return settings;
    }
}