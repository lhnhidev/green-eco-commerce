namespace GreenEcoCommerce.WebAPI.OpenApi;

public class ApiDocStorage
{
    public static readonly Dictionary<string, ApiEndpointDoc> Endpoints = new()
    {
        // Khóa Key cấu trúc: [Tên Controller]_[Tên Hàm Action]
        ["Auth_Register"] = new ApiEndpointDoc
        {
            Description = """
                Đăng ký tài khoản dựa vào thông tin gửi lên. Đăng ký thành công thì gửi về một id của người dùng đã đăng ký
                
                ### Dữ liệu gửi lên mẫu:
                ```json
                {
                    "firstName": "Nguyễn",
                    "lastName": "Văn A",
                    "phone": "0811125678",
                    "address": "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
                    "role": "User",
                    "email": "annguynnn111@greeneco.com",
                    "password": "SecurePassword123jfdlkjkl!"
                }
                ```
                """,
            Responses = new()
            {
                ["200"] = "Đăng ký người dùng thành công.",
                ["400"] = "Dữ liệu không hợp lệ. Sai định dạng Email/Phone hoặc thông tin đã tồn tại.",
                ["500"] = "Lỗi hệ thống."
            }
        }
    };
}
