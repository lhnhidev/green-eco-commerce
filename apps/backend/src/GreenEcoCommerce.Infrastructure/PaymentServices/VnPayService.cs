using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using GreenEcoCommerce.Application.Interfaces.Payments;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.Infrastructure.PaymentServices;

public class VnPayService(IConfiguration configuration) : IVnPayService
{
    private readonly string tmnCode = configuration["VnPay:TmnCode"] ?? string.Empty;
    private readonly string hashSecret = configuration["VnPay:HashSecret"] ?? string.Empty;
    private readonly string payUrl = configuration["VnPay:PayUrl"] ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private readonly string returnUrl = configuration["VnPay:ReturnUrl"] ?? string.Empty;

    public string CreatePaymentUrl(string transactionRef, decimal amount, string orderInfo, string ipAddress)
    {
        // VNPay requires the amount in VND with no decimal places, multiplied by 100
        // (e.g. 100,000 VND is sent as "10000000").
        long vnpAmount = (long)Math.Round(amount * 100, MidpointRounding.AwayFromZero);

        var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"] = "2.1.0",
            ["vnp_Command"] = "pay",
            ["vnp_TmnCode"] = tmnCode,
            ["vnp_Amount"] = vnpAmount.ToString(CultureInfo.InvariantCulture),
            ["vnp_CurrCode"] = "VND",
            ["vnp_TxnRef"] = transactionRef,
            ["vnp_OrderInfo"] = orderInfo,
            ["vnp_OrderType"] = "other",
            ["vnp_Locale"] = "vn",
            ["vnp_ReturnUrl"] = returnUrl,
            ["vnp_IpAddr"] = ipAddress,
            // VNPay Sandbox validates this against server time in the Asia/Ho_Chi_Minh (UTC+7) zone.
            ["vnp_CreateDate"] = DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(7)).ToString("yyyyMMddHHmmss"),
        };

        string query = BuildSignableQueryString(vnpParams);
        string secureHash = HmacSha512(hashSecret, query);

        return $"{payUrl}?{query}&vnp_SecureHash={secureHash}";
    }

    public bool ValidateSignature(IDictionary<string, string> vnpParams)
    {
        if (!vnpParams.TryGetValue("vnp_SecureHash", out var receivedHash) || string.IsNullOrEmpty(receivedHash))
        {
            return false;
        }

        var signParams = new SortedDictionary<string, string>(StringComparer.Ordinal);
        foreach (var kv in vnpParams)
        {
            if (kv.Key is "vnp_SecureHash" or "vnp_SecureHashType") continue;
            if (string.IsNullOrEmpty(kv.Value)) continue;
            signParams[kv.Key] = kv.Value;
        }

        string query = BuildSignableQueryString(signParams);
        string computedHash = HmacSha512(hashSecret, query);

        return string.Equals(computedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
    }

    // Matches VNPay's official sample algorithm exactly: WebUtility.UrlEncode (not Uri.EscapeDataString)
    // on both key and value, joined with '&', keys sorted ordinally — this precise encoding is what
    // VNPay's own server re-derives and compares against, so any deviation breaks signature validation.
    private static string BuildSignableQueryString(SortedDictionary<string, string> vnpParams) =>
        string.Join('&', vnpParams.Select(kv => $"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}"));

    private static string HmacSha512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        var sb = new StringBuilder(hashBytes.Length * 2);
        foreach (byte b in hashBytes) sb.Append(b.ToString("x2"));
        return sb.ToString();
    }
}
