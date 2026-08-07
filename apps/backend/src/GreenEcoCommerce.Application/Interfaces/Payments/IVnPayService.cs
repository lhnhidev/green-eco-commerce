namespace GreenEcoCommerce.Application.Interfaces.Payments;

public interface IVnPayService
{
    string CreatePaymentUrl(string transactionRef, decimal amount, string orderInfo, string ipAddress);

    bool ValidateSignature(IDictionary<string, string> vnpParams);
}
