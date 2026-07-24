-- ============================================================
-- Seed dữ liệu THỬ CÔNG để test trang Thống kê (task #90)
-- ⚠️ CHỈ dùng cho môi trường DEV/TEST — TUYỆT ĐỐI KHÔNG chạy trên PRODUCTION.
-- Script này chèn dữ liệu đơn hàng/thanh toán GIẢ chỉ để kiểm thử giao diện.
-- KHÔNG tự chạy — chạy tay trong Supabase SQL editor / psql.
-- ------------------------------------------------------------
-- Cách dùng:
--   1) Tìm user id:  SELECT id, email FROM public.users ORDER BY created_at DESC;
--   2) Dán id vào v_user_id bên dưới.
--   3) Chạy cả block DO $$ ... $$.
-- Ghi chú: dùng 1 product CÓ SẴN (không tạo product mới) để khỏi thiếu cột NOT NULL.
--          enum lưu dạng chuỗi: orders.status / payments.status / payments.method.
-- ============================================================
DO $$
DECLARE
    v_user_id   uuid := '00000000-0000-0000-0000-000000000000'; -- << THAY bằng user id thật
    v_product   uuid;
    v_price     numeric(18,2);
    v_order     uuid;
    v_created   timestamptz;
    v_status    text;
    v_paystatus text;
    v_qty       int;
    k           int;
    -- 12 tháng, trạng thái đa dạng để donut nhiều màu
    statuses    text[] := ARRAY['Delivered','Delivering','Packing','Pending','Delivered','Cancelled',
                                 'Delivered','Delivering','Packing','Delivered','Pending','Delivered'];
BEGIN
    -- Lấy 1 product đang bán để gắn order item
    SELECT id, price INTO v_product, v_price
    FROM public.products
    WHERE is_active = true
    ORDER BY id
    LIMIT 1;

    IF v_product IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy product nào trong public.products';
    END IF;

    -- (A) 12 đơn rải đều 12 tháng gần nhất
    FOR k IN 0..11 LOOP
        v_order   := gen_random_uuid();
        v_created := now() - make_interval(months => k);
        v_status  := statuses[k + 1];
        v_qty     := 1 + (k % 3);

        -- COD chưa trả cho đơn 'Pending'; đơn 'Cancelled' coi như thanh toán thất bại; còn lại 'Paid'
        v_paystatus := CASE v_status
                          WHEN 'Pending'   THEN 'Pending'
                          WHEN 'Cancelled' THEN 'Failed'
                          ELSE 'Paid'
                       END;

        INSERT INTO public.orders (id, user_id, status, delivery_address, discount_amount, earned_points, created_at)
        VALUES (v_order, v_user_id, v_status, 'Seed address #' || k, 0, 0, v_created);

        INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price, unit_co2_saved)
        VALUES (gen_random_uuid(), v_order, v_product, v_qty, v_price, 1.25);

        INSERT INTO public.payments (id, order_id, method, status, amount, transaction_ref, created_at)
        VALUES (gen_random_uuid(), v_order,
                CASE WHEN v_paystatus = 'Pending' THEN 'COD' ELSE 'Bank' END,
                v_paystatus, v_price * v_qty, 'SEED-' || v_order, v_created);
    END LOOP;

    -- (B) 1 đơn ĐÃ HUỶ nhưng ĐÃ THANH TOÁN (Paid) → test badge "Đang chờ hoàn: 35.000đ"
    v_order := gen_random_uuid();
    INSERT INTO public.orders (id, user_id, status, delivery_address, discount_amount, earned_points, created_at)
    VALUES (v_order, v_user_id, 'Cancelled', 'Seed refund-pending', 0, 0, now() - make_interval(days => 3));

    INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price, unit_co2_saved)
    VALUES (gen_random_uuid(), v_order, v_product, 1, 35000, 0.75);

    INSERT INTO public.payments (id, order_id, method, status, amount, transaction_ref, created_at)
    VALUES (gen_random_uuid(), v_order, 'MoMo', 'Paid', 35000, 'SEED-REFUND-' || v_order, now() - make_interval(days => 3));

    RAISE NOTICE 'Seed xong cho user %', v_user_id;
END $$;

-- Dọn dẹp nếu cần (xoá mọi đơn seed của user):
-- DELETE FROM public.orders WHERE delivery_address LIKE 'Seed %' AND user_id = '<USER_ID>';