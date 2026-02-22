import React, { useState, useEffect , useRef} from "react";
import { useParams } from "react-router-dom";
import withLoader from "@/hoc/withLoader";
import ProductDetailView from "./ProductDetailView";

// const ProductDetailWithLoader = withLoader(ProductDetailView);

/* ---------------- Image Helper ---------------- */

const unsplash = (id, width, quality = 75) =>
  `https://images.unsplash.com/${id}?w=${width}&q=${quality}&auto=format&fit=crop`;

const ProductDetailContainer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const mockProduct = {
      id,
      name: "Premium Wireless Earbuds Pro",
      sku: "WEP-2024-001",
      description: `Experience superior audio quality with our Premium Wireless Earbuds Pro. Featuring advanced noise cancellation technology, these earbuds deliver crystal-clear sound whether you're commuting, working out, or relaxing at home.`,

      price: 299.99,
      discount: 15,
      rating: 4.8,
      reviewCount: 1247,
      inStock: true,
      stockCount: 47,
      category: "Electronics",

      /* 🔥 Optimized Images */
      images: [
        {
          large: unsplash("photo-1722040456443-c644d014d43f", 1200, 80),
          medium: unsplash("photo-1722040456443-c644d014d43f", 900, 75),
          thumb: unsplash("photo-1722040456443-c644d014d43f", 200, 60),
          alt: "Premium white wireless earbuds in charging case",
        },
        {
          large: unsplash("photo-1730848750011-4f1df6493f36", 1200, 80),
          medium: unsplash("photo-1730848750011-4f1df6493f36", 900, 75),
          thumb: unsplash("photo-1730848750011-4f1df6493f36", 200, 60),
          alt: "Wireless earbuds close-up with ergonomic fit",
        },
        {
          large: unsplash("photo-1565267319814-d7591ba84ad9", 1200, 80),
          medium: unsplash("photo-1565267319814-d7591ba84ad9", 900, 75),
          thumb: unsplash("photo-1565267319814-d7591ba84ad9", 200, 60),
          alt: "Earbuds packaging and accessories",
        },
        {
          large: unsplash("photo-1606813907291-d86efa9b94db", 1200, 80),
          medium: unsplash("photo-1606813907291-d86efa9b94db", 900, 75),
          thumb: unsplash("photo-1606813907291-d86efa9b94db", 200, 60),
          alt: "Person using wireless earbuds outdoors",
        },
        {
          large: unsplash("photo-1618366712010-f4ae9c647dcb", 1200, 80),
          medium: unsplash("photo-1618366712010-f4ae9c647dcb", 900, 75),
          thumb: unsplash("photo-1618366712010-f4ae9c647dcb", 200, 60),
          alt: "Earbuds with charging case open",
        },
      ],

      colors: ["Midnight Black", "Pearl White", "Ocean Blue", "Rose Gold"],
      sizes: ["Standard", "Small", "Large"],

      features: [
        "Active Noise Cancellation (ANC) with transparency mode",
        "8 hours playback + 24 hours with charging case",
        "IPX7 water and sweat resistance rating",
        "Bluetooth 5.3 with multipoint connectivity",
        "Touch controls for calls, music, and voice assistant",
        "Fast charging: 15 minutes = 2 hours playback",
        "Premium audio drivers with deep bass response",
        "Ergonomic design with 3 ear tip sizes included",
      ],

      specifications: {
        "Driver Size": "10mm dynamic drivers",
        "Frequency Response": "20Hz - 20kHz",
        "Bluetooth Version": "5.3",
        "Bluetooth Range": "Up to 33 feet (10 meters)",
        "Battery Life": "8 hours (earbuds) + 24 hours (case)",
        "Charging Time": "1.5 hours (full charge)",
        "Charging Port": "USB-C",
        "Water Resistance": "IPX7",
        Weight: "4.5g per earbud",
        Microphone: "Dual beamforming microphones",
        "Codec Support": "AAC, SBC",
        "Voice Assistant": "Siri, Google Assistant compatible",
      },
    };

    timeoutRef.current = setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 100);
    return ()=>{
      clearTimeout(timeoutRef.current);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-[76px] px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
};

export default ProductDetailContainer;
