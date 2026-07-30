import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: string;
}

export default function Pagination({ currentPage, totalPages, basePath, queryParams = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    const pageParam = `page=${page}`;
    if (queryParams) {
      return `${basePath}?${queryParams}&${pageParam}`;
    }
    return `${basePath}${separator}${pageParam}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div>
      <nav className="pagination" aria-label="التنقل بين الصفحات">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link href={getPageUrl(currentPage - 1)} className="pagination-btn nav-arrow">
            <ChevronRight size={16} />
            السابق
          </Link>
        ) : (
          <span className="pagination-btn nav-arrow disabled">
            <ChevronRight size={16} />
            السابق
          </span>
        )}

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </Link>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link href={getPageUrl(currentPage + 1)} className="pagination-btn nav-arrow">
            التالي
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span className="pagination-btn nav-arrow disabled">
            التالي
            <ChevronLeft size={16} />
          </span>
        )}
      </nav>
      <p className="pagination-info">
        صفحة {currentPage} من {totalPages}
      </p>
    </div>
  );
}
