import React from 'react';

const Home = () => {

  return (
    <>
      <div className="w-content mx-auto shadow-black shadow-xl">
        {/* slide img */}
        <div className="slide-img flex items-center flex-col w-content mb-[10px] rounded-[8px] overflow-hidden relative">
          {/* slide item */}
          <input className="hidden" type="radio" name="radio-btn" id="img-1" defaultChecked />
          <img className=" w-[100%] opacity-0 aspect-[14/5] absolute scale-50" src='https://source.unsplash.com/random' />

          {/* slide item */}
          <input className="hidden" type="radio" name="radio-btn" id="img-2" />
          <img className=" w-[100%] opacity-0 aspect-[14/5] absolute scale-50" src='https://source.unsplash.com/random' />

          {/* slide item */}
          <input className="hidden" type="radio" name="radio-btn" id="img-3" />
          <img className=" w-[100%] opacity-0 aspect-[14/5] absolute scale-50" src='https://source.unsplash.com/random' />

          {/* button slide */}
          <div className="nav-dots w-[100px] h-[10px] flex absolute bottom-0">
            <label htmlFor="img-1" className="nav-dot rounded-[5px] mx-[2px] bg-slate-600 cursor-pointer transition-all duration-700 ease-in-out" id="img-dot-1"></label>
            <label htmlFor="img-2" className="nav-dot rounded-[5px] mx-[2px] bg-slate-600 cursor-pointer transition-all duration-700 ease-in-out" id="img-dot-2"></label>
            <label htmlFor="img-3" className="nav-dot rounded-[5px] mx-[2px] bg-slate-600 cursor-pointer transition-all duration-700 ease-in-out" id="img-dot-3"></label>
          </div>
        </div>
        {/* sản phẩm thương hiệu */}
        <div className="brand_products w-container grid-container">
          <div className="brand_products-item flex items-center flex-col cursor-pointer">
            <div className="bp-item-bgr my-[10px] item-bgr-color1 flex items-center justify-center w-[180px] h-[180px] bg-[#55839f] shadow shadow-[] rounded-[50%]">
              <img className="bp-item-img h-[80px] shadow-img" src="Model/img/sneaker.png" alt="" />
            </div>
            <div className="bp-item-text text-center">
              <b>Giày sneaker</b>
              <p className="text-[#fa3d3d]">1.200.000đ</p>
            </div>
            <button className="w-[120px] h-[30px] text-[10px] rounded-[15px]">Thêm vào giỏ</button>
          </div>

          <div className="brand_products-item flex items-center flex-col cursor-pointer">
            <div className="bp-item-bgr my-[10px] item-bgr-color2 flex items-center justify-center w-[180px] h-[180px] bg-[#bdbec3] shadow shadow-[] rounded-[50%]">
              <img className="bp-item-img h-[80px] shadow-img" src="Model/img/jordan.png" alt="" />
            </div>
            <div className="bp-item-text text-center">
              <b>Giày jordan</b>
              <p className="text-[#fa3d3d]">1.200.000đ</p>
            </div>
            <button className="w-[120px] h-[30px] text-[10px] rounded-[15px]">Thêm vào giỏ</button>
          </div>
          <div className="brand_products-item flex items-center flex-col cursor-pointer">
            <div className="bp-item-bgr my-[10px] item-bgr-color3 flex items-center justify-center w-[180px] h-[180px] bg-[#9d041a] shadow shadow-[] rounded-[50%]">
              <img className="bp-item-img h-[80px] shadow-img" src="Model/img/anta.png" alt="" />
            </div>
            <div className="bp-item-text text-center">
              <b>Giày anta</b>
              <p className="text-[#fa3d3d]">1.200.000đ</p>
            </div>
            <button className="w-[120px] h-[30px] text-[10px] rounded-[15px]">Thêm vào giỏ</button>
          </div>
        </div>
        {/* sản phẩm chính  */}
        <div className="main_products">
          <div className="mp-header flex justify-center border-b-2 border-black">
            <input className='hidden' type="radio" name='mp-header-btn' defaultChecked />
            <label className="cursor-pointer inline-block h-[50px] text-[.9em] font-bold leading-[50px] px-[5px] mx-[5px] text-[#868686]" htmlFor="mp-toggle-1">SẢN PHẨM MỚI</label>
            <input className='hidden' type="radio" name='mp-header-btn' />
            <label className="cursor-pointer inline-block h-[50px] text-[.9em] font-bold leading-[50px] px-[5px] mx-[5px] text-[#868686]" htmlFor="mp-toggle-2">SẢN PHẨM BÁN CHẠY</label>
            <input className='hidden' type="radio" name='mp-header-btn' />
            <label className="cursor-pointer inline-block h-[50px] text-[.9em] font-bold leading-[50px] px-[5px] mx-[5px] text-[#868686]" htmlFor="mp-toggle-3">SẢN PHẨM PHỔ BIẾN</label>
          </div>
          <div className="mp-main w-container mt-[50px]">
            <input className="hidden" type="radio" id='mp-toggle-1' name="mp-main-button" defaultChecked />
            <div className="mp-item w-container hidden justify-around" >
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/sneaker.png" />
                <div className="bp-item-text text-center">
                  <b>Giày sneaker</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/sneaker.png" />
                <div className="bp-item-text text-center">
                  <b>Giày sneaker</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/sneaker.png" />
                <div className="bp-item-text text-center">
                  <b>Giày sneaker</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/sneaker.png" />
                <div className="bp-item-text text-center">
                  <b>Giày sneaker</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
            </div>

            <input className="hidden" type="radio" id='mp-toggle-2' name="mp-main-button" />
            <div className="mp-item w-container hidden justify-around">
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/jordan.png" />
                <div className="bp-item-text text-center">
                  <b>Giày jordan</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/jordan.png" />
                <div className="bp-item-text text-center">
                  <b>Giày jordan</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/jordan.png" />
                <div className="bp-item-text text-center">
                  <b>Giày jordan</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/jordan.png" />
                <div className="bp-item-text text-center">
                  <b>Giày jordan</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
            </div>

            <input className="hidden" type="radio" id='mp-toggle-3' name="mp-main-button" />
            <div className="mp-item w-container hidden justify-around">
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
                <div className="bp-item-text text-center">
                  <b>Giày anta</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
                <div className="bp-item-text text-center">
                  <b>Giày anta</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
                <div className="bp-item-text text-center">
                  <b>Giày anta</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
              <div className="product flex items-center flex-col">
                <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
                <div className="bp-item-text text-center">
                  <b>Giày anta</b>
                  <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
                </div>
                <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div>
        {/* other product  */}
        <div className="other_products">
          <div className="op-header border-b-2 border-black">
            <p className="text-center w-content inline-block h-[50px] text-[1em] font-bold leading-[50px] px-[5px] mx-[5px] text-[#000000]">PHỤ KIỆN KHÁC</p>
          </div>
          <div className="op-main grid-container">
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
          </div>
        </div>
        {/* slideshow */}
        <div className="slideshow w-content h-[500px] bg-[#000]">
        </div>
        {/* discount product  */}
        <div className="discount_products mt-[30px]">
          <div className="dp-header border-b-2 border-black">
            <p className="text-center w-content inline-block h-[50px] text-[1em] font-bold leading-[50px] px-[5px] mx-[5px] text-[#000000]">SẢN PHẨM GIẢM GIÁ</p>
          </div>
          <div className="dp-main grid-container">
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
            <div className="product flex items-center flex-col mt-[50px]">
              <img className="h-[100px] mb-[20px]" src="Model/img/anta.png" />
              <div className="bp-item-text text-center">
                <b>Giày anta</b>
                <p className="text-[#fa3d3d] mx-[10px]">1.200.000đ</p>
              </div>
              <button className="w-[130px] bg-[#e33f3f] text-[#fff] p-[5px] mt-[10px] scale-0 transition-all duration-[0.25] ease-in">Thêm vào giỏ</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Home;