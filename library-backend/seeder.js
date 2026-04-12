const mongoose = require("mongoose");
const Book = require("./app/models/bookModel");
const Publisher = require("./app/models/publisherModel");

const DB_URL = "mongodb://localhost:27017/library-management-test";

const publishersData = [
  {
    maNXB: 1,
    tenNXB: "NXB Kim Đồng",
    diaChi: "Hoàn Kiếm, Hà Nội",
  },
  {
    maNXB: 2,
    tenNXB: "NXB Giáo Dục Việt Nam",
    diaChi: "Hoàn Kiếm, Hà Nội",
  },
  {
    maNXB: 3,
    tenNXB: "NXB Lao Động",
    diaChi: "Đống Đa, Hà Nội",
  },
  {
    maNXB: 4,
    tenNXB: "NXB Công Thương",
    diaChi: "Bắc Từ Liêm, Hà Nội",
  },
  {
    maNXB: 5,
    tenNXB: "NXB Tổng hợp thành phố Hồ Chí Minh",
    diaChi: "Quận 1, TP.HCM",
  },
];

const booksData = [
  {
    tenSach: "Harry Potter",
    tacGia: "J.K.Rowling",
    donGia: 150000,
    soQuyen: 2,
    namXuatBan: 2022,
    maNXB: 1,
    hinhAnh:
      "https://www.nxbtre.com.vn/Images/Book/nxbtre_full_21042022_030444.jpg",
  },
  {
    tenSach: "Dế Mèn Phiêu Lưu Ký",
    tacGia: "Tô Hoài",
    donGia: 50000,
    soQuyen: 20,
    namXuatBan: 2022,
    maNXB: 1,
    hinhAnh:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/576/749/products/de-men-phieu-luu-ky-phien-ban-dau-dua-tb-2021-ef4ae91d8cdf4ea88aa1d9b5b76f8c7a.jpg?v=1760789051823",
  },
  {
    tenSach: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
    tacGia: "Nguyễn Nhật Ánh",
    donGia: 70000,
    soQuyen: 10,
    namXuatBan: 2019,
    maNXB: 5,
    hinhAnh:
      "https://www.nxbtre.com.vn/Images/Book/nxbtre_full_09422022_034212.jpg",
  },
  {
    tenSach: "Tắt Đèn",
    tacGia: "Ngô Tất Tố",
    donGia: 60000,
    soQuyen: 12,
    namXuatBan: 2018,
    maNXB: 3,
    hinhAnh:
      "https://www.netabooks.vn/Data/Sites/1/Product/47931/viet-nam-danh-tac-tat-den-2.jpg",
  },
  {
    tenSach: "Số Đỏ",
    tacGia: "Vũ Trọng Phụng",
    donGia: 75000,
    soQuyen: 15,
    namXuatBan: 2019,
    maNXB: 3,
    hinhAnh: "https://cdn1.fahasa.com/media/catalog/product/s/_/s_-b1.jpg",
  },
  {
    tenSach: "Nhà Giả Kim",
    tacGia: "Paulo Coelho",
    donGia: 90000,
    soQuyen: 20,
    namXuatBan: 2021,
    maNXB: 5,
    hinhAnh:
      "https://cdn1.fahasa.com/media/flashmagazine/images/page_images/nha_gia_kim_tai_ban_2020/2024_03_20_18_29_19_1-390x510.jpg",
  },
  {
    tenSach: "Đắc Nhân Tâm",
    tacGia: "Dale Carnegie",
    donGia: 89000,
    soQuyen: 25,
    namXuatBan: 2020,
    maNXB: 5,
    hinhAnh:
      "https://cdn1.fahasa.com/media/catalog/product/d/n/dntttttuntitled.jpg?_gl=1*y4603o*_ga*MTQ3NTcyMjI2MS4xNzc1MzAzMTU3*_ga_D3YYPWQ9LN*czE3NzUzMDMxNTYkbzEkZzEkdDE3NzUzMDMzOTYkajEzJGwwJGgw*_gcl_au*NzY0OTU0OTQ4LjE3NzUzMDMxNTY.*_ga_460L9JMC2G*czE3NzUzMDMxNTYkbzEkZzEkdDE3NzUzMDMzOTckajEyJGwwJGgxNzkzODY1MTQ3",
  },
  {
    tenSach: "Quẳng Gánh Lo Đi Và Vui Sống",
    tacGia: "Dale Carnegie",
    donGia: 88000,
    soQuyen: 14,
    namXuatBan: 2019,
    maNXB: 5,
    hinhAnh:
      "https://cdn1.fahasa.com/media/catalog/product/z/2/z2602650248500_93e18e312805d6583448b61f4007a67e.jpg",
  },
  {
    tenSach: "Sapiens: Lược Sử Loài Người",
    tacGia: "Yuval Noah Harari",
    donGia: 198000,
    soQuyen: 10,
    namXuatBan: 2018,
    maNXB: 5,
    hinhAnh:
      "https://cdn1.fahasa.com/media/catalog/product/8/9/8935270702973---copy_1.jpg?_gl=1*h49mbh*_ga*MTQ3NTcyMjI2MS4xNzc1MzAzMTU3*_ga_D3YYPWQ9LN*czE3NzUzMDMxNTYkbzEkZzEkdDE3NzUzMDM0NjkkajI2JGwwJGgw*_gcl_au*NzY0OTU0OTQ4LjE3NzUzMDMxNTY.*_ga_460L9JMC2G*czE3NzUzMDMxNTYkbzEkZzEkdDE3NzUzMDM0NjkkajI2JGwwJGgxNzkzODY1MTQ3",
  },
  {
    tenSach: "Homo Deus",
    tacGia: "Yuval Noah Harari",
    donGia: 210000,
    soQuyen: 8,
    namXuatBan: 2019,
    maNXB: 5,
    hinhAnh:
      "https://cdn1.fahasa.com/media/catalog/product/h/o/homo_deus_a_brief_history_of_tomorrow_1_2019_01_21_16_03_24.jpg",
  },

  {
    tenSach: "Clean Code",
    tacGia: "Robert C. Martin",
    donGia: 180000,
    soQuyen: 7,
    namXuatBan: 2019,
    maNXB: 2,
    hinhAnh:
      "https://cdn1.fahasa.com/media/catalog/product/8/9/8936107813361.jpg?_gl=1*77cd6v*_gcl_au*NzY0OTU0OTQ4LjE3NzUzMDMxNTY.*_ga*MTQ3NTcyMjI2MS4xNzc1MzAzMTU3*_ga_D3YYPWQ9LN*czE3NzUzMDMxNTYkbzEkZzEkdDE3NzUzMDM1NDUkajIwJGwwJGgw*_ga_460L9JMC2G*czE3NzUzMDMxNTYkbzEkZzEkdDE3NzUzMDM1NDYkajE5JGwwJGgxNzkzODY1MTQ3",
  },
  {
    tenSach: "Marketing Căn Bản",
    tacGia: "Philip Kotler",
    donGia: 130000,
    soQuyen: 9,
    namXuatBan: 2019,
    maNXB: 4,
    hinhAnh:
      "https://salt.tikicdn.com/cache/750x750/ts/product/e6/30/15/f04495630c3c7f4a2e9f457c5474c1be.jpg.webp",
  },
  {
    tenSach: "Tâm Lý Học Đám Đông",
    tacGia: "Gustave Le Bon",
    donGia: 85000,
    soQuyen: 13,
    namXuatBan: 2018,
    maNXB: 3,
    hinhAnh:
      "https://www.netabooks.vn/Data/Sites/1/Product/24175/tam-ly-hoc-dam-dong-tai-ban-2020-01.jpg",
  },
  {
    tenSach: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ",
    tacGia: "Trác Nhã",
    donGia: 79000,
    soQuyen: 17,
    namXuatBan: 2020,
    maNXB: 3,
    hinhAnh:
      "https://cdn1.fahasa.com/media/catalog/product/8/9/8936067605693.jpg",
  },
  {
    tenSach: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    tacGia: "Rosie Nguyễn",
    donGia: 69000,
    soQuyen: 16,
    namXuatBan: 2019,
    maNXB: 5,
    hinhAnh:
      "https://www.netabooks.vn/Data/Sites/1/Product/2625/tuoi-tre-dang-gia-bao-nhieu-01.jpg",
  },
];

