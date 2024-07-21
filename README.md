# CoachTicketManagement
 
# CTM

Ứng dụng hỗ trợ quản lý việc bán vé xe của nhà xe

## 1. Mô tả 

Đề tài này tập trung vào việc phát triển một hệ thống quản lý bán vé xe khách hiệu quả. Hệ thống này sẽ ghi nhận thông tin hành
khách, đặt chỗ và chọn ghế, tính giá vé, xuất vé , quản lý thanh toán và tài chính, cung cấp báo cáo và thống kê. Mục tiêu là tăng cường
trải nghiệm của hành khách và cung cấp thông tin quản lý để đưa ra quyết định chiến lược và tối ưu hoá hoạt động kinh doanh.


### 2. Mục đích, yêu cầu, người dùng hướng tới của đề tài

#### Mục đích

* Tăng cường trải nghiệm của khách hàng: Hệ thống quản lý bán vé xe khách nhằm cung cấp một trải nghiệm tốt hơn cho khách hàng khi mua vé.
* Tối ưu hoá quy trình bán vé: Hệ thống quản lý bán vé xe khách giúp cải thiện hiệu suất và hiệu quả của quy trình bán vé.
* Quản lý tài chính và tăng cường khả năng cạnh tranh: Hệ thống cung cấp công cụ quản lý tài chính mạnh mẽ, giúp theo dõi doanh thu, chi phí và lợi nhuận từ việc bán vé.
* Đảm bảo tính chính xác và tin cậy: Hệ thống quản lý bán vé xe khách giúp đảm bảo tính chính xác và tin cậy trong việc ghi nhận, xử lý và lưu trữ thông tin.
* Tăng cường quản lý nội bộ: Hệ thống quản lý bán vé xe khách cung cấp công cụ quản lý thông tin khách hàng và giao dịch, giúp nhân viên quản lý dễ dàng truy cập và xử lý thông tin

#### Yêu cầu

* UI/UX hợp lý, rõ ràng, thuận tiện cho người sử dụng.
* Đáp ứng đầy đủ những nghiệp vụ về bán vé xe

* Ứng dụng có những tính năng cơ bản. 

* Phân chia quyền hạn rõ ràng. 

#### Người dùng

* Nhà xe 

* Người muốn đặt vé xe khách

### 3. Tổng quan sản phẩm

#### 3.1 Chức năng
<details>
  <summary>Chức năng chung</summary>
 
- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Tìm kiếm chuyến xe
- Đặt vé xe
- Báo cáo lỗi
- Chỉnh sửa thông tin tài khoản

</details>

  ###### Admin (Quản trị viên)

  <details>
    <summary>Quản lý toàn bộ danh sách các tuyến đường</summary>

  - Tìm kiếm
  - Sắp xếp
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý toàn bộ danh sách các xe của nhà xe</summary>

  - Tìm kiếm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý toàn bộ danh sách các lịch trình trong hệ thống</summary>

  - Tìm kiếm
  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý nhân viên trong nhà xe</summary>

  - Tìm kiếm
  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý các mã giảm giá trong hệ thống</summary>

  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Thống kê doanh thu</summary>

   - Xem chi tiết

  </details>

  <details>
    <summary>Quản lý các tài khoản trong hệ thống</summary>

  - Tìm kiếm
  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa
  - Cấp quyền (Manager, Coach Assitant, Driver)

  </details>


  ###### Manager 

  <details>
    <summary>Quản lý toàn bộ danh sách nhân viên của nhà xe</summary>

  - Tìm kiếm
  - Sắp xếp
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý toàn bộ danh sách các lịch trình </summary>

  - Tìm kiếm
  - Sắp xếp
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý các vé của các user</summary>

  - Xác nhận vé
  - Hủy vé
  - Xem chi tiết

  </details>

  <details>
    <summary>Quản lý danh sách các xe trong nhà xe</summary>

  - Xem chi tiết

  </details>


  ###### Driver
<details>
<summary>Quản lý lịch làm việc </summary>

  - Tìm kiếm
  - Sắp xếp
  - Xem chi tiết

  </details>


