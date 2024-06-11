import React from "react";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import MenuFooter from "./MenuFooter";
import Social from "./Social";
import { navData } from "../header/navData";

const Footer = () => {
  return (
    <footer className="w-full bg-bgPrimary">
      <div className="w-full h-full pt-[70px]">
        <div className="flex gap-[20px] h-full mx-auto max-w-[1230px] border-solid border-b-[1px] border-[#dae1e7]">
          <div className="w-[25%] px-[15px] pb-[30px]">
            <h3 className="text-white text-[20px] font-semibold mb-[10px] uppercase">
              Giới thiệu
            </h3>
            <div className="w-[50px] h-[3px] my-[16px] bg-red-600"></div>
            <ul className="text-[14px] text-[#a4a4a4]">
              Chào mừng bạn đến với ShoesPlus! Tại đây, mỗi một dòng chữ, mỗi
              chi tiết và hình ảnh đều là những bằng chứng mang dấu ấn lịch sử
              Converse 100 năm, và đang không ngừng phát triển lớn mạnh.
            </ul>
          </div>

          <div className="w-[25%] px-[15px] pb-[30px]">
            <h3 className="text-white text-[20px] font-semibold mb-[10px] uppercase">
              Địa chỉ
            </h3>
            <div className="w-[50px] h-[3px] my-[16px] bg-red-600"></div>
            <ul className="text-[14px] text-[#a4a4a4]">
              <li className="flex gap-[10px] mb-[6px] list-none">
                <FontAwesomeIcon
                  className="text-white/75 text-[18px] mt-[5px]"
                  icon={faMapMarkerAlt}
                />
                <p>Km10, Đường Nguyễn Trãi, Hà Đông, Hà Nội</p>
              </li>
              <li className="flex gap-[10px] mb-[6px] list-none">
                <FontAwesomeIcon
                  className="text-white/75 text-[18px] mt-[5px]"
                  icon={faPhoneAlt}
                />
                <p>
                  <a
                    className="hover:text-primary transition-all"
                    href="tel:0912316304"
                  >
                    0912316304
                  </a>
                </p>
              </li>
              <li className="flex gap-[10px] mb-[6px] list-none">
                <FontAwesomeIcon
                  className="text-white/75 text-[18px] mt-[5px]"
                  icon={faEnvelope}
                />
                <p>
                  <a
                    className="hover:text-primary transition-all"
                    href="mailto:ShoesPlus@gmail.com"
                  >
                    ShoesPlus@gmail.com
                  </a>
                </p>
              </li>
              <li className="flex gap-[10px] mb-[6px] list-none">
                <FontAwesomeIcon
                  className="text-white/75 text-[18px] mt-[5px]"
                  icon={faTwitter}
                />
                <p>
                  <a
                    className="hover:text-primary transition-all"
                    href="skype:ShoesPlus?chat"
                  >
                    ShoesPlus
                  </a>
                </p>
              </li>
            </ul>
          </div>

          <div className="w-[25%] px-[15px] pb-[30px]">
            <h3 className="text-white text-[20px] font-semibold mb-[10px] uppercase">
              Menu
            </h3>
            <div className="w-[50px] h-[3px] my-[16px] bg-red-600"></div>
            {/* xuong man hinh nho thi them gap-x-3 */}
            <ul className="grid  grid-cols-2 text-[14px] text-[#a4a4a4]">
              {navData.map((nav, idx) => (
                <MenuFooter key={nav.name} name={nav.name} to={nav.to} />
              ))}
            </ul>
          </div>

          <div className="w-[25%] px-[15px] pb-[30px]">
            <h3 className="text-white text-[20px] font-semibold mb-[10px] uppercase">
              Mạng xã hội
            </h3>
            <div className="w-[50px] h-[3px] my-[16px] bg-red-600"></div>
            <ul className="text-[14px] text-[#a4a4a4]">
              <Social
                color={"#3a589d"}
                icon={faFacebookF}
                href="https://fb.com/duchaudeyy"
              />
              <Social
                color={"#3b6995"}
                icon={faInstagram}
                href="https://fb.com/duchaudeyy"
              />
              <Social
                color={"#2478ba"}
                icon={faTwitter}
                href="https://fb.com/duchaudeyy"
              />
              <Social
                color={"#ff0303"}
                icon={faYoutube}
                href="https://fb.com/duchaudeyy"
              />
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-cre">
        <p className="w-full text-center pt-[10px] pb-[15px] text-white/50">
          © Bản quyền thuộc về{" "}
          <a className="text-white/80" href="https://fb.com/duchaudeyy">
            {" "}
            ShoesPlus
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
