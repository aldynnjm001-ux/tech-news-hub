"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Search, Menu, X, Bookmark } from "lucide-react";
import NotificationsBell from "./notifications-bell";
import "./navbar.css";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => pathname?.includes(path);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="navbar glass">
      <div className="container navbar-container">
        <div className="navbar-brand">
          <Link href="/">
            <h1 className="text-gradient">أخبار التكنولوجيا</h1>
          </Link>
        </div>

        <nav className={`navbar-nav ${isMenuOpen ? 'mobile-open' : 'hidden-mobile'}`}>
          <Link href="/category/ai" className={`nav-link ${isActive('/category/ai') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>الذكاء الاصطناعي</Link>
          <Link href="/category/cybersecurity" className={`nav-link ${isActive('/category/cybersecurity') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>الأمن السيبراني</Link>
          <Link href="/category/hardware" className={`nav-link ${isActive('/category/hardware') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>العتاد والأجهزة</Link>
          <Link href="/category/software" className={`nav-link ${isActive('/category/software') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>البرمجيات</Link>
          <Link href="/category/space" className={`nav-link ${isActive('/category/space') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>الفضاء والعلوم</Link>
          <Link href="/category/crypto" className={`nav-link ${isActive('/category/crypto') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>العملات الرقمية</Link>
          <Link href="/category/gaming" className={`nav-link ${isActive('/category/gaming') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>الألعاب</Link>
          <Link href="/category/global" className={`nav-link ${isActive('/category/global') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>تقنيات عالمية</Link>
        </nav>

        <div className="navbar-actions">
          {/* Search Icon */}
          <button 
            className="icon-btn" 
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
            
          {/* Saved Articles */}
          <Link href="/saved" className={`icon-btn ${pathname === '/saved' ? 'text-primary' : ''}`} aria-label="Saved Articles" title="المحفوظات">
            <Bookmark size={20} />
          </Link>

            {/* Notifications */}
            <NotificationsBell />
          <button 
            className="icon-btn" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="icon-btn menu-btn hidden-desktop" 
            aria-label="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay glass">
          <div className="container">
            <form onSubmit={handleSearch} className="search-form">
              <input 
                type="text" 
                placeholder="ابحث عن أخبار التقنية..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-submit-btn">
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
