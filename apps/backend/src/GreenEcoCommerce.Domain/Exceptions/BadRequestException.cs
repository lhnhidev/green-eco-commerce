using System;
using System.Collections.Generic;
using System.Text;

namespace GreenEcoCommerce.Domain.Exceptions
{
    public class BadRequestException(string message) : Exception(message)
    {
    }
}
