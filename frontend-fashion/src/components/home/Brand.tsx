import { useBrand } from "@/hooks/queries/useBrand";
export default function Brands({ parentClass = "flat-spacing-2" }) {
  const { data, isLoading, isError } = useBrand();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!data?.length) return <div>No data</div>;
  return (
    <div className={parentClass}>
      <div className="container">
        <div className="infiniteslide_wrap" style={{ overflow: "hidden" }}>
          <div
            className="infiniteslide tf-brand"
            data-clone={2}
            data-style="infiniteslide17418080312321156"
            data-speed={80}
            style={{
              display: "flex",
              flexFlow: "row",
              alignItems: "center",
              animation:
                "18s linear 0s infinite normal none running infiniteslide17418080312321156",
            }}
          >
            {data.map((item) => (
              <div
                className="brand-item"
                style={{ flex: "0 0 auto", display: "block" }}
              >
                <img
                  alt="brand"
                  src={item?.logoSrc ?? ""}
                  width="360"
                  height="171"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
