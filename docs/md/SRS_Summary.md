# Tóm tắt Đặc tả Yêu cầu Phần mềm (SRS)

**Tên dự án:**
**Kiến trúc:** Clean Architecture + Component-based
**Công nghệ:**

---

## Chương 1: Giới thiệu (Introduction)
- **Mục tiêu:** Xây dựng nền tảng E-commerce kết hợp AI tư vấn lối sống xanh và hệ thống tích lũy Điểm xanh (Green Points).
- **Phạm vi:** - Hệ thống bán hàng sản phẩm thân thiện môi trường.
  - Chatbot hỗ trợ kỹ thuật RAG (truy xuất tri thức).

## Chương 2: Mô tả tổng quan (Overall Description)
- **Kiến trúc tổng thể:** Client - Server.
- **Backend:** Clean Architecture 4 lớp (Domain, Application, Infrastructure, WebAPI).
- **Frontend:** React.

## Chương 3: Giao diện & Hệ thống (External Interface Requirements)
- **User Interface:**
- **Software Interface:** Tích hợp API của mô hình ngôn ngữ lớn (LLM)
- **Hardware:**
## Chương 4: Yêu cầu chức năng (Functional Requirements)
- **4.1 Quản lý Tài khoản:** Đăng ký, Đăng nhập, Profile người dùng.
- **4.2 Mua sắm & Đặt hàng:** Giỏ hàng, thanh toán.
- **4.3 Hệ thống Điểm xanh:** Tích lũy điểm từ chỉ số carbon và đổi mã giảm giá.
- **4.4 Trợ lý ảo AI:** Tư vấn xanh dựa trên Knowledge Base (RAG).
- **4.5 Quản trị (Admin):** - Quản lý sản phẩm & đơn hàng.
  - Cập nhật tri thức cho AI.
  - Thống kê doanh thu & tác động môi trường.

## Chương 5: Yêu cầu phi chức năng (Non-functional Requirements)
- **An toàn:** Cơ chế Rollback giao dịch, Fail-safe khi API bên thứ 3 lỗi.
- **Bảo mật:** Mã hóa mật khẩu (Bcrypt), JWT Session, HTTPS.
- **Chất lượng:** Độ sẵn sàng 99.5%, dễ bảo trì nhờ mã nguồn Modular.

---
## Phụ lục (Appendices)
- **Sơ đồ:** Use Case (Tổng quát/Chi tiết), ERD, CDM.
- **Công cụ quản lý:** Notion (Tài liệu), GitHub Project (Tiến độ).