###### Coach Assistant
<details>
<summary>Quản lý lịch làm việc </summary>

  - Tìm kiếm
  - Sắp xếp
  - Xem chi tiết

  </details>

  <details>
    <summary>Kiểm tra vé khách hàng</summary>

  - Xem chi tiết
  - Scan vé
  - Nhắc 

  </details>



#### 3.2 Công nghệ sử dụng

- Công cụ: Visual Studio Code, My SQL, Github Desktop, Firebase, Trello, Figma
- Ngôn ngữ lập trình: Java Script, TSQL, Node JS
- Thư viện: React Native, Express JS

## 4. Hướng dẫn cài đặt
<details>
    <summary>Đối với người dùng</summary>

  * Dowload phần mềm Expo Go tại.
    * Google Play:  https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US
    * App Store: https://apps.apple.com/us/app/expo-go/id982107779
  * Scan QR code bằng Expo app tại: 
</details>

<details>
    <summary>Đối với nhà phát triển</summary>

  * Dowload, giải nén phần mềm
    * Github: https://github.com/tuonghuynh11/CoachTicketManagementApp
  * Cài đặt database
    * Khuyến nghị sử dụng các dịch vụ đám mây như Azure, AWS,… để sử dụng tất cả tính năng hiện có của chương trình  (server đi kèm với chương trình đã đóng).
  * Khởi tạo Database bằng cách chạy script chứa trong file Seed.sql
    * Tải file script tại: https://drive.google.com/drive/folders/19dLylv-vX3-xv_FsNEGTmDLlKu8OiHTl?usp=share_link
  * Kết nối với Database vừa tạo bằng cách thay đổi connectionStrings trong file .env tại thư mục server.
  * Đăng nhập với vai trò admin
      * tên đăng nhập: admin
      * mật khẩu: 12345

</details>

## 5. UI
<img src="https://github.com/user-attachments/assets/cbe6d94b-03c5-4683-b088-67a456f544ed" width="250" height="590">
<img src="https://github.com/user-attachments/assets/67b7a0e3-3947-41c7-be08-3495821aa8e0" width="250" height="590">
<img src="https://github.com/user-attachments/assets/bfdffff3-25a3-4dd4-a580-bb54a6ddc873" width="250" height="590">
<img src="https://github.com/user-attachments/assets/1e049bdf-2d3d-460d-a140-4a008c4e137f" width="250" height="590">
<img src="https://github.com/user-attachments/assets/e9d29848-1fd6-40c9-b1ce-51e0930d3d55" width="250" height="590">
<img src="https://github.com/user-attachments/assets/4a129191-c190-4df9-ae5f-9de4f06f4c56" width="250" height="590">
<img src="https://github.com/user-attachments/assets/02cc561e-bd64-43fd-b5c7-74f573047da1" width="250" height="590">
<img src="https://github.com/user-attachments/assets/e2c133f6-22cd-42bc-a94d-3eb7c82ef933" width="250" height="590">
<img src="https://github.com/user-attachments/assets/b7ce49fc-4502-41b5-abce-b1bbc7c86b0a" width="250" height="590">
<img src="https://github.com/user-attachments/assets/875d4a8a-9bc8-4c00-9b71-b871c06adcca" width="250" height="590">

## 6. Hướng dẫn sử dụng

* Video demo: 

## 7. Tác giả

| STT | MSSV     | Họ và tên                                                  | Lớp      | 
| --- | -------- | ---------------------------------------------------------- | -------- | 
| 1   | 21520123| [Huỳnh Mạnh Tường](https://github.com/tuonghuynh11)           | KTPM2021 | 
| 2   | 21520341| [Dương Ngọc Mẫn](https://github.com/DNM03)              | KTPM2021 | 
| 3   | 21520613| [Nguyễn Hoàng Quốc Bảo](https://github.com/QuocBaoKho) | KTPM2021 | 
| 4   | 21520839| [Nguyễn Thái Công](https://github.com/thai-cong-nguyen)         	  | KTPM2021 |
* Sinh viên khoa Công nghệ Phần mềm, trường Đại học Công nghệ Thông tin, Đại học Quốc gia thành phố Hồ Chí Minh.

## 8. Giảng viên hướng dẫn

* Cô Huỳnh Hồ Thị Mộng Trinh, giảng viên Khoa Công Nghệ Phần Mềm, trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh.
