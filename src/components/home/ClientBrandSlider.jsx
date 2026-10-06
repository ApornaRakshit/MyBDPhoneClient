import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../services/api";

const API_ROOT = String(
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const mediaUrl = (value, fallback = "") => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${API_ROOT}${value}`;
  return value;
};

// Explicit local asset imports.
// Do NOT use import.meta.glob() here: the current Vite/Rolldown dependency
// scanner can fail on the original folder name/pattern. Explicit imports are
// deterministic and keep the client brand slider build-safe.
import karimMotors from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_170_karim-motors.png";
import skybuybd from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_172_Skybuybd.png";
import ovijatGroup from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_174_Ovijat-Group.png";
import boddibari from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_176_boddibari.png";
import qhLtd from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_179_QHLtd.png";
import banglayIelts from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_180_Banglay-IELTS.png";
import sbSuperDeluxe from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_181_SB-Super-Deluxe.png";
import prostutBangladesh from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_182_Prostut-Banglades.png";
import msPrangon from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_183_MSPrangon-Enterprise.png";
import computerVillage from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_184_computer-village.png";
import munsheIndustries from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_186_Munshe-Industries.png";
import morningAgro from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_187_Morning-Agro.png";
import kidsGallery from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_188_kids-gallery-shop.png";
import boiyerChowa from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_189_BoiyerChowa-ezgif.png";
import tuitionBd from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_190_Tuition-BD.png";
import megaDeals from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_191_Mega-Deals.png";
import shopBase from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_192_ShopBase.png";
import troposTours from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_193_Tropos-Tours.png";
import owaisDevelopment from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_194_OWAIS_DEVELOPMENT_AND_CONSULTANCY.png";
import orenMart from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_195_Oren-Mart.png";
import offtechIt from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_199_OffTechIT.png";
import crownShop from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_203_crownshop.png";
import greenKitchen from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_204_green-kitchen.png";
import hmEnterprise from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_207_HM-Enterprise.png";
import ecoTravels from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_208_Eco-Travels.png";
import hameshaFood from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_209_HAMESHA-FOOD.png";
import amanotFoods from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_211_Amanot-Foods.png";
import shadamonShop from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_217_Shadamon-Shop.png";
import bobbin from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_219_Bobbin.png";
import sensibleMatch from "../../assets/IP Phone Business Telephone Systems, IP Phone Telephones & Hosted PBX in Bangladesh - Alpha PBX/imgi_21_sensiblematch.png";

const localAssetMap = {
  "imgi_170_karim-motors.png": karimMotors,
  "imgi_172_Skybuybd.png": skybuybd,
  "imgi_174_Ovijat-Group.png": ovijatGroup,
  "imgi_176_boddibari.png": boddibari,
  "imgi_179_QHLtd.png": qhLtd,
  "imgi_180_Banglay-IELTS.png": banglayIelts,
  "imgi_181_SB-Super-Deluxe.png": sbSuperDeluxe,
  "imgi_182_Prostut-Banglades.png": prostutBangladesh,
  "imgi_183_MSPrangon-Enterprise.png": msPrangon,
  "imgi_184_computer-village.png": computerVillage,
  "imgi_186_Munshe-Industries.png": munsheIndustries,
  "imgi_187_Morning-Agro.png": morningAgro,
  "imgi_188_kids-gallery-shop.png": kidsGallery,
  "imgi_189_BoiyerChowa-ezgif.png": boiyerChowa,
  "imgi_190_Tuition-BD.png": tuitionBd,
  "imgi_191_Mega-Deals.png": megaDeals,
  "imgi_192_ShopBase.png": shopBase,
  "imgi_193_Tropos-Tours.png": troposTours,
  "imgi_194_OWAIS_DEVELOPMENT_AND_CONSULTANCY.png": owaisDevelopment,
  "imgi_195_Oren-Mart.png": orenMart,
  "imgi_199_OffTechIT.png": offtechIt,
  "imgi_203_crownshop.png": crownShop,
  "imgi_204_green-kitchen.png": greenKitchen,
  "imgi_207_HM-Enterprise.png": hmEnterprise,
  "imgi_208_Eco-Travels.png": ecoTravels,
  "imgi_209_HAMESHA-FOOD.png": hameshaFood,
  "imgi_211_Amanot-Foods.png": amanotFoods,
  "imgi_217_Shadamon-Shop.png": shadamonShop,
  "imgi_219_Bobbin.png": bobbin,
  "imgi_21_sensiblematch.png": sensibleMatch,
};

const DEFAULT_FALLBACK_BRANDS = [
  { id: 1, title: "Karim Motors", filename: "imgi_170_karim-motors.png" },
  { id: 2, title: "Skybuy BD", filename: "imgi_172_Skybuybd.png" },
  { id: 3, title: "Ovijat Group", filename: "imgi_174_Ovijat-Group.png" },
  { id: 4, title: "Boddibari", filename: "imgi_176_boddibari.png" },
  { id: 5, title: "QH Ltd", filename: "imgi_179_QHLtd.png" },
  { id: 6, title: "Banglay IELTS", filename: "imgi_180_Banglay-IELTS.png" },
  { id: 7, title: "SB Super Deluxe", filename: "imgi_181_SB-Super-Deluxe.png" },
  { id: 8, title: "Prostut Bangladesh", filename: "imgi_182_Prostut-Banglades.png" },
  { id: 9, title: "MS Prangon Enterprise", filename: "imgi_183_MSPrangon-Enterprise.png" },
  { id: 10, title: "Computer Village", filename: "imgi_184_computer-village.png" },
  { id: 11, title: "Munshe Industries", filename: "imgi_186_Munshe-Industries.png" },
  { id: 12, title: "Morning Agro", filename: "imgi_187_Morning-Agro.png" },
  { id: 13, title: "Kids Gallery Shop", filename: "imgi_188_kids-gallery-shop.png" },
  { id: 14, title: "Boiyer Chowa", filename: "imgi_189_BoiyerChowa-ezgif.png" },
  { id: 15, title: "Tuition BD", filename: "imgi_190_Tuition-BD.png" },
  { id: 16, title: "Mega Deals", filename: "imgi_191_Mega-Deals.png" },
  { id: 17, title: "ShopBase", filename: "imgi_192_ShopBase.png" },
  { id: 18, title: "Tropos Tours", filename: "imgi_193_Tropos-Tours.png" },
  { id: 19, title: "Owais Development", filename: "imgi_194_OWAIS_DEVELOPMENT_AND_CONSULTANCY.png" },
  { id: 20, title: "Oren Mart", filename: "imgi_195_Oren-Mart.png" },
  { id: 21, title: "OffTech IT", filename: "imgi_199_OffTechIT.png" },
  { id: 22, title: "Crown Shop", filename: "imgi_203_crownshop.png" },
  { id: 23, title: "Green Kitchen", filename: "imgi_204_green-kitchen.png" },
  { id: 24, title: "HM Enterprise", filename: "imgi_207_HM-Enterprise.png" },
  { id: 25, title: "Eco Travels", filename: "imgi_208_Eco-Travels.png" },
  { id: 26, title: "Hamesha Food", filename: "imgi_209_HAMESHA-FOOD.png" },
  { id: 27, title: "Amanot Foods", filename: "imgi_211_Amanot-Foods.png" },
  { id: 28, title: "Shadamon Shop", filename: "imgi_217_Shadamon-Shop.png" },
  { id: 29, title: "Bobbin", filename: "imgi_219_Bobbin.png" },
  { id: 30, title: "Sensible Match", filename: "imgi_21_sensiblematch.png" },
].map((item, idx) => ({
  id: `fallback-${item.id || idx}`,
  title: item.title,
  logo_url: localAssetMap[item.filename] || `/uploads/brands/${item.filename}`,
  logoUrl: localAssetMap[item.filename] || `/uploads/brands/${item.filename}`,
  sort_order: idx + 1,
  is_visible: true,
}));

export const ClientBrandSlider = ({
  title = "Clients We Have Helped with PBX",
  subtitle = "Teams and businesses across Bangladesh manage their business communication with MyBDPhone.",
  initialBrands = null,
}) => {
  const [brands, setBrands] = useState(initialBrands || []);
  const [loading, setLoading] = useState(!initialBrands || initialBrands.length === 0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      try {
        const res = await API.get("/v1/client-brands");
        if (isMounted && res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setBrands(res.data.data);
        } else if (isMounted && (!brands || brands.length === 0)) {
          setBrands(DEFAULT_FALLBACK_BRANDS);
        }
      } catch (err) {
        // Fallback to CMS collection or local seed assets
        try {
          const cmsRes = await API.get("/cms/public/collection/home_clients");
          if (isMounted && cmsRes.data?.items?.length) {
            const cmsBrands = cmsRes.data.items.map((it) => ({
              id: it.id,
              title: it.title,
              logoUrl: it.image_url,
              logo_url: it.image_url,
              sort_order: it.sort_order,
              is_visible: it.status === "active" || it.status === "published",
            }));
            setBrands(cmsBrands);
          } else if (isMounted && (!brands || brands.length === 0)) {
            setBrands(DEFAULT_FALLBACK_BRANDS);
          }
        } catch {
          if (isMounted && (!brands || brands.length === 0)) {
            setBrands(DEFAULT_FALLBACK_BRANDS);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBrands();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayBrands = useMemo(() => {
    const list = brands.filter((b) => b.is_visible !== false && b.isVisible !== false && b.status !== "inactive");
    if (list.length > 0) return list;
    return DEFAULT_FALLBACK_BRANDS;
  }, [brands]);

  // Group items into 2-row chunks for each slide page (10 items per slide on desktop: 2 rows x 5 columns)
  // To handle responsiveness smoothly, each slide holds a grid of up to 10 logos (2 rows x 5 cols on lg, 2 rows x 3 cols on md, 2 rows x 2 cols on mobile)
  const slidePages = useMemo(() => {
    const itemsPerSlide = 10;
    const pages = [];
    for (let i = 0; i < displayBrands.length; i += itemsPerSlide) {
      pages.push(displayBrands.slice(i, i + itemsPerSlide));
    }
    return pages;
  }, [displayBrands]);

  // Resolve image source: API upload, absolute URL, or local asset
  const resolveLogoSrc = (brand) => {
    const url = brand.logoUrl || brand.logo_url || brand.image_url || "";
    if (!url) return "";
    const filename = url.split("/").pop();
    if (localAssetMap[filename]) {
      return localAssetMap[filename];
    }
    return mediaUrl(url);
  };

  return (
    <section className="client-brands-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
      <div className="text-center max-w-3xl mx-auto mb-9">
        <span className="inline-flex px-3 py-1 rounded-full bg-[#e8f4f1] text-[#2A835F] text-[10px] font-black tracking-[.13em] uppercase">
          TRUSTED PARTNERS
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-[#092328]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm leading-6 text-slate-500 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="relative group/slider px-2 sm:px-12">
        {/* Left Navigation Arrow */}
        <button
          ref={prevRef}
          type="button"
          aria-label="Previous Brand Logos"
          className="brand-slider-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-[#12544F]/20 text-[#12544F] shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:bg-[#12544F] hover:text-white flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          ref={nextRef}
          type="button"
          aria-label="Next Brand Logos"
          className="brand-slider-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-[#12544F]/20 text-[#12544F] shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:bg-[#12544F] hover:text-white flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Swiper Container */}
        <div className="w-full overflow-hidden py-2">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 sm:h-28 rounded-2xl bg-white border border-slate-100 p-4 flex items-center justify-center animate-pulse"
                >
                  <div className="w-20 h-8 bg-slate-200/60 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay, A11y]}
              spaceBetween={20}
              slidesPerView={1}
              loop={slidePages.length > 1}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                // Re-init navigation elements
                setTimeout(() => {
                  if (swiper.params?.navigation && prevRef.current && nextRef.current) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                });
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="brand-logo-swiper w-full"
            >
              {slidePages.map((pageGroup, pageIdx) => (
                <SwiperSlide key={pageIdx} className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
                    {pageGroup.map((brand, bIdx) => {
                      const logoSrc = resolveLogoSrc(brand);
                      return (
                        <div
                          key={brand.id || `${pageIdx}-${bIdx}`}
                          className="group relative h-24 sm:h-28 bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(18,84,79,0.12)] hover:border-[#2A835F]/60 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer"
                        >
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt={brand.title || "Client Brand Logo"}
                              className="max-h-12 sm:max-h-14 max-w-[85%] object-contain transition-all duration-300 group-hover:scale-105"
                              onError={(e) => {
                                const target = e.currentTarget;
                                const fallbackFilename = brand.logo_url?.split("/").pop() || brand.logoUrl?.split("/").pop();
                                if (fallbackFilename && localAssetMap[fallbackFilename] && target.src !== localAssetMap[fallbackFilename]) {
                                  target.src = localAssetMap[fallbackFilename];
                                } else {
                                  target.style.display = "none";
                                  const textEl = target.parentElement?.querySelector(".fallback-brand-title");
                                  if (textEl) textEl.style.display = "block";
                                }
                              }}
                            />
                          ) : null}
                          <span
                            className="fallback-brand-title font-bold text-sm sm:text-sm text-[#092328] text-center line-clamp-2"
                            style={{ display: logoSrc ? "none" : "block" }}
                          >
                            {brand.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Custom Pagination Indicators */}
        {slidePages.length > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            {slidePages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => swiperInstance?.slideToLoop(dotIdx)}
                aria-label={`Go to slide page ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  dotIdx === activeIndex
                    ? "w-8 bg-[#12544F]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientBrandSlider;
