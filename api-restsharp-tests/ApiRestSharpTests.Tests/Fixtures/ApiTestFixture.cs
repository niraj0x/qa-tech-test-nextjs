using ApiRestSharpTests.Tests.Clients;

namespace ApiRestSharpTests.Tests.Fixtures;

public class ApiTestFixture : IDisposable
{
    public BaseApiClient Client { get; }

    public ApiTestFixture()
    {
        Client = new BaseApiClient();
    }

    public void Dispose() => Client.Dispose();
}