async function seedBooks() {
  try {
    await mongoose.connect(DB_URL);
    console.log("✓ Đã kết nối MongoDB");

    // Thêm/cập nhật các NXB
    console.log("\n--- Cập nhật Nhà Xuất Bản ---");
    for (const pub of publishersData) {
      const existingPub = await Publisher.findOne({ maNXB: pub.maNXB });
      if (!existingPub) {
        await Publisher.create(pub);
        console.log(`Đã thêm NXB: ${pub.tenNXB} (Mã: ${pub.maNXB})`);
      } else {
        console.log(`NXB đã tồn tại: ${pub.tenNXB} (Mã: ${pub.maNXB})`);
      }
    }

    // Lấy maSach lớn nhất hiện có (đang có mã 1, bắt đầu từ 2)
    const lastBook = await Book.findOne().sort({ maSach: -1 });
    let currentMaSach = lastBook ? lastBook.maSach + 1 : 2;
    console.log(`\n--- Thêm Sách ---`);
    console.log(`✓ Bắt đầu từ mã sách: ${currentMaSach}`);

    // Thêm hoặc cập nhật từng cuốn sách
    for (const bookData of booksData) {
      const existingBook = await Book.findOne({ tenSach: bookData.tenSach });

      if (!existingBook) {
        const newBook = await Book.create({
          maSach: currentMaSach++,
          ...bookData,
        });
        const pub = publishersData.find((p) => p.maNXB === newBook.maNXB);
        console.log(
          `✓ Đã thêm: ${newBook.tenSach} (Mã: ${newBook.maSach}) - NXB: ${pub.tenNXB}`,
        );
      } else {
        // Nếu dữ liệu đã thay đổi thì update, nếu không thì giữ nguyên.
        const hasChanges =
          existingBook.tacGia !== bookData.tacGia ||
          existingBook.donGia !== bookData.donGia ||
          existingBook.soQuyen !== bookData.soQuyen ||
          existingBook.namXuatBan !== bookData.namXuatBan ||
          existingBook.maNXB !== bookData.maNXB ||
          existingBook.hinhAnh !== bookData.hinhAnh;

        if (hasChanges) {
          existingBook.tacGia = bookData.tacGia;
          existingBook.donGia = bookData.donGia;
          existingBook.soQuyen = bookData.soQuyen;
          existingBook.namXuatBan = bookData.namXuatBan;
          existingBook.maNXB = bookData.maNXB;
          existingBook.hinhAnh = bookData.hinhAnh;

          await existingBook.save();
          const pub = publishersData.find(
            (p) => p.maNXB === existingBook.maNXB,
          );
          console.log(
            `Đã cập nhật: ${existingBook.tenSach} (Mã: ${existingBook.maSach}) - NXB: ${pub?.tenNXB || existingBook.maNXB}`,
          );
        } else {
          console.log(`Không thay đổi: ${existingBook.tenSach}`);
        }
      }
    }

    console.log("\n Hoàn thành seed dữ liệu!");
    console.log(`Tổng số sách trong DB: ${await Book.countDocuments()}`);
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Đã đóng kết nối");
  }
}

seedBooks();
