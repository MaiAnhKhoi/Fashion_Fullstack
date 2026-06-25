"use client";
import { useState } from "react";
import Description from "./Description";
import Material from "./Material";
import ReturnPolicies from "./ReturnPolicies";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import type { ProductDetailResponse } from "@/types/product";

type PanelKey = "description" | "material" | "returnPolicies" | "additionalInfo" | "reviews";

export default function Descriptions({
  product,
}: {
  product: ProductDetailResponse;
}) {
  // Accordion tự quản lý (không phụ thuộc Bootstrap collapse JS).
  const [open, setOpen] = useState<PanelKey | null>("description");
  const toggle = (key: PanelKey) => setOpen((cur) => (cur === key ? null : key));

  const panels: { key: PanelKey; title: string; body: React.ReactNode }[] = [
    { key: "description", title: "Descriptions", body: <Description product={product} /> },
    { key: "material", title: "Materials", body: <Material /> },
    { key: "returnPolicies", title: "Return Policies", body: <ReturnPolicies /> },
    {
      key: "additionalInfo",
      title: "Additional Information",
      body: <AdditionalInfo product={product} />,
    },
    { key: "reviews", title: "Reviews", body: <Reviews productId={product.id} /> },
  ];

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        {panels.map((p) => (
          <div key={p.key} className="widget-accordion wd-product-descriptions">
            <div
              className={`accordion-title ${open === p.key ? "" : "collapsed"}`}
              role="button"
              onClick={() => toggle(p.key)}
            >
              <span>{p.title}</span>
              <span className="icon icon-arrow-down" />
            </div>
            <div className={`collapse ${open === p.key ? "show" : ""}`}>
              <div className="accordion-body">{p.body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
