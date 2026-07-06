# Xu So Mam Xanh

Interactive story world 3D cho tre 6-10 tuoi, dung 3 video nhan vat Bana ban gui.

## Chay trong VS Code

1. Mo folder nay trong VS Code.
2. Chay file `run-local.cmd`, hoac vao Terminal va chay lenh trong file do.
3. Mo `http://127.0.0.1:4173`.

## Trai nghiem hien co

- Game Cover / Start Screen full man hinh truoc khi vao game: cong vuon, doi co, may, nang, hoa, la bay, Bana va nut bat dau phieu luu.
- Flow game chinh sau cover: OnboardingScene, WorldMap, MissionIntro, SortingGame, GardenProgress, RewardModal.
- Flow game chinh sau cover: OnboardingScene, WorldMap, MissionIntro, MissionGame, GrowingTree, StickerAlbum, DailyGreenQuest, ParentCorner, RewardModal.
- 4 vung dat co 3 cap nhiem vu: Vuon Tai Che, Suoi Nuoc Sach, Doi Nang Luong, Nha Cua Muong Thu.
- Nhiem vu phan loai rac co the choi bang bam chon hoac keo tha; cac vung con lai co mission chon hanh dong xanh.
- Cay Mam Cua Be lon dan theo so nhiem vu hoan thanh, sticker album mo khoa dan, daily quest luu theo ngay.
- Thuong nhe: Hat Mam Xanh, sticker, huy hieu; luu bang localStorage v4.
- Hero cinematic nhieu lop: troi, may, doi co, nha nho, duong mon, hoa va Bana dan duong.
- Ban do hanh trinh voi 4 vung dat: Vuon Tai Che, Rung Tiet Kiem Nuoc, Doi Nang Luong, Ho Ban Nho.
- Moi vung gan voi mot tinh Viet Nam va mot tinh than dia diem rieng: Lam Dong, Dong Thap, Ninh Thuan, Khanh Hoa.
- Game loop don gian: gap Bana, nghe van de, chon nhiem vu, bam hanh dong dung, nhan sticker/hat mam/huy hieu.
- Bana co trang thai cam xuc va hoi thoai khich le.
- Family Quest de be tiep tuc lam mot viec xanh nho cung ba me.
- Tien trinh luu tam bang `localStorage`; khu vuon 3D thay doi khi be hoan thanh nhiem vu.

## Upload len Hostinger

Dung file ZIP o thu muc output: `xu-so-mam-xanh-hostinger.zip`.

1. Vao Hostinger > Websites > site `biofiber.vn`.
2. Mo File Manager.
3. Vao thu muc `public_html`.
4. Upload `xu-so-mam-xanh-hostinger.zip`.
5. Extract ZIP ngay trong `public_html`.
6. Dam bao `index.html`, `app.js`, `styles.css`, `assets/` nam truc tiep trong `public_html`, khong nam long trong mot folder con.
7. Bat SSL cho `biofiber.vn` neu Hostinger chua tu kich hoat.
