"use client";
import { useProductReviews } from "@/hooks/queries/useProduct";

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "";

export default function Reviews({ productId }: { productId: number }) {
  const { data, isLoading } = useProductReviews(productId);

  if (isLoading) return <p>Đang tải đánh giá...</p>;

  const summary = data?.summary;
  const items = data?.items ?? [];
  const total = summary?.count ?? 0;

  return (
    <>
      <div className="review-heading">
        <h6 className="title">Customer review</h6>
        <div className="box-rate-review">
          <div className="rating-summary">
            <ul className="list-star">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <i className="icon icon-star" />
                </li>
              ))}
              <li>
                <span className="count-star text-md">({total})</span>
              </li>
            </ul>
            <span className="text-md rating-average">
              {summary?.average ?? 0}/5.0
            </span>
          </div>
          <div className="rating-breakdown">
            {(summary?.breakdown ?? []).map((b) => (
              <div className="rating-breakdown-item" key={b.star}>
                <div className="rating-score">
                  {b.star} <i className="icon icon-star" />
                </div>
                <div className="rating-bar">
                  <div
                    className="value"
                    style={{
                      width: total ? `${(b.count / total) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className="rating-count">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="review-section">
        {items.length === 0 ? (
          <p className="text-sm text-main-4">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <ul className="review-list">
            {items.map((review) => (
              <li className="review-item" key={review.id}>
                <div className="review-avt">
                  <img
                    alt="avt"
                    src={review.avatar || "/images/avatar/default.jpg"}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="review-content">
                  <div className="review-info">
                    <div className="review-meta">
                      <span className="review-author fw-medium text-md">
                        {review.userName}
                      </span>
                      <span className="review-date text-sm">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="list-star">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          className="icon icon-star"
                          key={i}
                          style={{ opacity: i < review.rating ? 1 : 0.3 }}
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <p className="fw-medium text-sm mb-1">{review.title}</p>
                  )}
                  <p className="text text-sm text-main-4">{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
