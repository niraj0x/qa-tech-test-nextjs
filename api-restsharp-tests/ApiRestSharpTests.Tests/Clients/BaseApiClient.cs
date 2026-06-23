using System.Text.Json;
using ApiRestSharpTests.Tests.Config;
using RestSharp;
using RestSharp.Serializers.Json;

namespace ApiRestSharpTests.Tests.Clients;

public class BaseApiClient : IDisposable
{
    private readonly RestClient _client;

    public BaseApiClient()
    {
        var options = new RestClientOptions(TestSettings.Instance.BaseUrl)
        {
            Timeout = TimeSpan.FromSeconds(TestSettings.Instance.TimeoutSeconds)
        };

        _client = new RestClient(options);
    }

    public Task<RestResponse<T>> GetAsync<T>(string resource, Dictionary<string, string>? queryParams = null)
        => ExecuteAsync<T>(resource, Method.Get, queryParams: queryParams);

    public Task<RestResponse<T>> PostAsync<T>(string resource, object body)
        => ExecuteAsync<T>(resource, Method.Post, body: body);

    public Task<RestResponse<T>> DeleteAsync<T>(string resource, Dictionary<string, string>? queryParams = null)
        => ExecuteAsync<T>(resource, Method.Delete, queryParams: queryParams);

    private Task<RestResponse<T>> ExecuteAsync<T>(string resource, Method method, Dictionary<string, string>? queryParams = null, object? body = null)
    {
        var request = new RestRequest(resource, method);

        if (queryParams is not null)
        {
            foreach (var (key, value) in queryParams)
            {
                request.AddQueryParameter(key, value);
            }
        }

        if (body is not null)
        {
            request.AddJsonBody(body);
        }

        return _client.ExecuteAsync<T>(request);
    }

    public void Dispose() => _client.Dispose();
}
